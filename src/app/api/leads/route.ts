import { NextResponse } from "next/server";
import { adminClient, requireAdmin } from "@/lib/admin";
import { leadSchema } from "@/lib/validation";
import { newEventId, sendConversionsLead } from "@/lib/conversions";
import { withAttribution } from "@/lib/utm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  // Honeypot is evaluated before validation. A bot gets a decoy success and no
  // database row, and learns nothing about which rule caught it.
  if (typeof body.company_site === "string" && body.company_site.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });

  const { company_site: _honeypot, ...lead } = parsed.data;
  const attribution = withAttribution(lead);

  const supabase = adminClient();
  if (!supabase) return NextResponse.json({ error: "Contact service is not configured yet." }, { status: 503 });

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: duplicate } = await supabase.from("leads").select("id").eq("email", lead.email).gte("created_at", since).maybeSingle();
  if (duplicate) return NextResponse.json({ error: "We already received a message from this email recently." }, { status: 429 });

  const eventId = newEventId();
  const { error } = await insertLead(supabase, attribution, lead);
  if (error) return NextResponse.json({ error: "We couldn’t save your message. Please try again." }, { status: 500 });

  // Only a confirmed, stored lead counts as a conversion — never a button click.
  void sendConversionsLead(lead, eventId);
  await sendNotifications(lead);

  return NextResponse.json({ ok: true, eventId }, { status: 201 });
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = adminClient(); if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  return error ? NextResponse.json({ error: "Unable to load leads" }, { status: 500 }) : NextResponse.json(data);
}

/**
 * Inserts a lead, retrying without attribution if the schema has not been
 * migrated yet. Losing a lead because an optional column is missing would be far
 * worse than losing the attribution on it.
 */
async function insertLead(supabase: NonNullable<ReturnType<typeof adminClient>>, attribution: Record<string, unknown>, lead: Record<string, unknown>) {
  const withAttribution = await supabase.from("leads").insert({ ...attribution, ...lead, status: "NEW" });
  if (!withAttribution.error) return withAttribution;

  if (/column .* does not exist|schema cache/i.test(withAttribution.error.message)) {
    console.warn("[leads] attribution columns missing — run supabase/migrations/002_campaign_attribution.sql");
    return supabase.from("leads").insert({ ...lead, status: "NEW" });
  }
  return withAttribution;
}

async function sendNotifications(lead: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY; const from = process.env.LEADS_FROM_EMAIL; const to = process.env.LEADS_TO_EMAIL;
  if (!key || !from || !to) return;
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  const subject = `New iCodeee lead — ${s(lead.name)}`;
  const escape = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
  const rows = [
    ["Email", s(lead.email)], ["Company", s(lead.company)], ["Phone", s(lead.phone)],
    ["Focus", s(lead.project_type)], ["Budget", s(lead.budget)],
    // Funnel fields — only present when the lead came through the estimate funnel.
    ["Package", s(lead.package_name)], ["Indicative range", s(lead.estimate_range)],
    ["Free demo requested", lead.demo_requested ? "YES" : ""],
  ].filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#666">${escape(k)}</td><td><b>${escape(v)}</b></td></tr>`).join("");
  const html = `<h1>${escape(subject)}</h1><table style="border-collapse:collapse">${rows}</table><p style="white-space:pre-wrap">${escape(s(lead.message))}</p>`;
  await Promise.allSettled([
    fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], reply_to: s(lead.email), subject, html }) }),
    fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [s(lead.email)], subject: "We received your iCodeee brief", html: `<p>Hi ${escape(s(lead.name))},</p><p>Thanks for getting in touch with iCodeee. We’ve received your brief and will get back to you shortly.</p>` }) }),
  ]);
}
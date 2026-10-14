"use client";

import { useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { contact, hasPhone, hasWhatsApp, phoneHref, whatsappHref } from "@/lib/site";

const initial = { name: "", email: "", phone: "", company: "", website: "", project_type: "", budget: "", message: "", company_site: "" };
const MIN_MESSAGE = 20;

/** Maps a failed submission to something a visitor can actually act on. */
function fallbackBlock(form: typeof initial) {
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.phone && `Phone: ${form.phone}`,
    form.company && `Company: ${form.company}`,
    form.website && `Website: ${form.website}`,
    form.project_type && `Project: ${form.project_type}`,
    form.budget && `Budget: ${form.budget}`,
    "",
    form.message,
  ].filter((line): line is string => Boolean(line)).join("\n");
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`Project enquiry from ${form.name || "website"}`)}&body=${encodeURIComponent(body)}`;
  return <div className="form-fallback">
    <p><b>The form didn&apos;t send.</b> Open a prefilled email and send it, or contact us directly:</p>
    <div>
      <a href={mailto}><Mail size={15} strokeWidth={2} aria-hidden="true" />Email your brief</a>
      {hasPhone && <a href={phoneHref}><Phone size={15} strokeWidth={2} aria-hidden="true" />{contact.phone}</a>}
      {hasWhatsApp && <a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={15} strokeWidth={2} aria-hidden="true" />WhatsApp</a>}
    </div>
  </div>;
}

export function ContactForm({ defaults }: { defaults?: { projectType?: string; message?: string } }) {
  const [form, setForm] = useState({ ...initial, project_type: defaults?.projectType ?? "", message: defaults?.message ?? "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const remaining = MIN_MESSAGE - form.message.trim().length;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn’t send your message.");
      setState("sent");
      setForm({ ...initial, project_type: defaults?.projectType ?? "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [event.target.name]: event.target.value });

  if (state === "sent") return <div className="form-success" role="status"><p className="eyebrow">Message received</p><h2>WE&apos;LL BE IN<br /><span>TOUCH.</span></h2><p>Thanks for sharing the brief. We&apos;ll review it and get back to you as soon as we can.</p><button className="button" onClick={() => setState("idle")}>Send another <span>→</span></button></div>;

  return <form className="contact-form" onSubmit={submit}>
    <div className="honeypot" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" name="company_site" value={form.company_site} onChange={update} /></label></div>
    <div className="form-grid">
      <Field label="Name" name="name" value={form.name} update={update} required autoComplete="name" />
      <Field label="Email" name="email" type="email" inputMode="email" autoComplete="email" value={form.email} update={update} required />
      <Field label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} update={update} />
      <Field label="Company" name="company" autoComplete="organization" value={form.company} update={update} />
      <Field label="Website" name="website" type="url" inputMode="url" autoComplete="url" value={form.website} update={update} placeholder="https://" />
      <label>What are you building?<select name="project_type" value={form.project_type} onChange={update}>
        <option value="">Choose a focus</option><option>Brand identity</option><option>Website or web product</option><option>Ecommerce store</option><option>UI / UX design</option><option>Content strategy</option><option>Graphic design</option><option>Something else</option>
      </select></label>
      <label>Indicative budget<select name="budget" value={form.budget} onChange={update}>
        <option value="">Choose a range</option><option>Under ₹1L</option><option>₹1L–₹3L</option><option>₹3L–₹8L</option><option>₹8L+</option>
      </select></label>
    </div>
    <label className="message-field">What&apos;s the opportunity?<textarea name="message" value={form.message} onChange={update} minLength={MIN_MESSAGE} required placeholder="Tell us what you’re building, where it needs to go, and what matters most." />{remaining > 0 && <span className="form-counter">{remaining} characters to go</span>}</label>
    {state === "error" && <div role="alert"><p className="form-error">{error}</p>{fallbackBlock(form)}</div>}
    <button className="button" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send the brief"}<span>→</span></button>
  </form>;
}

function Field({ label, name, value, update, type = "text", required = false, placeholder, autoComplete, inputMode }: {
  label: string; name: string; value: string; update: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; placeholder?: string; autoComplete?: string; inputMode?: "text" | "email" | "tel" | "url";
}) {
  return <label>{label}<input name={name} type={type} value={value} onChange={update} required={required} placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} /></label>;
}

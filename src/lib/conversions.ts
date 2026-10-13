import { createHash, randomUUID } from "node:crypto";

const GRAPH_URL = "https://graph.facebook.com/v21.0";

type LeadInput = {
  email?: string;
  phone?: string;
  name?: string;
  [key: string]: unknown;
};

/**
 * Sends a Lead event through the Conversions API.
 *
 * Runs only after the lead is durably stored, and shares the caller's event_id
 * with the browser so Meta deduplicates instead of counting the conversion twice.
 * Silently no-ops when the required environment variables are absent.
 */
export async function sendConversionsLead(lead: LeadInput, eventId: string): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_TOKEN;
  if (!pixelId || !accessToken) return;

  const testCode = process.env.META_CAPI_TEST_EVENT_CODE;

  try {
    const response = await fetch(`${GRAPH_URL}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Lead",
            event_id: eventId,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            user_data: {
              em: lead.email ? [hash(lead.email)] : undefined,
              ph: lead.phone ? [hash(lead.phone)] : undefined,
              client_ip_address: undefined,
              client_user_agent: undefined,
            },
          },
        ],
        ...(testCode ? { test_event_code: testCode } : {}),
      }),
    });

    if (!response.ok) {
      // Tracking must never break the enquiry itself.
      console.error("[capi] Conversions API rejected the event:", response.status, await response.text());
    }
  } catch (error) {
    console.error("[capi] Conversions API request failed:", error);
  }
}

/** SHA-256, lowercased and trimmed, per Meta's user-data hashing rules. */
function hash(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function newEventId(): string {
  return randomUUID();
}
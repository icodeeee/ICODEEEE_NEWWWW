/**
 * First-party campaign attribution.
 *
 * Landing parameters are read once on arrival and persisted so they survive the
 * multi-step path from ad click to enquiry. Nothing here identifies a person —
 * it records which link brought the visitor.
 */

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export const CLICK_IDS = ["fbclid", "gclid"] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | (typeof CLICK_IDS)[number], string>>;

const STORAGE_KEY = "icodeee_attribution";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type Stored = { params: Attribution; capturedAt: number };

function isAttribution(value: unknown): value is Stored {
  return Boolean(value && typeof value === "object" && "params" in value && "capturedAt" in value);
}

function readStored(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isAttribution(parsed)) return {};
    if (Date.now() - parsed.capturedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return parsed.params;
  } catch {
    return {};
  }
}

/** Called once on first load. Existing attribution is never overwritten mid-visit. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const search = new URLSearchParams(window.location.search);
  const incoming: Attribution = {};
  for (const key of [...UTM_KEYS, ...CLICK_IDS]) {
    const value = search.get(key);
    if (value) incoming[key] = value.slice(0, 200);
  }
  const existing = readStored();
  if (Object.keys(incoming).length === 0) return existing;
  const merged = { ...existing, ...incoming };
  try {
    const payload: Stored = { params: merged, capturedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* Private browsing or storage disabled — attribution is best-effort. */
  }
  return merged;
}

export function getAttribution(): Attribution {
  return readStored();
}

/** Appends attribution to the lead payload so the stored record carries the campaign. */
export function withAttribution<T extends Record<string, unknown>>(payload: T): T & Attribution {
  return { ...payload, ...getAttribution() };
}
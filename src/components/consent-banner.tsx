"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "icodeee_consent";

export type ConsentChoice = "granted" | "denied";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
    // Expire the record after a year so consent is re-confirmed periodically.
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${STORAGE_KEY}=${choice}; path=/; max-age=31536000; expires=${expires}; SameSite=Lax`;
  } catch {
    /* Storage unavailable — the pixel simply stays uninitialised. */
  }
}

/**
 * Analytics and advertising consent.
 *
 * Nothing that writes a cookie or fires a pixel runs until this is accepted, so
 * the site makes no non-essential tracking requests for a visitor who declines.
 */
export function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);

  useEffect(() => {
    setChoice(readConsent());
  }, []);

  if (choice === undefined) return null;
  if (choice !== null) return null;

  const decide = (value: ConsentChoice) => {
    writeConsent(value);
    setChoice(value);
    if (value === "granted") {
      // Let the Meta Pixel initialiser observe the new consent state.
      window.dispatchEvent(new CustomEvent("icodeee:consent", { detail: value }));
    }
  };

  return <div className="consent-banner" role="region" aria-label="Cookie and analytics consent">
    <p>
      We use cookies and Meta Pixel to understand how people find us and improve this site.
      Nothing is loaded until you choose. <a href="/privacy">Privacy</a>
    </p>
    <div>
      <button type="button" className="consent-decline" onClick={() => decide("denied")}>Decline</button>
      <button type="button" className="consent-accept" onClick={() => decide("granted")}>Accept</button>
    </div>
  </div>;
}
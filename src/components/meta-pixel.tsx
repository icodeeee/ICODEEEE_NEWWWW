"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readConsent } from "@/components/consent-banner";
import { captureAttribution } from "@/lib/utm";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export const pixelConfigured = Boolean(PIXEL_ID);

/**
 * Loads the Meta Pixel only after analytics consent, and keeps a single instance
 * no matter how many times this component mounts.
 *
 * No-op when NEXT_PUBLIC_META_PIXEL_ID is unset, so local and preview
 * environments stay free of advertising requests.
 */
export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PIXEL_ID) return;
    captureAttribution();

    const boot = () => {
      if (window.fbq) return;
      // Standard Meta pixel bootstrap.
      if (!document.getElementById("facebook-pixel")) {
        const script = document.createElement("script");
        script.id = "facebook-pixel";
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(script);
      }
      const fbq = function (...args: unknown[]) {
        // eslint-disable-next-line prefer-rest-params
        (fbq as unknown as { q: unknown[] }).q.push(args);
      };
      (fbq as unknown as { q: unknown[] }).q = [];
      window.fbq = fbq;
      window._fbq = fbq;
      window.fbq("init", PIXEL_ID);
    };

    if (readConsent() === "granted") {
      boot();
      return;
    }

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<string | undefined>).detail;
      if (detail === "granted") boot();
    };
    window.addEventListener("icodeee:consent", onConsent);
    return () => window.removeEventListener("icodeee:consent", onConsent);
  }, []);

  // PageView on client-side navigation. Initial PageView is sent by the server
  // component below so it fires even when JavaScript is slow to hydrate.
  useEffect(() => {
    if (!PIXEL_ID || readConsent() !== "granted") return;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}

/** Server-rendered PageView so first impressions are recorded without waiting for hydration. */
export function MetaPixelServer() {
  if (!PIXEL_ID) return null;
  return <script
    // Only emitted when consent is already recorded; the inline check below is a
    // second guard for the returning-visitor case.
    dangerouslySetInnerHTML={{
      __html: `(function(){try{if(localStorage.getItem('icodeee_consent')!=='granted')return;!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView')}catch(e){}})();`,
    }}
  />;
}

/** Client-side Lead event, fired once on a confirmed successful submission. */
export function trackLead(eventId: string) {
  if (!PIXEL_ID || readConsent() !== "granted") return;
  window.fbq?.("track", "Lead", { eventID: eventId });
}
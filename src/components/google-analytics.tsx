"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readConsent } from "@/components/consent-banner";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID ??
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ??
  "";

export const gaConfigured = Boolean(GA_ID);

/**
 * Loads Google Analytics (gtag.js) only after analytics consent,
 * and maintains Google Consent Mode v2 so requests stay inert until granted.
 *
 * No-op when NEXT_PUBLIC_GA_ID is unset, keeping local and preview
 * environments clean.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID) return;

    const boot = () => {
      if (typeof window === "undefined") return;

      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function (...args: unknown[]) {
          window.dataLayer?.push(args);
        };
      }

      const consentGranted = readConsent() === "granted";

      // Configure Google Consent Mode v2 defaults
      window.gtag("consent", "default", {
        analytics_storage: consentGranted ? "granted" : "denied",
        ad_storage: consentGranted ? "granted" : "denied",
        ad_user_data: consentGranted ? "granted" : "denied",
        ad_personalization: consentGranted ? "granted" : "denied",
      });

      // Inject gtag.js if not already present
      if (!document.getElementById("google-analytics")) {
        const script = document.createElement("script");
        script.id = "google-analytics";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);
      }

      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        page_path: window.location.pathname,
        send_page_view: true,
      });
    };

    if (readConsent() === "granted") {
      boot();
      return;
    }

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<string | undefined>).detail;
      if (detail === "granted") {
        boot();
        window.gtag?.("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
        window.gtag?.("config", GA_ID, {
          page_path: window.location.pathname,
        });
      }
    };

    window.addEventListener("icodeee:consent", onConsent);
    return () => window.removeEventListener("icodeee:consent", onConsent);
  }, []);

  // Track page views on client-side route transitions
  useEffect(() => {
    if (!GA_ID || readConsent() !== "granted") return;
    window.gtag?.("config", GA_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}

/**
 * Server-rendered initialisation for returning visitors who already granted consent.
 */
export function GoogleAnalyticsServer() {
  if (!GA_ID) return null;
  return (
    <script
      id="google-analytics-init"
      dangerouslySetInnerHTML={{
        __html: `(function(){try{if(localStorage.getItem('icodeee_consent')!=='granted')return;window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'});gtag('js',new Date());gtag('config','${GA_ID}',{'send_page_view':true});if(!document.getElementById('google-analytics')){var s=document.createElement('script');s.id='google-analytics';s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);}}catch(e){}})();`,
      }}
    />
  );
}

/** Client-side custom event tracker for Google Analytics */
export function trackGAEvent(action: string, params?: Record<string, unknown>) {
  if (!GA_ID || readConsent() !== "granted") return;
  window.gtag?.("event", action, params);
}

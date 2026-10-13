import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./studio.css";
import "./project-imagery.css";
import "./services.css";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { ConsentBanner } from "@/components/consent-banner";
import { MetaPixel, MetaPixelServer } from "@/components/meta-pixel";
import { AttributionCapture } from "@/components/attribution-capture";
import { StructuredData } from "@/components/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

// Canonical, OG and sitemap URLs all derive from this. It MUST be the real
// public origin in production — a wrong value points every canonical tag at the
// wrong host. Failing loudly here beats shipping that silently.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteUrl = (rawSiteUrl && /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl : "http://localhost:3000").replace(/\/$/, "");

if (process.env.NODE_ENV === "production" && siteUrl.includes("localhost")) {
  console.warn(
    "[metadata] NEXT_PUBLIC_SITE_URL is not set to a public origin. Canonicals, Open Graph URLs and the sitemap will point at localhost.",
  );
}

const description =
  "iCodeee creates websites, ecommerce stores, digital experiences, content strategies and graphic design for growing businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "iCodeee — Extra. By design.", template: "%s | iCodeee" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "iCodeee",
    url: siteUrl,
    title: "iCodeee — Extra. By design.",
    description: "Websites, ecommerce and design built to move businesses forward.",
  },
  twitter: {
    card: "summary_large_image",
    title: "iCodeee — Extra. By design.",
    description: "Websites, ecommerce and design built to move businesses forward.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
    <body className={`${inter.variable} ${display.variable}`}>
      <MetaPixelServer />
      <StructuredData />
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      {children}
      <Footer />
      <AttributionCapture />
      <MetaPixel />
      <ConsentBanner />
    </body>
  </html>;
}
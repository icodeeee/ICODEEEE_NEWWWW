import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./studio.css";
import "./project-imagery.css";
import "./services.css";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://icodeee.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "iCodeee — Extra. By design.", template: "%s | iCodeee" },
  description: "iCodeee creates websites, ecommerce stores, digital experiences, content strategies and graphic design for growing businesses.",
  openGraph: { type: "website", siteName: "iCodeee", title: "iCodeee — Extra. By design.", description: "Websites, ecommerce and design built to move businesses forward." },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${inter.variable} ${display.variable}`}><a className="skip-link" href="#main">Skip to content</a><SiteHeader />{children}<Footer /></body></html>;
}

import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/**
 * Builds per-page social metadata.
 *
 * The root layout sets fallback OG tags, but without this every page shipped the
 * same generic card — so a shared link to a service page showed the homepage
 * title with no image. Each page now overrides title, description and URL.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "iCodeee",
      title: `${title} | iCodeee`,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | iCodeee`,
      description,
    },
  };
}
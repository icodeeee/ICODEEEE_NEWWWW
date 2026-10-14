import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-origin";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/admin", "/api/"] }, sitemap: `${base}/sitemap.xml` };
}

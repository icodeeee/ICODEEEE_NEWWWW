import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";
import { services } from "@/lib/services";

/**
 * lastModified is only emitted when a real modification date is known. Reporting
 * `new Date()` on every request tells crawlers every page changes constantly,
 * which devalues the signal and causes needless re-crawling.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/work", "/services", "/process", "/about", "/contact", "/privacy"];
  const projects = await getProjects();

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}` })),
    ...services.map((service) => ({ url: `${base}/services/${service.slug}` })),
    ...projects.map((project) => ({ url: `${base}/work/${project.slug}` })),
  ];
}
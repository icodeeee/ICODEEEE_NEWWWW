const LOCAL_ORIGIN = "http://localhost:3000";

/**
 * Use an explicit public origin when configured. On Vercel, fall back to the
 * stable production domain (or the deployment URL) so canonical metadata and
 * sitemap links never ship with localhost by default.
 */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const configuredIsLocal = configured?.includes("localhost") || configured?.includes("127.0.0.1");
  if (configured && /^https?:\/\//.test(configured) && (!process.env.VERCEL || !configuredIsLocal)) {
    return configured.replace(/\/$/, "");
  }

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return vercelDomain ? `https://${vercelDomain}` : LOCAL_ORIGIN;
}

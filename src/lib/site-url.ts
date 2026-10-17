/**
 * Public origin used for metadata, sitemap and robots.
 * NEXT_PUBLIC_SITE_URL wins (e.g. a custom domain); otherwise Netlify's
 * build-time URL (the primary site URL), then local development.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

import { checkEmbeddable } from "@/lib/embed-check";
import { getWebsiteBySlug } from "@/lib/websites";

/**
 * GET /api/embed/:slug → { frameable, reason, checkedAt }
 * Accepts a slug (not a URL) so the endpoint can only probe curated sites.
 */
export async function GET(_request: Request, context: RouteContext<"/api/embed/[slug]">) {
  const { slug } = await context.params;
  const site = await getWebsiteBySlug(slug);
  if (!site) return Response.json({ error: "Unknown website" }, { status: 404 });

  const result = await checkEmbeddable(site.websiteUrl);
  return Response.json(result, {
    headers: { "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
  });
}

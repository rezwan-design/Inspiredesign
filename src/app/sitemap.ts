import type { MetadataRoute } from "next";

import { getWebsites } from "@/lib/websites";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const websites = await getWebsites();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    ...websites.map((site) => ({
      url: `${siteUrl}/site/${site.slug}`,
      lastModified: site.dateAdded,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

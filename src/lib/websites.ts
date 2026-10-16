import "server-only";

import { categories } from "@/data/categories";
import captures from "@/data/captures.json";
import { websiteSeeds } from "@/data/websites";
import type {
  Category,
  CategorySlug,
  CategoryWithCount,
  TagWithCount,
  Website,
} from "@/lib/types";

/**
 * Data access layer. Every read goes through these async functions so the
 * static seed can later be swapped for a database or CMS (e.g. Supabase)
 * without touching components.
 */

interface Capture {
  previewImage?: string | null;
  fullPageImage?: string | null;
  mobileImage?: string | null;
  ogImage?: string | null;
  favicon?: string | null;
  frameable?: boolean | null;
}

const captureMap = captures as Record<string, Capture>;

const websites: Website[] = websiteSeeds.map((seed) => {
  const capture = captureMap[seed.slug] ?? {};
  return {
    ...seed,
    id: seed.slug,
    previewImage: capture.previewImage ?? null,
    fullPageImage: capture.fullPageImage ?? null,
    mobileImage: capture.mobileImage ?? null,
    ogImage: capture.ogImage ?? null,
    favicon: capture.favicon ?? null,
  };
});

const byRecent = (a: Website, b: Website) =>
  b.dateAdded.localeCompare(a.dateAdded) || a.name.localeCompare(b.name);

export async function getWebsites(): Promise<Website[]> {
  return [...websites].sort(byRecent);
}

export async function getWebsiteBySlug(slug: string): Promise<Website | null> {
  return websites.find((site) => site.slug === slug) ?? null;
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  return categories.map((category) => ({
    ...category,
    count: websites.filter((site) => site.category === category.slug).length,
  }));
}

export async function getCategory(slug: CategorySlug): Promise<Category | null> {
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getPopularTags(limit = 12): Promise<TagWithCount[]> {
  const counts = new Map<string, number>();
  for (const site of websites) {
    for (const tag of site.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}

/** Sites in the same category first, then sites sharing the most tags. */
export async function getRelatedWebsites(site: Website, limit = 4): Promise<Website[]> {
  return websites
    .filter((other) => other.slug !== site.slug)
    .map((other) => ({
      other,
      score:
        (other.category === site.category ? 3 : 0) +
        other.tags.filter((tag) => site.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.other.viewCount - a.other.viewCount)
    .slice(0, limit)
    .map(({ other }) => other);
}

/** Previous / next site in the default (recently added) order. */
export async function getAdjacentWebsites(slug: string) {
  const ordered = await getWebsites();
  const index = ordered.findIndex((site) => site.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: ordered[(index - 1 + ordered.length) % ordered.length],
    next: ordered[(index + 1) % ordered.length],
  };
}

/** Embedding hint recorded at capture time; the live check can override it. */
export async function getCapturedFrameable(slug: string): Promise<boolean | null> {
  return captureMap[slug]?.frameable ?? null;
}

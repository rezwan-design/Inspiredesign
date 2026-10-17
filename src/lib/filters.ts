import { categories } from "@/data/categories";
import type {
  CategorySlug,
  GalleryFilters,
  GalleryView,
  SortKey,
  Website,
} from "@/lib/types";

/** Pure, client-safe filtering shared by the gallery and any future API. */

export const DEFAULT_FILTERS: GalleryFilters = {
  category: null,
  tag: null,
  query: "",
  sort: "recent",
  view: "all",
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Recent" },
  { value: "popular", label: "Popular" },
  { value: "alphabetical", label: "A–Z" },
];

/** How many of the newest additions the "Recently added" view shows. */
export const RECENT_LIMIT = 12;

const categoryLabels = new Map(categories.map((c) => [c.slug, c.label]));
const categorySlugs = new Set<string>(categories.map((c) => c.slug));

export function categoryLabel(slug: CategorySlug) {
  return categoryLabels.get(slug) ?? slug;
}

export function parseFilters(params: URLSearchParams): GalleryFilters {
  const category = params.get("category");
  const sort = params.get("sort");
  const view = params.get("view");
  return {
    category: category && categorySlugs.has(category) ? (category as CategorySlug) : null,
    tag: params.get("tag") || null,
    query: params.get("q") ?? "",
    sort: sort === "popular" || sort === "alphabetical" ? sort : "recent",
    view: view === "recent" || view === "favorites" ? (view as GalleryView) : "all",
  };
}

export function filtersToSearch(filters: GalleryFilters): string {
  const params = new URLSearchParams();
  if (filters.view !== "all") params.set("view", filters.view);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.query.trim()) params.set("q", filters.query);
  if (filters.sort !== "recent") params.set("sort", filters.sort);
  const search = params.toString();
  return search ? `?${search}` : "";
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function searchableText(site: Website) {
  return normalize(
    [
      site.name,
      site.websiteUrl,
      categoryLabel(site.category),
      site.industry,
      site.description,
      ...site.tags,
      ...site.tags.map((t) => t.replace(/-/g, " ")),
    ].join(" "),
  );
}

export function matchesQuery(site: Website, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = searchableText(site);
  return terms.every((term) => haystack.includes(term));
}

const sorters: Record<SortKey, (a: Website, b: Website) => number> = {
  recent: (a, b) => b.dateAdded.localeCompare(a.dateAdded) || a.name.localeCompare(b.name),
  popular: (a, b) => b.viewCount - a.viewCount,
  alphabetical: (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
};

export function applyFilters(
  websites: Website[],
  filters: GalleryFilters,
  favorites: ReadonlySet<string> = new Set(),
): Website[] {
  let result = websites;

  if (filters.view === "recent") {
    result = [...result].sort(sorters.recent).slice(0, RECENT_LIMIT);
  } else if (filters.view === "favorites") {
    result = result.filter((site) => favorites.has(site.slug));
  }

  if (filters.category) result = result.filter((site) => site.category === filters.category);
  if (filters.tag) result = result.filter((site) => site.tags.includes(filters.tag!));
  if (filters.query) result = result.filter((site) => matchesQuery(site, filters.query));

  return [...result].sort(sorters[filters.sort]);
}

/** Slugs of the newest additions, used for the "New" badge. */
export function newestSlugs(websites: Website[], count = 6) {
  return new Set([...websites].sort(sorters.recent).slice(0, count).map((s) => s.slug));
}

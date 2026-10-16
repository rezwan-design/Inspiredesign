/**
 * Core domain types. Kept free of framework imports so the same shapes can be
 * reused by a future database / CMS adapter (e.g. Supabase rows).
 */

export type CategorySlug =
  | "portfolio"
  | "agency"
  | "saas"
  | "ecommerce"
  | "landing-page"
  | "startup"
  | "technology"
  | "ai-products"
  | "architecture"
  | "photography"
  | "fashion"
  | "editorial"
  | "education"
  | "finance"
  | "web3"
  | "creative-studio"
  | "personal-website"
  | "mobile-apps";

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
}

export interface CategoryWithCount extends Category {
  count: number;
}

export interface Website {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  /** Desktop viewport screenshot used on gallery cards (16:10). */
  previewImage: string | null;
  /** Full-page desktop screenshot used when live preview is unavailable. */
  fullPageImage: string | null;
  /** Full-page mobile screenshot used for the mobile fallback. */
  mobileImage: string | null;
  /** The site's own Open Graph image, when one was found. */
  ogImage: string | null;
  favicon: string | null;
  category: CategorySlug;
  /** Finer-grained industry label shown next to the category. */
  industry: string;
  tags: string[];
  description: string;
  /** ISO date (YYYY-MM-DD). */
  dateAdded: string;
  featured: boolean;
  viewCount: number;
}

export type SortKey = "recent" | "popular" | "alphabetical";

export type GalleryView = "all" | "recent" | "favorites";

export interface GalleryFilters {
  category: CategorySlug | null;
  tag: string | null;
  query: string;
  sort: SortKey;
  view: GalleryView;
}

export interface TagWithCount {
  tag: string;
  count: number;
}

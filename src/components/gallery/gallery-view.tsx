"use client";

import { HeartIcon, SearchXIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

import { ActiveFilters, CategoryChips, SortControl } from "@/components/gallery/filter-controls";
import { WebsiteCard } from "@/components/gallery/website-card";
import { SearchInput, useSearchShortcut } from "@/components/sidebar/search-input";
import { Button } from "@/components/ui/button";
import { FROM_GALLERY_KEY, LAST_GALLERY_KEY, useGalleryFilters } from "@/hooks/use-gallery-filters";
import { useFavorites } from "@/hooks/use-favorites";
import { applyFilters, DEFAULT_FILTERS, filtersToSearch, newestSlugs } from "@/lib/filters";
import type { Category, GalleryFilters, Website } from "@/lib/types";
import { formatTag } from "@/lib/utils";

interface GalleryData {
  websites: Website[];
  categories: Category[];
}

type OnChange = (patch: Partial<GalleryFilters>, options?: { replace?: boolean }) => void;

/** Gallery bound to URL filters and favorites. */
export function GalleryView(data: GalleryData) {
  const { filters, setFilters } = useGalleryFilters();
  useSearchShortcut();

  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_GALLERY_KEY, filtersToSearch(filters));
    } catch {}
  }, [filters]);

  useEffect(() => {
    try {
      sessionStorage.removeItem(FROM_GALLERY_KEY);
    } catch {}
  }, []);

  return <GalleryContent {...data} filters={filters} onChange={setFilters} />;
}

/** Prerendered, unfiltered gallery shown until URL state is available. */
export function GalleryFallback(data: GalleryData) {
  return <GalleryContent {...data} filters={DEFAULT_FILTERS} onChange={() => {}} />;
}

function GalleryContent({
  websites,
  categories,
  filters,
  onChange,
}: GalleryData & { filters: GalleryFilters; onChange: OnChange }) {
  const { favorites, toggle } = useFavorites();
  const results = useMemo(() => applyFilters(websites, filters, favorites), [websites, filters, favorites]);
  const newest = useMemo(() => newestSlugs(websites), [websites]);
  const heading = getHeading(filters, categories);

  return (
    <div className="mx-auto w-full max-w-[2000px] px-4 pb-16 pt-6 md:px-8 md:pt-10">
      <header className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="min-w-0">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-faint-foreground">
              {heading.eyebrow}
            </p>
            <h1 className="flex items-start gap-2 text-[26px] font-semibold leading-8 tracking-[-0.025em] text-foreground">
              <span className="truncate">{heading.title}</span>
              <span
                className="mt-0.5 font-mono text-xs font-normal tracking-normal text-faint-foreground tabular-nums"
                aria-label={`${results.length} ${results.length === 1 ? "website" : "websites"}`}
              >
                {results.length}
              </span>
            </h1>
            {heading.description ? (
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">{heading.description}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3">
            <span className="text-[13px] text-muted-foreground md:hidden">Sort by</span>
            <SortControl value={filters.sort} onChange={(sort) => onChange({ sort }, { replace: true })} />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
          <SearchInput
            value={filters.query}
            onValueChange={(query) => onChange({ query }, { replace: true })}
            showShortcut={false}
          />
          <CategoryChips
            categories={categories}
            active={filters.category}
            onSelect={(category) => onChange({ category, view: "all", tag: null })}
          />
        </div>

        <ActiveFilters filters={filters} onChange={onChange} />
      </header>

      <section aria-label="Websites" className="mt-8" onClickCapture={markPreviewFromGallery}>
        {results.length ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            {results.map((site, index) => (
              <li key={site.slug}>
                <WebsiteCard
                  site={site}
                  isFavorite={favorites.has(site.slug)}
                  onToggleFavorite={toggle}
                  isNew={newest.has(site.slug)}
                  eager={index < 4}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState filters={filters} onChange={onChange} />
        )}
      </section>
    </div>
  );
}

/** Lets the preview page return here with history.back(), restoring scroll. */
function markPreviewFromGallery(event: React.MouseEvent) {
  const link = (event.target as HTMLElement).closest("a");
  if (!link?.getAttribute("href")?.startsWith("/site/")) return;
  try {
    sessionStorage.setItem(FROM_GALLERY_KEY, "1");
  } catch {}
}

function getHeading(filters: GalleryFilters, categories: Category[]) {
  const category = categories.find((c) => c.slug === filters.category);
  if (filters.view === "favorites")
    return { eyebrow: "Your collection", title: "Favorites", description: "Websites you saved on this device." };
  if (filters.view === "recent")
    return { eyebrow: "Index / New", title: "Recently added", description: "The latest additions to the index." };
  if (category) return { eyebrow: "Index / Category", title: category.label, description: category.description };
  if (filters.tag)
    return { eyebrow: "Index / Tag", title: formatTag(filters.tag), description: `Websites tagged “${formatTag(filters.tag)}”.` };
  return {
    eyebrow: "Index",
    title: "All websites",
    description: "Hand-picked websites worth studying, across every industry.",
  };
}

function EmptyState({ filters, onChange }: { filters: GalleryFilters; onChange: OnChange }) {
  const favoritesEmpty = filters.view === "favorites" && !filters.query && !filters.tag && !filters.category;

  if (favoritesEmpty) {
    return (
      <EmptyLayout
        icon={<HeartIcon />}
        title="No favorites yet"
        body="Hover over any website and tap the heart to save it here. Favorites stay on this device."
        action={
          <Button variant="outline" size="sm" onClick={() => onChange({ view: "all" })}>
            Browse all websites
          </Button>
        }
      />
    );
  }

  return (
    <EmptyLayout
      icon={<SearchXIcon />}
      title="No websites found"
      body={
        filters.query
          ? `Nothing matches “${filters.query.trim()}” with the current filters. Try a broader term or another category.`
          : "Nothing matches the current filters yet."
      }
      action={
        <div className="flex flex-wrap justify-center gap-2">
          {filters.query && (filters.category || filters.tag || filters.view !== "all") ? (
            <Button size="sm" onClick={() => onChange({ tag: null, category: null, view: "all" })}>
              Search all websites
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange({ query: "", tag: null, category: null, view: "all" })}
          >
            Clear filters
          </Button>
        </div>
      }
    />
  );
}

function EmptyLayout({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-strong/70 px-6 py-20 text-center">
      <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
        {icon}
      </span>
      <h2 className="text-[15px] font-medium text-foreground">{title}</h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{body}</p>
      <div className="mt-5">{action}</div>
    </div>
  );
}

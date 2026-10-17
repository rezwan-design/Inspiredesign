"use client";

import { ArrowUpRightIcon, HeartIcon, XIcon } from "lucide-react";
import Link from "next/link";

import { SiteThumbnail } from "@/components/gallery/site-thumbnail";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { categoryLabel } from "@/lib/filters";
import type { Website } from "@/lib/types";
import { cn, displayUrl, formatCount, formatDate, formatTag, outboundUrl } from "@/lib/utils";

interface SiteInfoPanelProps {
  site: Website;
  related: Website[];
  open: boolean;
  onClose: () => void;
}

/**
 * Details for the previewed site. Docked on the right on desktop, a bottom
 * sheet on small screens. Content stays in the DOM for crawlers when hidden.
 */
export function SiteInfoPanel({ site, related, open, onClose }: SiteInfoPanelProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(site.slug);

  return (
    <>
      {/* Scrim for the mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/20 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="site-details"
        aria-label={`About ${site.name}`}
        hidden={!open}
        className={cn(
          "scrollbar-thin z-40 overflow-y-auto bg-background",
          // Mobile: bottom sheet
          "fixed inset-x-0 bottom-0 max-h-[78dvh] rounded-t-2xl border-t shadow-2xl animate-fade-in",
          // Desktop: docked panel
          "md:static md:max-h-none md:w-[320px] md:shrink-0 md:rounded-none md:border-l md:border-t-0 md:shadow-none",
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-5 py-3 backdrop-blur">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint-foreground">Details</h2>
          <Button variant="ghost" size="icon-xs" onClick={onClose} aria-label="Close details">
            <XIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-6 px-5 py-5">
          <section>
            <p className="text-[15px] font-medium text-foreground">{site.name}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{site.description}</p>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <a href={outboundUrl(site.websiteUrl)} target="_blank" rel="noopener noreferrer">
                  Visit website
                  <ArrowUpRightIcon />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggle(site.slug)}
                aria-pressed={favorite}
                aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
                className="px-2.5"
              >
                <HeartIcon className={cn(favorite && "fill-current")} />
                {favorite ? "Saved" : "Save"}
              </Button>
            </div>
          </section>

          <dl className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-2.5 text-[13px]">
            <dt className="text-faint-foreground">Category</dt>
            <dd>
              <Link href={`/?category=${site.category}`} className="text-foreground hover:underline hover:underline-offset-4">
                {categoryLabel(site.category)}
              </Link>
            </dd>
            <dt className="text-faint-foreground">Industry</dt>
            <dd className="text-foreground">{site.industry}</dd>
            <dt className="text-faint-foreground">URL</dt>
            <dd className="truncate font-mono text-xs leading-5 text-foreground">{displayUrl(site.websiteUrl)}</dd>
            <dt className="text-faint-foreground">Added</dt>
            <dd className="text-foreground">{formatDate(site.dateAdded)}</dd>
            <dt className="text-faint-foreground">Views</dt>
            <dd className="font-mono text-xs leading-5 text-foreground tabular-nums">{formatCount(site.viewCount)}</dd>
          </dl>

          <section>
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-faint-foreground">Tags</h3>
            <ul className="flex flex-wrap gap-1.5">
              {site.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/?tag=${tag}`}
                    className="inline-flex h-7 items-center rounded-full border bg-surface px-2.5 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    {formatTag(tag)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {related.length ? (
            <section>
              <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-faint-foreground">
                More like this
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/site/${item.slug}`} replace className="group/card block">
                      <span className="block overflow-hidden rounded-md border transition-colors group-hover/card:border-border-strong">
                        <SiteThumbnail site={item} sizes="140px" />
                      </span>
                      <span className="mt-1.5 block truncate text-xs font-medium text-foreground">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
}

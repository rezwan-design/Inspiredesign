"use client";

import { ArrowUpRightIcon, HeartIcon } from "lucide-react";
import Link from "next/link";

import { Favicon } from "@/components/gallery/favicon";
import { SiteThumbnail } from "@/components/gallery/site-thumbnail";
import { categoryLabel } from "@/lib/filters";
import type { Website } from "@/lib/types";
import { cn, outboundUrl } from "@/lib/utils";

export const CARD_IMAGE_SIZES =
  "(min-width: 1600px) 22vw, (min-width: 1280px) 28vw, (min-width: 1024px) 38vw, (min-width: 768px) 46vw, 100vw";

interface WebsiteCardProps {
  site: Website;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
  isNew?: boolean;
  eager?: boolean;
}

export function WebsiteCard({ site, isFavorite, onToggleFavorite, isNew = false, eager = false }: WebsiteCardProps) {
  const previewHref = `/site/${site.slug}`;

  return (
    <article className="group/card relative flex flex-col" aria-labelledby={`site-${site.slug}`}>
      <div className="relative">
        <Link
          href={previewHref}
          className={cn(
            "block overflow-hidden rounded-lg border border-border bg-muted",
            "transition-[border-color,box-shadow,transform] duration-300 ease-out",
            "group-hover/card:border-border-strong group-hover/card:shadow-[0_12px_32px_-16px_rgba(17,17,16,0.28)]",
          )}
          aria-label={`Preview ${site.name}`}
          tabIndex={-1}
        >
          <SiteThumbnail site={site} sizes={CARD_IMAGE_SIZES} eager={eager} />
        </Link>

        {isNew ? (
          <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-surface/95 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm ring-1 ring-black/5">
            New
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => onToggleFavorite(site.slug)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${site.name} from favorites` : `Save ${site.name} to favorites`}
          className={cn(
            "absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-full bg-surface/95 shadow-sm ring-1 ring-black/5 backdrop-blur",
            "transition-[opacity,color,transform] duration-200 hover:scale-105 focus-visible:opacity-100",
            isFavorite
              ? "text-foreground opacity-100"
              : "text-muted-foreground opacity-0 hover:text-foreground group-hover/card:opacity-100 [@media(hover:none)]:opacity-100",
          )}
        >
          <HeartIcon className={cn("size-4", isFavorite && "fill-current")} />
        </button>
      </div>

      <div className="mt-3 flex items-start gap-2.5">
        <Favicon src={site.favicon} name={site.name} size={20} className="mt-px" />
        <div className="min-w-0 flex-1">
          <h3 id={`site-${site.slug}`} className="truncate text-sm font-medium leading-5 text-foreground">
            <Link href={previewHref} className="rounded-sm hover:underline hover:decoration-border-strong hover:underline-offset-4">
              {site.name}
            </Link>
          </h3>
          <p className="truncate text-[13px] leading-5 text-muted-foreground">
            {categoryLabel(site.category)}
            <span className="px-1 text-faint-foreground" aria-hidden="true">/</span>
            <span className="sr-only">, </span>
            {site.industry}
          </p>
        </div>
        <a
          href={outboundUrl(site.websiteUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${site.name} (opens in a new tab)`}
          title="Visit website"
          className="-mr-1.5 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-faint-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowUpRightIcon className="size-4" />
        </a>
      </div>
    </article>
  );
}

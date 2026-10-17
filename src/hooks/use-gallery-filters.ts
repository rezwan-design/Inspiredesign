"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { filtersToSearch, parseFilters } from "@/lib/filters";
import type { GalleryFilters } from "@/lib/types";

export const LAST_GALLERY_KEY = "vitrine:last-gallery";
/** Set when a preview was opened from the gallery, so "close" can go back in history. */
export const FROM_GALLERY_KEY = "vitrine:from-gallery";

/**
 * Gallery filter state lives in the URL so every view is shareable and the
 * back button works. Updates use the History API, which Next.js syncs with
 * `useSearchParams`, so filtering never triggers a server round trip.
 */
export function useGalleryFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const setFilters = useCallback(
    (patch: Partial<GalleryFilters>, options: { replace?: boolean } = {}) => {
      const next = { ...parseFilters(new URLSearchParams(window.location.search)), ...patch };
      const url = `/${filtersToSearch(next)}`;
      if (pathname !== "/") {
        router.push(url);
        return;
      }
      if (options.replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    },
    [pathname, router],
  );

  return { filters, setFilters };
}

/** Builds an href for a filter change (used for real links / middle-click). */
export function hrefFor(filters: GalleryFilters, patch: Partial<GalleryFilters>) {
  return `/${filtersToSearch({ ...filters, ...patch })}`;
}

/** True when the click should be left to the browser (new tab, etc.). */
export function isModifiedClick(event: React.MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

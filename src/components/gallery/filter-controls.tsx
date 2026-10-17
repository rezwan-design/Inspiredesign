"use client";

import { XIcon } from "lucide-react";

import { categoryLabel, SORT_OPTIONS } from "@/lib/filters";
import type { Category, GalleryFilters, SortKey } from "@/lib/types";
import { cn, formatTag } from "@/lib/utils";

type OnChange = (patch: Partial<GalleryFilters>, options?: { replace?: boolean }) => void;

/** Three-way segmented control; no dropdowns. */
export function SortControl({ value, onChange }: { value: SortKey; onChange: (sort: SortKey) => void }) {
  return (
    <div role="group" aria-label="Sort websites" className="inline-flex h-8 items-center rounded-md bg-muted p-0.5">
      {SORT_OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-7 rounded-[6px] px-3 text-[13px] transition-[background-color,color,box-shadow] duration-150",
              active
                ? "bg-surface font-medium text-foreground shadow-[0_1px_2px_rgba(17,17,16,0.08)] ring-1 ring-black/[0.04]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Removable chips for every active filter beyond the page heading. */
export function ActiveFilters({ filters, onChange }: { filters: GalleryFilters; onChange: OnChange }) {
  const chips: { key: string; label: string; clear: Partial<GalleryFilters> }[] = [];
  if (filters.view !== "all" && filters.category)
    chips.push({ key: "category", label: categoryLabel(filters.category), clear: { category: null } });
  if (filters.tag) chips.push({ key: "tag", label: `Tag: ${formatTag(filters.tag)}`, clear: { tag: null } });
  if (filters.query.trim()) chips.push({ key: "q", label: `“${filters.query.trim()}”`, clear: { query: "" } });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(chip.clear)}
          className="inline-flex h-7 max-w-full items-center gap-1.5 rounded-full border border-border bg-surface pl-3 pr-2 text-xs text-foreground transition-colors hover:border-border-strong"
          aria-label={`Remove filter ${chip.label}`}
        >
          <span className="truncate">{chip.label}</span>
          <XIcon className="size-3.5 text-faint-foreground" aria-hidden="true" />
        </button>
      ))}
      {chips.length > 1 ? (
        <button
          type="button"
          onClick={() => onChange({ tag: null, query: "" })}
          className="h-7 rounded-md px-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}

/** Horizontal category scroller shown below 1024px, where the sidebar is a drawer. */
export function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: GalleryFilters["category"];
  onSelect: (category: GalleryFilters["category"]) => void;
}) {
  const items = [{ slug: null, label: "All" }, ...categories];
  return (
    <div className="-mx-4 md:-mx-8 lg:hidden">
      <ul
        className="scrollbar-none flex gap-1.5 overflow-x-auto px-4 md:px-8"
        aria-label="Categories"
      >
        {items.map((item) => {
          const selected = active === item.slug;
          return (
            <li key={item.slug ?? "all"} className="shrink-0">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(item.slug)}
                className={cn(
                  "h-8 rounded-full border px-3 text-[13px] transition-colors",
                  selected
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

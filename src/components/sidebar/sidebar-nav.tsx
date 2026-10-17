"use client";

import { ClockIcon, HeartIcon, LayoutGridIcon } from "lucide-react";
import * as React from "react";

import { Logo } from "@/components/brand/logo";
import { SearchInput } from "@/components/sidebar/search-input";
import { hrefFor, isModifiedClick, useGalleryFilters } from "@/hooks/use-gallery-filters";
import { useFavorites } from "@/hooks/use-favorites";
import { DEFAULT_FILTERS, RECENT_LIMIT } from "@/lib/filters";
import type { CategoryWithCount, GalleryFilters, TagWithCount } from "@/lib/types";
import { cn, formatTag } from "@/lib/utils";

export interface SidebarData {
  categories: CategoryWithCount[];
  tags: TagWithCount[];
  total: number;
}

interface SidebarNavProps extends SidebarData {
  filters: GalleryFilters;
  favoritesCount: number;
  onChange: (patch: Partial<GalleryFilters>, options?: { replace?: boolean }) => void;
  /** Called after any navigation, e.g. to close the mobile drawer. */
  onNavigate?: () => void;
}

/** Live sidebar bound to the URL filters. */
export function SidebarContent({ onNavigate, ...data }: SidebarData & { onNavigate?: () => void }) {
  const { filters, setFilters } = useGalleryFilters();
  const { favorites } = useFavorites();
  return (
    <SidebarNav
      {...data}
      filters={filters}
      favoritesCount={favorites.size}
      onChange={setFilters}
      onNavigate={onNavigate}
    />
  );
}

/** Static placeholder rendered while URL state is resolved on the client. */
export function SidebarFallback(data: SidebarData) {
  return <SidebarNav {...data} filters={DEFAULT_FILTERS} favoritesCount={0} onChange={() => {}} />;
}

export function SidebarNav({
  categories,
  tags,
  total,
  filters,
  favoritesCount,
  onChange,
  onNavigate,
}: SidebarNavProps) {
  const select = (patch: Partial<GalleryFilters>) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    onChange(patch);
    onNavigate?.();
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
  };

  const isAll = filters.view === "all" && !filters.category && !filters.tag;
  const reset = { view: "all", category: null, tag: null, query: "" } as const;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-4 px-4 pb-4 pt-5">
        <Logo className="px-1" />
        <SearchInput value={filters.query} onValueChange={(query) => onChange({ query }, { replace: true })} />
      </div>

      <nav aria-label="Browse websites" className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 pb-8">
        <NavSection>
          <NavItem
            href={hrefFor(filters, reset)}
            onClick={select(reset)}
            active={isAll}
            icon={<LayoutGridIcon />}
            label="All websites"
            count={total}
          />
          <NavItem
            href={hrefFor(filters, { view: "recent", category: null, tag: null })}
            onClick={select({ view: "recent", category: null, tag: null })}
            active={filters.view === "recent"}
            icon={<ClockIcon />}
            label="Recently added"
            count={Math.min(RECENT_LIMIT, total)}
          />
          <NavItem
            href={hrefFor(filters, { view: "favorites", category: null, tag: null })}
            onClick={select({ view: "favorites", category: null, tag: null })}
            active={filters.view === "favorites"}
            icon={<HeartIcon />}
            label="Favorites"
            count={favoritesCount}
          />
        </NavSection>

        <NavSection title="Categories">
          {categories.map((category) => {
            const patch = { category: category.slug, view: "all", tag: null } as const;
            return (
              <NavItem
                key={category.slug}
                href={hrefFor(filters, patch)}
                onClick={select(patch)}
                active={filters.category === category.slug}
                label={category.label}
                count={category.count}
              />
            );
          })}
        </NavSection>

        <NavSection title="Popular tags">
          <ul className="flex flex-wrap gap-1.5 px-1 pt-1">
            {tags.map(({ tag, count }) => {
              const active = filters.tag === tag;
              const patch = { tag: active ? null : tag };
              return (
                <li key={tag}>
                  <a
                    href={hrefFor(filters, patch)}
                    onClick={select(patch)}
                    aria-current={active ? "true" : undefined}
                    title={`${count} websites`}
                    className={cn(
                      "inline-flex h-7 items-center rounded-full border px-2.5 text-xs transition-colors",
                      active
                        ? "border-foreground bg-foreground text-white"
                        : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                    )}
                  >
                    {formatTag(tag)}
                  </a>
                </li>
              );
            })}
          </ul>
        </NavSection>
      </nav>

      <div className="border-t px-5 py-4 text-xs leading-5 text-faint-foreground">
        A curated index of the well-made web.
        <br />
        <span className="font-mono">{total}</span> sites, updated weekly.
      </div>
    </div>
  );
}

function NavSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="pt-4 first:pt-0">
      {title ? (
        <h2 className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-faint-foreground">
          {title}
        </h2>
      ) : null}
      {Array.isArray(children) ? <ul className="flex flex-col gap-px">{wrapItems(children)}</ul> : children}
    </div>
  );
}

function wrapItems(children: React.ReactNode[]) {
  return React.Children.map(children, (child) => <li>{child}</li>);
}

interface NavItemProps {
  href: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  active: boolean;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

function NavItem({ href, onClick, active, label, count, icon }: NavItemProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-md px-2 text-[13.5px] transition-colors",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        active
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
      )}
    >
      {icon ? (
        <span className={cn(active ? "text-foreground" : "text-faint-foreground group-hover:text-muted-foreground")}>
          {icon}
        </span>
      ) : null}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined ? (
        <span className={cn("font-mono text-[11px] tabular-nums", active ? "text-muted-foreground" : "text-faint-foreground")}>
          {count}
        </span>
      ) : null}
    </a>
  );
}

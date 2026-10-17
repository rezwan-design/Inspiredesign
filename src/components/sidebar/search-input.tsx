"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  /** Shows the "/" shortcut hint. */
  showShortcut?: boolean;
}

/**
 * Search field with local state so typing stays smooth while the URL updates.
 * Any element marked with `data-search-input` can be focused with "/" or ⌘K.
 */
export function SearchInput({ value, onValueChange, className, showShortcut = true }: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Follow external changes (e.g. "Clear filters") unless the user is typing.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setDraft(value);
  }, [value]);

  const update = (next: string) => {
    setDraft(next);
    onValueChange(next);
  };

  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint-foreground"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        data-search-input
        type="search"
        value={draft}
        onChange={(event) => update(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            if (draft) update("");
            else inputRef.current?.blur();
          }
        }}
        placeholder="Search websites"
        aria-label="Search websites by name, category, industry or tag"
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "h-9 w-full rounded-md border border-border bg-surface pl-9 pr-9 text-sm text-foreground outline-none transition-colors",
          "placeholder:text-faint-foreground hover:border-border-strong focus:border-border-strong focus:ring-4 focus:ring-black/[0.04] focus-visible:outline-none",
          "[&::-webkit-search-cancel-button]:hidden",
        )}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        {draft ? (
          <button
            type="button"
            onClick={() => {
              update("");
              inputRef.current?.focus();
            }}
            className="inline-flex size-6 items-center justify-center rounded-[5px] text-faint-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Clear search"
          >
            <XIcon className="size-3.5" />
          </button>
        ) : showShortcut ? (
          <Kbd>/</Kbd>
        ) : null}
      </div>
    </div>
  );
}

/** Focuses the first visible search input on "/" or ⌘K / Ctrl+K. */
export function useSearchShortcut() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      const isSlash = event.key === "/" && !typing;
      const isCmdK = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (!isSlash && !isCmdK) return;
      const input = [...document.querySelectorAll<HTMLInputElement>("[data-search-input]")].find(
        (el) => el.offsetParent !== null,
      );
      if (!input) return;
      event.preventDefault();
      input.focus();
      input.select();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Favorites persisted in localStorage. Designed so the store can later be
 * replaced by a user-account backed collection without changing callers.
 */
const STORAGE_KEY = "vitrine:favorites";
const EMPTY: ReadonlySet<string> = new Set();

let cache: ReadonlySet<string> | null = null;
const listeners = new Set<() => void>();

function read(): ReadonlySet<string> {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = new Set(Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : []);
  } catch {
    cache = new Set();
  }
  return cache;
}

function write(next: ReadonlySet<string>) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Storage may be unavailable (private mode); keep the in-memory copy.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((slug: string) => {
    const next = new Set(read());
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    write(next);
  }, []);

  return { favorites, toggle, isFavorite: (slug: string) => favorites.has(slug) };
}

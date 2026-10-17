"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface FaviconProps {
  src: string | null;
  name: string;
  size?: number;
  className?: string;
}

/** Site icon with a monogram fallback. Decorative: the name is always shown nearby. */
export function Favicon({ src, name, size = 20, className }: FaviconProps) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        style={{ ...style, fontSize: Math.round(size * 0.5) }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[25%] bg-foreground font-semibold text-white",
          className,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // Favicons are tiny, pre-sized local PNGs; the image optimizer adds nothing here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={style}
      className={cn("shrink-0 rounded-[25%] bg-surface ring-1 ring-black/5", className)}
    />
  );
}

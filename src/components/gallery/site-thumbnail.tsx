"use client";

import Image from "next/image";
import { useState } from "react";

import { Favicon } from "@/components/gallery/favicon";
import type { Website } from "@/lib/types";
import { cn, displayUrl } from "@/lib/utils";

interface SiteThumbnailProps {
  site: Pick<Website, "name" | "previewImage" | "favicon" | "websiteUrl">;
  sizes: string;
  eager?: boolean;
  className?: string;
}

/** 16:10 screenshot with a skeleton while loading and a branded fallback when missing. */
export function SiteThumbnail({ site, sizes, eager = false, className }: SiteThumbnailProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(site.previewImage ? "loading" : "error");

  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-muted", className)}>
      {status === "loading" ? <div className="skeleton absolute inset-0" aria-hidden="true" /> : null}
      {site.previewImage && status !== "error" ? (
        <Image
          src={site.previewImage}
          alt={`Screenshot of the ${site.name} website`}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "object-cover object-top transition-[opacity,transform] duration-500 ease-out",
            "group-hover/card:scale-[1.015]",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
      {status === "error" ? <ThumbnailFallback site={site} /> : null}
    </div>
  );
}

export function ThumbnailFallback({
  site,
}: {
  site: Pick<Website, "name" | "favicon" | "websiteUrl">;
}) {
  return (
    <div className="canvas-dots absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
      <Favicon src={site.favicon} name={site.name} size={36} />
      <div>
        <p className="text-sm font-medium text-foreground">{site.name}</p>
        <p className="font-mono text-[11px] text-faint-foreground">{displayUrl(site.websiteUrl)}</p>
      </div>
    </div>
  );
}

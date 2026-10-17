"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PreviewBottomBar, PreviewToolbar } from "@/components/preview/preview-toolbar";
import type { Device } from "@/components/preview/responsive-preview-frame";
import { SiteInfoPanel } from "@/components/preview/site-info-panel";
import { WebsitePreview } from "@/components/preview/website-preview";
import { FROM_GALLERY_KEY, LAST_GALLERY_KEY } from "@/hooks/use-gallery-filters";
import type { Website } from "@/lib/types";

const DEVICE_KEY = "vitrine:preview-device";
const INFO_KEY = "vitrine:preview-info";
const DEVICE_BY_KEY: Record<string, Device> = { "1": "desktop", "2": "tablet", "3": "mobile" };

interface SitePreviewProps {
  site: Website;
  previous: Website;
  next: Website;
  related: Website[];
  frameableHint: boolean | null;
}

function deviceKey() {
  return window.matchMedia("(max-width: 767px)").matches ? `${DEVICE_KEY}:small` : DEVICE_KEY;
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

export function SitePreview({ site, previous, next, related, frameableHint }: SitePreviewProps) {
  const router = useRouter();
  const [device, setDeviceState] = useState<Device>("desktop");
  const [infoOpen, setInfoOpenState] = useState(false);

  // Restore preferences after mount (phones default to the mobile view).
  useEffect(() => {
    // Phones get their own remembered choice so a desktop preference doesn't
    // open a tiny scaled-down desktop view on a small screen.
    const small = window.matchMedia("(max-width: 767px)").matches;
    const stored = readStorage(deviceKey()) as Device | null;
    const fallback: Device = small ? "mobile" : "desktop";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from browser-only storage
    setDeviceState(stored && ["desktop", "tablet", "mobile"].includes(stored) ? stored : fallback);
    setInfoOpenState(readStorage(INFO_KEY) === "1" && window.matchMedia("(min-width: 1280px)").matches);
  }, []);

  const setDevice = useCallback((value: Device) => {
    setDeviceState(value);
    writeStorage(deviceKey(), value);
  }, []);

  const toggleInfo = useCallback(() => {
    setInfoOpenState((open) => {
      writeStorage(INFO_KEY, open ? "0" : "1");
      return !open;
    });
  }, []);

  const close = useCallback(() => {
    let fromGallery = false;
    let last = "";
    try {
      fromGallery = sessionStorage.getItem(FROM_GALLERY_KEY) === "1";
      last = sessionStorage.getItem(LAST_GALLERY_KEY) ?? "";
    } catch {}
    // Going back restores the gallery's filters and scroll position.
    if (fromGallery && window.history.length > 1) router.back();
    else router.push(`/${last}`);
  }, [router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;

      if (event.key === "Escape") {
        if (document.querySelector("[data-radix-popper-content-wrapper]")) return;
        event.preventDefault();
        if (infoOpen && window.matchMedia("(max-width: 767px)").matches) toggleInfo();
        else close();
      } else if (DEVICE_BY_KEY[event.key]) {
        setDevice(DEVICE_BY_KEY[event.key]);
      } else if (event.key === "ArrowLeft") {
        router.replace(`/site/${previous.slug}`);
      } else if (event.key === "ArrowRight") {
        router.replace(`/site/${next.slug}`);
      } else if (event.key.toLowerCase() === "i") {
        toggleInfo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, infoOpen, next.slug, previous.slug, router, setDevice, toggleInfo]);

  // Warm up neighbours for instant prev/next.
  useEffect(() => {
    router.prefetch(`/site/${previous.slug}`);
    router.prefetch(`/site/${next.slug}`);
  }, [router, previous.slug, next.slug]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <PreviewToolbar
        site={site}
        device={device}
        onDeviceChange={setDevice}
        onClose={close}
        previous={previous}
        next={next}
        infoOpen={infoOpen}
        onToggleInfo={toggleInfo}
      />
      <div className="relative flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1" aria-label={`Preview of ${site.name}`}>
          <WebsitePreview key={site.slug} site={site} device={device} frameableHint={frameableHint} />
        </main>
        <SiteInfoPanel site={site} related={related} open={infoOpen} onClose={toggleInfo} />
      </div>
      <PreviewBottomBar
        site={site}
        device={device}
        onDeviceChange={setDevice}
        infoOpen={infoOpen}
        onToggleInfo={toggleInfo}
      />
    </div>
  );
}

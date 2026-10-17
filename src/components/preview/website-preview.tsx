"use client";

import { ArrowUpRightIcon, ImageIcon, LoaderIcon, MonitorPlayIcon, ShieldOffIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ThumbnailFallback } from "@/components/gallery/site-thumbnail";
import { ResponsivePreviewFrame, type Device } from "@/components/preview/responsive-preview-frame";
import { Button } from "@/components/ui/button";
import type { Website } from "@/lib/types";
import { cn, displayUrl, outboundUrl } from "@/lib/utils";

type Status =
  | "checking" // asking the server whether the site allows framing
  | "loading" // iframe mounted, waiting for the document
  | "live" // iframe loaded
  | "slow" // iframe still loading after the timeout
  | "blocked"; // the site forbids embedding

type Mode = "live" | "screenshot";

const LOAD_TIMEOUT_MS = 12_000;

interface WebsitePreviewProps {
  site: Website;
  device: Device;
  /** Header check recorded at capture time, used if the live check fails. */
  frameableHint: boolean | null;
}

export function WebsitePreview({ site, device, frameableHint }: WebsitePreviewProps) {
  const [status, setStatus] = useState<Status>("checking");
  const [mode, setMode] = useState<Mode>("live");
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Ask the server whether this site can be embedded.
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/embed/${site.slug}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((result: { frameable: boolean | null }) => {
        const frameable = result.frameable ?? frameableHint;
        // Unknown → try the iframe and let the load timeout decide.
        setStatus(frameable === false ? "blocked" : "loading");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.warn("Embed check failed", error);
        setStatus(frameableHint === false ? "blocked" : "loading");
      });
    return () => controller.abort();
  }, [site.slug, frameableHint]);

  // 2. If the iframe takes too long, offer the screenshot instead.
  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("slow"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const iframeMounted = status === "loading" || status === "live" || status === "slow";
  const showIframe = mode === "live" && (status === "live" || status === "slow");
  const screenshot = device === "mobile" ? (site.mobileImage ?? site.fullPageImage) : (site.fullPageImage ?? site.mobileImage);

  return (
    <div className="relative h-full w-full">
      <ResponsivePreviewFrame device={device}>
        {/* Screenshot layer: instant first paint and the fallback when embedding is blocked. */}
        <ScreenshotView
          site={site}
          src={screenshot ?? site.previewImage}
          hidden={showIframe}
          dimmed={status === "checking" || status === "loading"}
        />
        {iframeMounted ? (
          <iframe
            ref={iframeRef}
            key={site.slug}
            src={site.websiteUrl}
            title={`Live preview of ${site.name}`}
            onLoad={() => setStatus((current) => (current === "blocked" ? current : "live"))}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            className={cn(
              "absolute inset-0 h-full w-full rounded-[inherit] border-0 bg-white transition-opacity duration-300",
              showIframe ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={!showIframe}
            tabIndex={showIframe ? 0 : -1}
          />
        ) : null}
      </ResponsivePreviewFrame>

      <PreviewStatus
        site={site}
        status={status}
        mode={mode}
        onModeChange={setMode}
        noticeDismissed={noticeDismissed}
        onDismissNotice={() => setNoticeDismissed(true)}
      />
    </div>
  );
}

function ScreenshotView({
  site,
  src,
  hidden,
  dimmed,
}: {
  site: Website;
  src: string | null;
  hidden: boolean;
  dimmed: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "scrollbar-thin absolute inset-0 overflow-y-auto overflow-x-hidden rounded-[inherit] bg-white",
        hidden && "invisible",
      )}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      aria-label={hidden ? undefined : `Screenshot of ${site.name}`}
      role={hidden ? undefined : "region"}
    >
      {src && !failed ? (
        // Full-page screenshots are tall; a plain img keeps native scrolling simple.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Full-page screenshot of the ${site.name} website`}
          onError={() => setFailed(true)}
          className={cn("block h-auto w-full transition-[filter,opacity] duration-300", dimmed && "opacity-60 blur-[2px]")}
        />
      ) : (
        <ThumbnailFallback site={site} />
      )}
    </div>
  );
}

function PreviewStatus({
  site,
  status,
  mode,
  onModeChange,
  noticeDismissed,
  onDismissNotice,
}: {
  site: Website;
  status: Status;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  noticeDismissed: boolean;
  onDismissNotice: () => void;
}) {
  const external = outboundUrl(site.websiteUrl);

  if (status === "blocked" && !noticeDismissed) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 md:bottom-6">
        <div
          role="status"
          className="pointer-events-auto relative flex w-full max-w-md items-start gap-3 rounded-xl border border-border bg-surface/95 p-4 pr-10 shadow-[0_12px_40px_-12px_rgba(17,17,16,0.3)] backdrop-blur animate-fade-in"
        >
          <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShieldOffIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Live preview unavailable</p>
            <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">
              {site.name} doesn’t allow being shown inside other websites, so you’re looking at a screenshot.
            </p>
            <Button asChild size="sm" className="mt-3">
              <a href={external} target="_blank" rel="noopener noreferrer">
                Open {displayUrl(site.websiteUrl).split("/")[0]}
                <ArrowUpRightIcon />
              </a>
            </Button>
          </div>
          <button
            type="button"
            onClick={onDismissNotice}
            aria-label="Dismiss notice"
            className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-md text-faint-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  const pill = (() => {
    switch (status) {
      case "checking":
      case "loading":
        return (
          <>
            <LoaderIcon className="size-3.5 animate-spin text-muted-foreground" />
            <span>Loading live preview…</span>
          </>
        );
      case "slow":
        return (
          <>
            <LoaderIcon className="size-3.5 animate-spin text-muted-foreground" />
            <span>Still loading</span>
            <PillButton onClick={() => onModeChange(mode === "live" ? "screenshot" : "live")}>
              {mode === "live" ? "Show screenshot" : "Show live"}
            </PillButton>
          </>
        );
      case "live":
        return (
          <>
            <span className="relative flex size-2">
              <span className={cn("absolute inset-0 rounded-full", mode === "live" ? "bg-emerald-500" : "bg-faint-foreground")} />
            </span>
            <span>{mode === "live" ? "Live preview" : "Screenshot"}</span>
            <PillButton onClick={() => onModeChange(mode === "live" ? "screenshot" : "live")}>
              {mode === "live" ? (
                <>
                  <ImageIcon className="size-3.5" /> Screenshot
                </>
              ) : (
                <>
                  <MonitorPlayIcon className="size-3.5" /> Live
                </>
              )}
            </PillButton>
          </>
        );
      case "blocked":
        return (
          <>
            <ShieldOffIcon className="size-3.5 text-muted-foreground" />
            <span>Screenshot · live preview unavailable</span>
          </>
        );
    }
  })();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto inline-flex h-8 items-center gap-2 rounded-full border border-border bg-surface/95 pl-3 pr-1.5 text-xs font-medium text-foreground shadow-[0_8px_24px_-12px_rgba(17,17,16,0.3)] backdrop-blur [&:not(:has(button))]:pr-3"
      >
        {pill}
      </div>
    </div>
  );
}

function PillButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-6 items-center gap-1 rounded-full bg-muted px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}

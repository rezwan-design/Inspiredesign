"use client";

import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  MonitorIcon,
  PanelRightIcon,
  SmartphoneIcon,
  TabletIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Favicon } from "@/components/gallery/favicon";
import { DEVICES, type Device } from "@/components/preview/responsive-preview-frame";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import type { Website } from "@/lib/types";
import { cn, displayUrl, outboundUrl } from "@/lib/utils";

const DEVICE_ICONS: Record<Device, typeof MonitorIcon> = {
  desktop: MonitorIcon,
  tablet: TabletIcon,
  mobile: SmartphoneIcon,
};
const DEVICE_ORDER: Device[] = ["desktop", "tablet", "mobile"];

interface PreviewToolbarProps {
  site: Website;
  device: Device;
  onDeviceChange: (device: Device) => void;
  onClose: () => void;
  previous: Pick<Website, "slug" | "name">;
  next: Pick<Website, "slug" | "name">;
  infoOpen: boolean;
  onToggleInfo: () => void;
}

export function PreviewToolbar(props: PreviewToolbarProps) {
  const { site, device, onDeviceChange, onClose, previous, next, infoOpen, onToggleInfo } = props;
  const external = outboundUrl(site.websiteUrl);

  return (
    <header className="relative z-20 flex h-[var(--toolbar-height)] shrink-0 items-center gap-2 border-b bg-background px-2 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-3">
      {/* Left: back, identity */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <Tooltip content="Back to gallery" shortcut="Esc">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5 px-2" aria-label="Back to gallery">
            <ArrowLeftIcon />
            <span className="hidden text-foreground sm:inline">Gallery</span>
          </Button>
        </Tooltip>
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
        <div className="flex min-w-0 items-center gap-2.5">
          <Favicon src={site.favicon} name={site.name} size={20} />
          <div className="flex min-w-0 items-baseline gap-2">
            <h1 className="truncate text-sm font-medium text-foreground">{site.name}</h1>
            <span className="hidden truncate font-mono text-xs text-faint-foreground xl:inline">
              {displayUrl(site.websiteUrl)}
            </span>
          </div>
        </div>
      </div>

      {/* Center: device switcher (moves to the bottom bar on small screens) */}
      <div className="hidden justify-center md:flex">
        <DeviceSwitcher device={device} onChange={onDeviceChange} />
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center justify-end gap-1">
        <div className="hidden items-center lg:flex">
          <Tooltip content={`Previous: ${previous.name}`} shortcut="←">
            <Button asChild variant="ghost" size="icon-sm" aria-label={`Previous website: ${previous.name}`}>
              <Link href={`/site/${previous.slug}`} replace>
                <ChevronLeftIcon />
              </Link>
            </Button>
          </Tooltip>
          <Tooltip content={`Next: ${next.name}`} shortcut="→">
            <Button asChild variant="ghost" size="icon-sm" aria-label={`Next website: ${next.name}`}>
              <Link href={`/site/${next.slug}`} replace>
                <ChevronRightIcon />
              </Link>
            </Button>
          </Tooltip>
          <span className="mx-1.5 h-5 w-px bg-border" aria-hidden="true" />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <Tooltip content={infoOpen ? "Hide details" : "Show details"} shortcut="I">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleInfo}
              aria-label={infoOpen ? "Hide website details" : "Show website details"}
              aria-pressed={infoOpen}
              className={cn(infoOpen && "bg-accent text-foreground")}
            >
              <PanelRightIcon />
            </Button>
          </Tooltip>
          <CopyUrlButton url={site.websiteUrl} />
        </div>

        <Button asChild variant="outline" size="sm" className="ml-1 hidden sm:inline-flex">
          <a href={external} target="_blank" rel="noopener noreferrer">
            Visit website
            <ArrowUpRightIcon />
          </a>
        </Button>
        <Tooltip content="Visit website">
          <Button asChild variant="ghost" size="icon-sm" className="sm:hidden">
            <a href={external} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${site.name} (opens in a new tab)`}>
              <ArrowUpRightIcon />
            </a>
          </Button>
        </Tooltip>

        <Tooltip content="Close preview" shortcut="Esc">
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close preview" className="ml-0.5">
            <XIcon />
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}

/** Bottom bar for phones and small tablets. */
export function PreviewBottomBar({
  site,
  device,
  onDeviceChange,
  infoOpen,
  onToggleInfo,
}: Pick<PreviewToolbarProps, "site" | "device" | "onDeviceChange" | "infoOpen" | "onToggleInfo">) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-t bg-background px-3 pb-[env(safe-area-inset-bottom)] md:hidden">
      <DeviceSwitcher device={device} onChange={onDeviceChange} />
      <div className="flex items-center gap-1">
        <CopyUrlButton url={site.websiteUrl} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleInfo}
          aria-label={infoOpen ? "Hide website details" : "Show website details"}
          aria-pressed={infoOpen}
          className={cn(infoOpen && "bg-accent text-foreground")}
        >
          <PanelRightIcon />
        </Button>
      </div>
    </div>
  );
}

export function DeviceSwitcher({ device, onChange }: { device: Device; onChange: (device: Device) => void }) {
  return (
    <div role="group" aria-label="Preview size" className="inline-flex h-8 items-center rounded-md bg-muted p-0.5">
      {DEVICE_ORDER.map((key, index) => {
        const Icon = DEVICE_ICONS[key];
        const active = key === device;
        return (
          <Tooltip key={key} content={`${DEVICES[key].label} view`} shortcut={String(index + 1)}>
            <button
              type="button"
              onClick={() => onChange(key)}
              aria-pressed={active}
              aria-label={`${DEVICES[key].label} view`}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[13px] transition-[background-color,color,box-shadow] duration-150",
                active
                  ? "bg-surface font-medium text-foreground shadow-[0_1px_2px_rgba(17,17,16,0.08)] ring-1 ring-black/[0.04]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="hidden xl:inline">{DEVICES[key].label}</span>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers without async clipboard access.
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Tooltip content={copied ? "Copied!" : "Copy website URL"}>
      <Button variant="ghost" size="icon-sm" onClick={copy} aria-label={copied ? "URL copied" : "Copy website URL"}>
        {copied ? <CheckIcon className="text-emerald-600" /> : <LinkIcon />}
      </Button>
    </Tooltip>
  );
}

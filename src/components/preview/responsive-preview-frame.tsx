"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type Device = "desktop" | "tablet" | "mobile";

export const DEVICES: Record<Device, { label: string; width: number; height: number }> = {
  desktop: { label: "Desktop", width: 1440, height: 900 },
  tablet: { label: "Tablet", width: 820, height: 1180 },
  mobile: { label: "Mobile", width: 390, height: 844 },
};

/** Narrowest width at which the desktop view renders at 1:1 before scaling kicks in. */
const DESKTOP_MIN_WIDTH = 1280;
const CANVAS_PADDING = { desktop: 12, device: 24 };
const LABEL_SPACE = 28;

interface FrameSize {
  /** CSS viewport the site renders at. */
  width: number;
  height: number;
  scale: number;
}

function computeSize(device: Device, available: { width: number; height: number }): FrameSize {
  if (device === "desktop") {
    const width = Math.max(available.width - CANVAS_PADDING.desktop * 2, 0);
    const height = Math.max(available.height - CANVAS_PADDING.desktop * 2, 0);
    if (width >= DESKTOP_MIN_WIDTH || width === 0) return { width, height, scale: 1 };
    // Narrow screens: render a real desktop viewport and scale it down to fit.
    const scale = width / DESKTOP_MIN_WIDTH;
    return { width: DESKTOP_MIN_WIDTH, height: height / scale, scale };
  }

  const target = DEVICES[device];
  const maxWidth = Math.max(available.width - CANVAS_PADDING.device * 2, 0);
  const maxHeight = Math.max(available.height - CANVAS_PADDING.device * 2 - LABEL_SPACE, 0);
  // Scale only when the device is wider than the canvas; otherwise keep 1:1 and
  // clamp the height so the frame always fits on screen.
  const scale = Math.min(1, maxWidth / target.width || 1);
  return {
    width: target.width,
    height: Math.min(target.height, maxHeight / scale),
    scale,
  };
}

interface ResponsivePreviewFrameProps {
  device: Device;
  children: React.ReactNode;
  className?: string;
}

/**
 * Centers a viewport-accurate frame on the canvas. The child (an iframe or a
 * screenshot) always renders at the device's real CSS width, then the frame
 * is zoomed out if the screen is too small to show it 1:1.
 */
export function ResponsivePreviewFrame({ device, children, className }: ResponsivePreviewFrameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => setAvailable({ width: canvas.clientWidth, height: canvas.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const size = available ? computeSize(device, available) : null;
  const isDesktop = device === "desktop";

  return (
    <div
      ref={canvasRef}
      className={cn(
        "canvas-dots relative flex h-full w-full overflow-hidden",
        isDesktop ? "items-center justify-center" : "flex-col items-center justify-center",
        className,
      )}
    >
      {size ? (
        <>
          {/* Outer box reserves the scaled footprint; inner box renders at full size. */}
          <div
            className="relative shrink-0 transition-[width,height] duration-300 ease-out"
            style={{ width: size.width * size.scale, height: size.height * size.scale }}
          >
            {/* No overflow-hidden here: clipping an iframe through a rounded ancestor can
                leave it blank in Chromium. Children round themselves with rounded-[inherit]. */}
            <div
              className={cn(
                "absolute left-0 top-0 bg-surface",
                "shadow-[0_1px_2px_rgba(17,17,16,0.06),0_16px_48px_-20px_rgba(17,17,16,0.25)] ring-1 ring-black/[0.08]",
                isDesktop ? "rounded-[10px]" : device === "tablet" ? "rounded-[22px]" : "rounded-[30px]",
              )}
              style={{
                width: size.width,
                height: size.height,
                // CSS zoom (not transform: scale) — iframes under a transformed
                // ancestor can render blank, while zoom keeps their viewport width.
                zoom: size.scale !== 1 ? size.scale : undefined,
              }}
            >
              {children}
            </div>
          </div>
          {!isDesktop ? (
            <p className="mt-3 h-4 font-mono text-[11px] text-faint-foreground tabular-nums">
              {DEVICES[device].label} · {size.width} × {Math.round(size.height)}
              {size.scale < 1 ? ` · ${Math.round(size.scale * 100)}%` : ""}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

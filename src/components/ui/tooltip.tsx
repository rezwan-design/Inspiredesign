"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

export function TooltipProvider(props: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={300} skipDelayDuration={200} {...props} />;
}

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  shortcut?: string;
}

/** Small label for icon-only controls. The trigger must carry its own aria-label. */
export function Tooltip({ content, children, side = "bottom", shortcut }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-50 flex items-center gap-2 rounded-md bg-foreground px-2 py-1 text-xs font-medium text-white shadow-sm",
            "animate-fade-in",
          )}
        >
          {content}
          {shortcut ? (
            <span className="rounded-[4px] bg-white/15 px-1 font-mono text-[10px] text-white/80">{shortcut}</span>
          ) : null}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

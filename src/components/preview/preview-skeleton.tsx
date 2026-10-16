import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

/** Static shell shown instantly while a preview page streams in. */
export function PreviewSkeleton() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas" aria-busy="true" aria-label="Loading preview">
      <div className="flex h-[var(--toolbar-height)] shrink-0 items-center gap-3 border-b bg-background px-3">
        <Link
          href="/"
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <ArrowLeftIcon className="size-4" />
          <span className="hidden sm:inline">Gallery</span>
        </Link>
        <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
        <span className="skeleton size-5 rounded-[5px]" />
        <span className="skeleton h-3.5 w-28 rounded" />
        <span className="ml-auto skeleton hidden h-8 w-[180px] rounded-md md:block" />
        <span className="ml-auto skeleton h-8 w-28 rounded-md" />
      </div>
      <div className="canvas-dots flex-1 p-3">
        <div className="skeleton h-full w-full rounded-[10px]" />
      </div>
    </div>
  );
}

import Link from "next/link";

import { cn } from "@/lib/utils";

/** A display case: an open frame with an object resting inside. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={cn("size-5", className)}>
      <rect x="1.75" y="1.75" width="16.5" height="16.5" rx="4.25" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5.5" y="9.5" width="9" height="5" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 rounded-md text-foreground", className)}
      aria-label="Vitrine — all websites"
    >
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-[-0.02em]">Vitrine</span>
    </Link>
  );
}

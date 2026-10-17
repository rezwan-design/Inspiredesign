import Link from "next/link";

import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <LogoMark className="mb-6 size-8 text-faint-foreground" />
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-faint-foreground">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">This page isn’t in the index</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        The website you’re looking for may have been removed or the link is mistyped.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-6">
        <Link href="/">Back to the gallery</Link>
      </Button>
    </main>
  );
}

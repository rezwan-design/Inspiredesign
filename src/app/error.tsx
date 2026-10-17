"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        An unexpected error interrupted the page. Try again, or head back to the gallery.
      </p>
      <div className="mt-6 flex gap-2">
        <Button size="sm" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Gallery</Link>
        </Button>
      </div>
    </main>
  );
}

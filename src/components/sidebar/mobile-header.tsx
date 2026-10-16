"use client";

import { MenuIcon } from "lucide-react";
import { Suspense, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { SidebarContent, SidebarFallback, type SidebarData } from "@/components/sidebar/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Compact top bar for tablet and mobile; the sidebar lives in a drawer. */
export function MobileHeader(data: SidebarData) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md lg:hidden">
      <Logo />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open categories and filters" className="-mr-2">
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle className="sr-only">Browse</SheetTitle>
          <SheetDescription className="sr-only">Search and filter websites by category or tag.</SheetDescription>
          <Suspense fallback={<SidebarFallback {...data} />}>
            <SidebarContent {...data} onNavigate={() => setOpen(false)} />
          </Suspense>
        </SheetContent>
      </Sheet>
    </header>
  );
}

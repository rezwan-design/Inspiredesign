import { Suspense } from "react";

import { SidebarContent, SidebarFallback } from "@/components/sidebar/sidebar-nav";
import { getCategories, getPopularTags, getWebsites } from "@/lib/websites";

export async function getSidebarData() {
  const [categories, tags, websites] = await Promise.all([getCategories(), getPopularTags(12), getWebsites()]);
  return { categories, tags, total: websites.length };
}

/** Persistent desktop sidebar (≥1024px). */
export async function AppSidebar() {
  const data = await getSidebarData();
  return (
    <aside className="sticky top-0 hidden h-dvh w-[var(--sidebar-width)] shrink-0 border-r bg-background lg:block">
      <Suspense fallback={<SidebarFallback {...data} />}>
        <SidebarContent {...data} />
      </Suspense>
    </aside>
  );
}

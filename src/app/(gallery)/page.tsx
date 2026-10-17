import { Suspense } from "react";

import { GalleryFallback, GalleryView } from "@/components/gallery/gallery-view";
import { getCategories, getWebsites } from "@/lib/websites";

export default async function HomePage() {
  const [websites, categories] = await Promise.all([getWebsites(), getCategories()]);
  return (
    <Suspense fallback={<GalleryFallback websites={websites} categories={categories} />}>
      <GalleryView websites={websites} categories={categories} />
    </Suspense>
  );
}

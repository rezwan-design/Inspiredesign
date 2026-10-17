import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PreviewSkeleton } from "@/components/preview/preview-skeleton";
import { SitePreview } from "@/components/preview/site-preview";
import { categoryLabel } from "@/lib/filters";
import {
  getAdjacentWebsites,
  getCapturedFrameable,
  getRelatedWebsites,
  getWebsiteBySlug,
  getWebsites,
} from "@/lib/websites";

export async function generateStaticParams() {
  const websites = await getWebsites();
  return websites.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({ params }: PageProps<"/site/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const site = await getWebsiteBySlug(slug);
  if (!site) return { title: "Website not found" };

  const title = `${site.name} — ${categoryLabel(site.category)} website inspiration`;
  const images = site.previewImage ? [{ url: site.previewImage, width: 1280, height: 800, alt: site.name }] : undefined;
  return {
    title,
    description: site.description,
    alternates: { canonical: `/site/${site.slug}` },
    openGraph: { title, description: site.description, images, url: `/site/${site.slug}` },
    twitter: { title, description: site.description, images: images?.map((image) => image.url) },
  };
}

export default function SitePage({ params }: PageProps<"/site/[slug]">) {
  // The skeleton is the route's shared App Shell; the URL-specific preview streams in.
  return (
    <Suspense fallback={<PreviewSkeleton />}>
      <SiteContent params={params} />
    </Suspense>
  );
}

async function SiteContent({ params }: Pick<PageProps<"/site/[slug]">, "params">) {
  const { slug } = await params;
  const site = await getWebsiteBySlug(slug);
  if (!site) notFound();

  const [{ previous, next }, related, frameableHint] = await Promise.all([
    getAdjacentWebsites(slug),
    getRelatedWebsites(site, 4),
    getCapturedFrameable(slug),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${site.name} website design`,
    description: site.description,
    about: { "@type": "WebSite", name: site.name, url: site.websiteUrl },
    image: site.previewImage ?? undefined,
    keywords: [categoryLabel(site.category), site.industry, ...site.tags].join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SitePreview site={site} previous={previous!} next={next!} related={related} frameableHint={frameableHint} />
    </>
  );
}

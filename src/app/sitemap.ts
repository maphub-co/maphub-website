import { MetadataRoute } from "next";
import { get_all_docs_pages } from "@/lib/docs/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.maphub.co";

  // Get all documentation pages
  const doc_pages = (await get_all_docs_pages()).map((page) => ({
    url: `${BASE_URL}/(public-or-protected)/docs/${page.meta.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },

    // HUB
    {
      url: `${BASE_URL}/hub`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },

    // DOCS
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...doc_pages,
  ];
}

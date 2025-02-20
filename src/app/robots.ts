import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.maphub.co";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/metrics/", "/private/", "/admin/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

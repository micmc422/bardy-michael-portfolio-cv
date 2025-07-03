import { baseURL } from "@/app/resources";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ['/blog/tags/']
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}

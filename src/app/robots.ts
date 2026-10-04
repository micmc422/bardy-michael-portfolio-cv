import { baseURL } from "@/app/resources";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Pages sans valeur de recherche ou privées.
        disallow: [
          "/blog/tags/", // pages de tags (duplicate content, déjà noIndex)
          "/atomicbd81", // étude de cas privée (accès par mot de passe)
          "/api/", // routes API
        ],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
    host: baseURL,
  };
}

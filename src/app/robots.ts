import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/agent", "/account", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

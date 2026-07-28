import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteConfig";
import { featuredPackages, blogPosts } from "@/data/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/packages`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/plan-trip`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/testimonials`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/signin`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/signup`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const packageRoutes: MetadataRoute.Sitemap = featuredPackages.map((pkg) => ({
    url: `${siteUrl}/packages/${pkg.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.isPublished)
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...packageRoutes, ...blogRoutes];
}

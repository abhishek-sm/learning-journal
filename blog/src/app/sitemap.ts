import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/articles`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/article/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...categoryPages];
}

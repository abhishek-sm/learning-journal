import { prisma } from "./prisma";

const articleCardSelect = {
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  readingTime: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
} as const;

export async function getLatestArticles(take = 6) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take,
    select: articleCardSelect,
  });
}

export async function getFeaturedArticle() {
  return prisma.article.findFirst({
    where: { published: true, featured: true },
    orderBy: { publishedAt: "desc" },
    select: articleCardSelect,
  });
}

export async function getTopLevelCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      children: {
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: { _count: { select: { articles: { where: { published: true } } } } },
      },
      _count: { select: { articles: { where: { published: true } } } },
    },
  });
  return categories;
}

export async function getPaginatedArticles(page: number, perPage = 9) {
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: articleCardSelect,
    }),
    prisma.article.count({ where: { published: true } }),
  ]);
  return { articles, total, totalPages: Math.ceil(total / perPage) };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, published: true },
    include: { category: true, tags: true },
  });
}

export async function getAdjacentArticles(publishedAt: Date | null) {
  if (!publishedAt) return { previous: null, next: null };
  const [previous, next] = await Promise.all([
    prisma.article.findFirst({
      where: { published: true, publishedAt: { lt: publishedAt } },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.article.findFirst({
      where: { published: true, publishedAt: { gt: publishedAt } },
      orderBy: { publishedAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);
  return { previous, next };
}

export async function getRelatedArticles(categoryId: string, excludeId: string, take = 3) {
  return prisma.article.findMany({
    where: { published: true, categoryId, id: { not: excludeId } },
    orderBy: { publishedAt: "desc" },
    take,
    select: articleCardSelect,
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { parent: true, children: true },
  });
}

export async function getArticlesByCategory(categoryId: string) {
  return prisma.article.findMany({
    where: { published: true, categoryId },
    orderBy: { publishedAt: "desc" },
    select: articleCardSelect,
  });
}

export async function searchArticles(query: string) {
  if (!query.trim()) return [];
  return prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: articleCardSelect,
  });
}

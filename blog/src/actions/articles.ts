"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify, computeReadingTime } from "@/lib/utils";

type ArticleInput = {
  title: string;
  excerpt?: string;
  coverImage?: string;
  content: string;
  categoryId: string;
  tags?: string[]; // tag names
  published: boolean;
  featured?: boolean;
};

async function upsertTags(tagNames: string[]) {
  const tags = [];
  for (const rawName of tagNames) {
    const name = rawName.trim();
    if (!name) continue;
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    tags.push(tag);
  }
  return tags;
}

export async function createArticle(input: ArticleInput) {
  await requireAdmin();
  const slug = slugify(input.title);
  const readingTime = computeReadingTime(input.content);
  const tags = await upsertTags(input.tags ?? []);

  const article = await prisma.article.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      content: input.content,
      categoryId: input.categoryId,
      published: input.published,
      publishedAt: input.published ? new Date() : null,
      featured: input.featured ?? false,
      readingTime,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  redirect(`/admin/articles/${article.id}/edit`);
}

export async function updateArticle(id: string, input: ArticleInput) {
  await requireAdmin();
  const existing = await prisma.article.findUniqueOrThrow({ where: { id } });
  const readingTime = computeReadingTime(input.content);
  const tags = await upsertTags(input.tags ?? []);
  const becamePublished = input.published && !existing.published;

  await prisma.article.update({
    where: { id },
    data: {
      title: input.title,
      slug: existing.title === input.title ? existing.slug : slugify(input.title),
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      content: input.content,
      categoryId: input.categoryId,
      published: input.published,
      publishedAt: becamePublished ? new Date() : existing.publishedAt,
      featured: input.featured ?? existing.featured,
      readingTime,
      tags: { set: [], connect: tags.map((t) => ({ id: t.id })) },
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath(`/article/${existing.slug}`);
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
}

export async function togglePublish(id: string, published: boolean) {
  await requireAdmin();
  await prisma.article.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
}

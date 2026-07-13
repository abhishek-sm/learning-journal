"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const parentId = (formData.get("parentId") as string) || null;
  if (!name) throw new Error("Category name is required.");

  const slug = slugify(name);
  await prisma.category.create({
    data: { name, slug, parentId: parentId || undefined },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

export async function renameCategory(id: string, name: string) {
  await requireAdmin();
  if (!name.trim()) throw new Error("Category name is required.");
  await prisma.category.update({
    where: { id },
    data: { name: name.trim(), slug: slugify(name) },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const articleCount = await prisma.article.count({ where: { categoryId: id } });
  const childCount = await prisma.category.count({ where: { parentId: id } });
  if (articleCount > 0) {
    throw new Error(
      "This category still has articles. Move them to another category first."
    );
  }
  if (childCount > 0) {
    throw new Error("This category still has subcategories. Delete or move those first.");
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

export async function moveArticleToCategory(articleId: string, categoryId: string) {
  await requireAdmin();
  await prisma.article.update({
    where: { id: articleId },
    data: { categoryId },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
}

export async function getCategoryTree() {
  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { articles: true } } },
  });

  const byId = new Map(categories.map((c) => [c.id, { ...c, children: [] as typeof categories }]));
  const roots: (typeof categories[number] & { children: typeof categories })[] = [];

  for (const cat of categories) {
    const node = byId.get(cat.id)!;
    if (cat.parentId && byId.has(cat.parentId)) {
      byId.get(cat.parentId)!.children.push(node as any);
    } else {
      roots.push(node as any);
    }
  }
  return roots;
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "../../article-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!article) notFound();

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Edit article</h1>
      <ArticleForm
        categories={categories}
        initial={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          coverImage: article.coverImage,
          content: article.content,
          categoryId: article.categoryId,
          tags: article.tags.map((t) => t.name),
          published: article.published,
          featured: article.featured,
        }}
      />
    </div>
  );
}

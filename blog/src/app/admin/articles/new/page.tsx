import { prisma } from "@/lib/prisma";
import { ArticleForm } from "../article-form";

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">New article</h1>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Create a category first before writing an article.
        </p>
      ) : (
        <ArticleForm categories={categories} />
      )}
    </div>
  );
}

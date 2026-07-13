import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArticleRowActions } from "./article-row-actions";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          New article
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{article.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{article.category.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      article.published
                        ? "rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent"
                        : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    }
                  >
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(article.updatedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ArticleRowActions
                    id={article.id}
                    slug={article.slug}
                    published={article.published}
                  />
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";
import { getPaginatedArticles } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Articles" };
export const revalidate = 60;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const { articles, totalPages } = await getPaginatedArticles(page);

  return (
    <div className="container py-16">
      <h1 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
        All articles
      </h1>

      {articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No articles published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/articles" />
    </div>
  );
}

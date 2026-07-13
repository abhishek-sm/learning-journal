import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { CategoryCard } from "@/components/category-card";
import {
  getFeaturedArticle,
  getLatestArticles,
  getTopLevelCategoriesWithCounts,
} from "@/lib/queries";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(6),
    getTopLevelCategoriesWithCounts(),
  ]);

  return (
    <div className="container">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 py-20 md:py-28">
        <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
          My Learning Journal
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          A living archive of what I&apos;m learning — physics, biology, programming,
          philosophy, and everything in between. Written to be reread.
        </p>
        <Link
          href="/articles"
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Browse articles <ArrowRight size={16} />
        </Link>
      </section>

      {/* Featured */}
      {featured && (
        <section className="pb-16">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Featured
          </h2>
          <ArticleCard article={featured} />
        </section>
      )}

      {/* Latest */}
      <section className="pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Latest articles
          </h2>
          <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No articles published yet — head to the admin dashboard to write your first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by category */}
      <section className="pb-24">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Browse by category
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              count={cat._count.articles}
              children={cat.children.map((c) => ({ name: c.name, slug: c.slug }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

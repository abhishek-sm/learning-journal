import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getArticlesByCategory, getCategoryBySlug } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return { title: category.name, description: category.description ?? undefined };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(category.id);

  return (
    <div className="container py-16">
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/categories" },
          ...(category.parent
            ? [{ label: category.parent.name, href: `/category/${category.parent.slug}` }]
            : []),
          { label: category.name },
        ]}
      />
      <h1 className="mb-2 mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        {category.name}
      </h1>
      {category.description && (
        <p className="mb-10 max-w-xl text-muted-foreground">{category.description}</p>
      )}

      {category.children.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {category.children.map((child) => (
            <a
              key={child.id}
              href={`/category/${child.slug}`}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {child.name}
            </a>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No articles in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

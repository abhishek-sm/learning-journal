import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TableOfContents } from "@/components/table-of-contents";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareButton } from "@/components/share-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ArticleCard } from "@/components/article-card";
import {
  getAdjacentArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/queries";
import { extractHeadings, formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, adjacent] = await Promise.all([
    getRelatedArticles(article.categoryId, article.id),
    getAdjacentArticles(article.publishedAt),
  ]);

  const headings = extractHeadings(article.content);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/article/${article.slug}`;

  return (
    <div className="container py-12">
      <ReadingProgress />

      <Breadcrumbs
        items={[
          { label: article.category.name, href: `/category/${article.category.slug}` },
          { label: article.title },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_240px]">
        <article>
          <header className="mb-10">
            <Link
              href={`/category/${article.category.slug}`}
              className="text-xs font-medium uppercase tracking-wide text-accent"
            >
              {article.category.name}
            </Link>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
              <span aria-hidden>&middot;</span>
              <span>{article.readingTime} min read</span>
              <span className="ml-auto">
                <ShareButton title={article.title} url={url} />
              </span>
            </div>
          </header>

          {article.coverImage && (
            <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <MarkdownRenderer content={article.content} />

          {article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Prev / Next */}
          <div className="mt-14 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {adjacent.previous ? (
              <Link
                href={`/article/${adjacent.previous.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-border p-4 hover:border-foreground/20"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft size={12} /> Previous
                </span>
                <span className="text-sm font-medium">{adjacent.previous.title}</span>
              </Link>
            ) : <div />}
            {adjacent.next && (
              <Link
                href={`/article/${adjacent.next.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-border p-4 text-right hover:border-foreground/20 sm:items-end"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  Next <ArrowRight size={12} />
                </span>
                <span className="text-sm font-medium">{adjacent.next.title}</span>
              </Link>
            )}
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Related articles
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {related.map((r) => (
                  <ArticleCard key={r.slug} article={r} />
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}

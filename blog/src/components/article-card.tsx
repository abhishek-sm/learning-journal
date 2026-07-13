import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  readingTime: number;
  publishedAt?: Date | string | null;
  category: { name: string; slug: string };
};

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/20"
    >
      {article.coverImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {article.category.name}
        </span>
        <h3 className="text-lg font-semibold leading-snug tracking-tight">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
          <span aria-hidden>&middot;</span>
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

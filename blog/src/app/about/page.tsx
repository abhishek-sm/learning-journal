import type { Metadata } from "next";
import Link from "next/link";
import { getSiteCopy } from "@/lib/site-copy";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const siteCopy = await getSiteCopy();
  const paragraphs = siteCopy.aboutBody.split(/\n\s*\n/).filter(Boolean);

  const ctaText = siteCopy.aboutCta.trim();
  const hasCategoryLink = ctaText.toLowerCase().includes("category");
  const hasArticlesLink = ctaText.toLowerCase().includes("latest articles");

  const renderCta = () => {
    if (!hasCategoryLink || !hasArticlesLink) {
      return <p>{ctaText}</p>;
    }

    const categoryIndex = ctaText.toLowerCase().indexOf("category");
    const articlesIndex = ctaText.toLowerCase().indexOf("latest articles");
    const beforeCategory = ctaText.slice(0, categoryIndex).trimEnd();
    const betweenCategoryAndArticles = ctaText.slice(categoryIndex + "category".length, articlesIndex).trim();
    const afterArticles = ctaText.slice(articlesIndex + "latest articles".length).trim();

    return (
      <p>
        {beforeCategory}
        {" "}
        <Link href="/categories">category</Link>
        {betweenCategoryAndArticles ? ` ${betweenCategoryAndArticles}` : ""}
        {" "}
        <Link href="/articles">latest articles</Link>
        {afterArticles ? ` ${afterArticles}` : ""}
      </p>
    );
  };

  return (
    <div className="container max-w-2xl py-20">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">About</h1>
      <div className="prose-article">
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {renderCta()}
      </div>
    </div>
  );
}

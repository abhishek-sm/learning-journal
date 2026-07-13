import { CategoryCard } from "@/components/category-card";
import { getTopLevelCategoriesWithCounts } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };
export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await getTopLevelCategoriesWithCounts();

  return (
    <div className="container py-16">
      <h1 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
        Categories
      </h1>
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
    </div>
  );
}

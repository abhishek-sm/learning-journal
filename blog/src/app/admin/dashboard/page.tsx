import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [published, drafts, categories] = await Promise.all([
    prisma.article.count({ where: { published: true } }),
    prisma.article.count({ where: { published: false } }),
    prisma.category.count(),
  ]);

  const stats = [
    { label: "Published articles", value: published },
    { label: "Drafts", value: drafts },
    { label: "Categories", value: categories },
  ];

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-6">
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Write new article
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Manage categories
        </Link>
      </div>
    </div>
  );
}

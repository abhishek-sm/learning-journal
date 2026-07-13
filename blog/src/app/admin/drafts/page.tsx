import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function DraftsPage() {
  const drafts = await prisma.article.findMany({
    where: { published: false },
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Drafts</h1>

      {drafts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No drafts — everything is published.</p>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <Link
              key={draft.id}
              href={`/admin/articles/${draft.id}/edit`}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-foreground/20"
            >
              <div>
                <p className="font-medium">{draft.title || "Untitled"}</p>
                <p className="text-sm text-muted-foreground">{draft.category.name}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                Updated {formatDate(draft.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

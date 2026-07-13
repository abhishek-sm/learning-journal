"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteArticle, togglePublish } from "@/actions/articles";

export function ArticleRowActions({
  id,
  slug,
  published,
}: {
  id: string;
  slug: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      await togglePublish(id, !published);
      toast.success(published ? "Unpublished" : "Published");
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteArticle(id);
      toast.success("Article deleted");
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <a
        href={`/article/${slug}`}
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:text-foreground"
      >
        Preview
      </a>
      <Link href={`/admin/articles/${id}/edit`} className="text-muted-foreground hover:text-foreground">
        Edit
      </Link>
      <button
        disabled={isPending}
        onClick={handleToggle}
        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        disabled={isPending}
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

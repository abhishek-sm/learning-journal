"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createArticle, updateArticle } from "@/actions/articles";

type Category = { id: string; name: string };

export function ArticleForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: {
    id: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    content: string;
    categoryId: string;
    tags: string[];
    published: boolean;
    featured: boolean;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const submit = (published: boolean) => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }
    const input = {
      title,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      content,
      categoryId,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published,
      featured,
    };

    startTransition(async () => {
      try {
        if (initial) {
          await updateArticle(initial.id, input);
          toast.success("Saved");
          router.refresh();
        } else {
          await createArticle(input);
        }
      } catch (e) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="w-full border-b border-border bg-transparent pb-3 text-3xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/50"
        />
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt (optional, shown on cards)"
          rows={2}
          className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/30"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write in Markdown…"
          rows={24}
          className="w-full resize-y rounded-md border border-border bg-surface px-4 py-3 font-mono text-sm outline-none focus:border-foreground/30"
        />
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <label className="mb-1.5 block text-sm font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <label className="mb-1.5 block text-sm font-medium">Cover image URL</label>
          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <label className="mb-1.5 block text-sm font-medium">Tags</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma, separated, tags"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
          />
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-border bg-card p-4 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Feature this article on the homepage
        </label>

        <div className="flex flex-col gap-2">
          <button
            disabled={isPending}
            onClick={() => submit(true)}
            className="rounded-md bg-foreground py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
          >
            {initial?.published ? "Save & keep published" : "Publish"}
          </button>
          <button
            disabled={isPending}
            onClick={() => submit(false)}
            className="rounded-md border border-border py-2.5 text-sm hover:bg-muted disabled:opacity-50"
          >
            Save as draft
          </button>
        </div>
      </div>
    </div>
  );
}

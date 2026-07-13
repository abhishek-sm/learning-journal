"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCategory, deleteCategory, renameCategory } from "@/actions/categories";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: CategoryNode[];
  _count: { articles: number };
};

function CategoryRow({ node }: { node: CategoryNode }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name);
  const router = useRouter();

  const handleRename = () => {
    startTransition(async () => {
      try {
        await renameCategory(node.id, name);
        toast.success("Renamed");
        setEditing(false);
        router.refresh();
      } catch (e: any) {
        toast.error(e.message ?? "Failed to rename");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${node.name}"?`)) return;
    startTransition(async () => {
      try {
        await deleteCategory(node.id);
        toast.success("Deleted");
        router.refresh();
      } catch (e: any) {
        toast.error(e.message ?? "Failed to delete");
      }
    });
  };

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-2.5">
      {editing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-sm outline-none"
          autoFocus
        />
      ) : (
        <span className="text-sm font-medium">
          {node.name} <span className="text-muted-foreground">({node._count.articles})</span>
        </span>
      )}
      <div className="flex items-center gap-3">
        {editing ? (
          <>
            <button disabled={isPending} onClick={handleRename}><Check size={15} /></button>
            <button onClick={() => { setEditing(false); setName(node.name); }}><X size={15} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground">
              <Pencil size={14} />
            </button>
            <button disabled={isPending} onClick={handleDelete} className="text-red-500 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function CategoryManager({ tree }: { tree: CategoryNode[] }) {
  const [newName, setNewName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const flatOptions = tree.flatMap((root) => [
    { id: root.id, name: root.name },
    ...root.children.map((c) => ({ id: c.id, name: `— ${c.name}` })),
  ]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const formData = new FormData();
    formData.set("name", newName);
    if (parentId) formData.set("parentId", parentId);
    startTransition(async () => {
      await createCategory(formData);
      toast.success("Category created");
      setNewName("");
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium">New category</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
          />
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
          >
            <option value="">No parent (top-level)</option>
            {flatOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <button
            disabled={isPending}
            onClick={handleCreate}
            className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {tree.map((root) => (
          <div key={root.id} className="space-y-2">
            <CategoryRow node={root} />
            {root.children.length > 0 && (
              <div className="ml-6 space-y-2">
                {root.children.map((child) => (
                  <CategoryRow key={child.id} node={child} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

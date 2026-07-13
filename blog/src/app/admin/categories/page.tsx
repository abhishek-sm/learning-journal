import { getCategoryTree } from "@/actions/categories";
import { CategoryManager } from "./category-manager";

export default async function AdminCategoriesPage() {
  const tree = await getCategoryTree();

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Categories</h1>
      <CategoryManager tree={tree as any} />
    </div>
  );
}

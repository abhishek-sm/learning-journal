import "server-only";
import { revalidatePath } from "next/cache";

/** Revalidate every route whose rendered output depends on categories. */
export function revalidateCategoryContent() {
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/articles");
  revalidatePath("/article/[slug]", "page");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");
  revalidatePath("/admin/articles/[id]/edit", "page");
  revalidatePath("/admin/drafts");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
}

/** Revalidate every route whose rendered output depends on articles. */
export function revalidateArticleContent() {
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/categories");
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/article/[slug]", "page");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/new");
  revalidatePath("/admin/articles/[id]/edit", "page");
  revalidatePath("/admin/drafts");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
}

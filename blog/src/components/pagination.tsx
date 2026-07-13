import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          className={
            page === currentPage
              ? "flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-sm font-medium text-background"
              : "flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm text-muted-foreground hover:bg-muted"
          }
        >
          {page}
        </Link>
      ))}
    </div>
  );
}

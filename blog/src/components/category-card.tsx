import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoryCard({
  name,
  slug,
  count,
  children,
}: {
  name: string;
  slug: string;
  count: number;
  children?: { name: string; slug: string }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/20">
      <Link href={`/category/${slug}`} className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
        <ArrowRight size={16} className="text-muted-foreground" />
      </Link>
      <p className="mt-1 text-sm text-muted-foreground">{count} articles</p>
      {children && children.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {children.map((child) => (
            <li key={child.slug}>
              <Link
                href={`/category/${child.slug}`}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

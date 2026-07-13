import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { Search } from "lucide-react";

const links = [
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-[15px] font-semibold tracking-tight">
          Learning Journal
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
          >
            <Search size={16} />
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted-foreground md:flex-row">
        <p>&copy; {new Date().getFullYear()} Learning Journal. All notes, no noise.</p>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/search" className="hover:text-foreground">Search</Link>
          <a href="/rss.xml" className="hover:text-foreground">RSS</a>
        </div>
      </div>
    </footer>
  );
}

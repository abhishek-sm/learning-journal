"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ArticleCard, type ArticleCardData } from "./article-card";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleCardData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, content, categories…"
          className="w-full rounded-lg border border-border bg-surface py-4 pl-12 pr-4 text-lg outline-none placeholder:text-muted-foreground focus:border-foreground/30"
        />
      </div>

      <div className="mt-10">
        {loading && <p className="text-sm text-muted-foreground">Searching…</p>}
        {!loading && query.trim() && results.length === 0 && (
          <p className="text-sm text-muted-foreground">No articles matched &quot;{query}&quot;.</p>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {results.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

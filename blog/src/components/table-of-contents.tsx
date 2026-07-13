"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { depth: number; text: string; id: string };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-medium text-foreground">On this page</p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.depth - 1) * 12 + 12}px` }}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block -ml-px border-l pl-3 text-muted-foreground transition-colors hover:text-foreground",
                activeId === h.id
                  ? "border-foreground text-foreground"
                  : "border-transparent"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

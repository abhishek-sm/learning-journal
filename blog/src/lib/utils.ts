import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import readingTime from "reading-time";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function computeReadingTime(markdown: string): number {
  const stats = readingTime(markdown);
  return Math.max(1, Math.ceil(stats.minutes));
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMMM d, yyyy");
}

export function extractHeadings(markdown: string) {
  const lines = markdown.split("\n");
  const headings: { depth: number; text: string; id: string }[] = [];
  for (const line of lines) {
    const match = /^(#{1,3})\s+(.*)$/.exec(line.trim());
    if (match) {
      const depth = match[1].length;
      const text = match[2].trim();
      headings.push({ depth, text, id: slugify(text) });
    }
  }
  return headings;
}

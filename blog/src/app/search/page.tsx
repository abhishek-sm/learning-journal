import { SearchBar } from "@/components/search-bar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="container max-w-2xl py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">Search</h1>
      <SearchBar />
    </div>
  );
}

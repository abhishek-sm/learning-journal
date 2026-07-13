import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container max-w-2xl py-20">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">About</h1>
      <div className="prose-article">
        <p>
          I&apos;m a software engineer who is endlessly curious — about how things
          work, why they work that way, and what happens at the edges of what I
          already understand.
        </p>
        <p>
          This site is my personal learning journal: a place where I write down
          what I&apos;m learning, whether that&apos;s a physics idea I finally understood,
          a programming pattern worth remembering, or a book that changed how I
          think. It isn&apos;t polished for an audience — it&apos;s polished for my
          future self, so ideas don&apos;t evaporate the moment I move on to the next
          thing.
        </p>
        <p>
          If you&apos;ve found your way here, welcome. Browse by{" "}
          <a href="/categories">category</a>, or start with the{" "}
          <a href="/articles">latest articles</a>.
        </p>
      </div>
    </div>
  );
}

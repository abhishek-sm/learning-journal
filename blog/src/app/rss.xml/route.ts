import { prisma } from "@/lib/prisma";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
    select: { title: true, slug: true, excerpt: true, publishedAt: true },
  });

  const items = articles
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/article/${a.slug}</link>
      <guid>${siteUrl}/article/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt ?? new Date()).toUTCString()}</pubDate>
      <description><![CDATA[${a.excerpt ?? ""}]]></description>
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Learning Journal</title>
    <link>${siteUrl}</link>
    <description>A personal learning journal.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

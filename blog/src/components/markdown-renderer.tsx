import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import "katex/dist/katex.min.css";

export async function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-article">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              rehypeKatex,
              [
                rehypePrettyCode,
                {
                  theme: { dark: "github-dark", light: "github-light" },
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}

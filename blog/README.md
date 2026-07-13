# Learning Journal

A personal, editorial-style blog for publishing what you're learning — built with
Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

This is a single-admin publishing tool, not a multi-user CMS: there is one login
(you), no public registration, and the entire public site is read-only content
you write through `/admin`.

---

## 1. Stack & decisions

- **Next.js 14 (App Router) + TypeScript** — Server Components by default;
  client components only where interactivity is required (forms, search,
  theme switch, TOC scroll-spy, reading progress).
- **Tailwind CSS** for styling, using the exact light/dark palette from the
  spec (`src/app/globals.css`). Components are hand-built with Tailwind
  rather than the shadcn/ui CLI, to avoid pulling in a large component
  library for what is intentionally a small set of UI elements — this keeps
  the "no unnecessary libraries" goal from the brief. `sonner` (toasts),
  `lucide-react` (icons), and `next-themes` (dark mode) are the only UI
  utility packages used.
- **Prisma + PostgreSQL** — schema in `prisma/schema.prisma` with `User`,
  `Category` (self-referential, one level of nesting), `Article`, and `Tag`.
- **Auth** — a signed HTTP-only JWT cookie (via `jose`) set on login,
  checked in `src/middleware.ts` for everything under `/admin`. Passwords
  are hashed with `bcryptjs`. There is exactly one account, created by the
  seed script.
- **Markdown** — authored as raw Markdown, rendered with `next-mdx-remote`
  + `remark-gfm` (tables, etc.), `remark-math`/`rehype-katex` (optional
  math), `rehype-slug` + `rehype-autolink-headings` (heading anchors for
  the table of contents), and `rehype-pretty-code` (syntax highlighting).

## 2. Project structure

```
src/
  app/
    page.tsx                  Home
    articles/                 /articles
    categories/                /categories
    category/[slug]/           /category/:slug
    article/[slug]/            /article/:slug
    about/                      /about
    search/                     /search
    api/search/route.ts         instant-search API
    rss.xml/route.ts            RSS feed
    sitemap.ts, robots.ts        SEO
    admin/
      login/                     /admin/login (public)
      dashboard/, articles/, categories/, drafts/, settings/
  actions/                     Server actions (auth, articles, categories)
  components/                  Shared UI (Navbar, Footer, ArticleCard, …)
  lib/                         prisma client, auth/session, queries, utils
prisma/
  schema.prisma
  seed.ts
```

## 3. Running locally

You'll need Node.js 18+ and a PostgreSQL database. The easiest options are a
local Postgres install, Docker, or a free [Neon](https://neon.tech) database
(same one used for production — see below).

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then edit .env and set at least DATABASE_URL and AUTH_SECRET

# 3. Create the database schema
npm run db:push

# 4. Seed your admin account + starter categories/article
npm run db:seed
# this prints the admin email/password it created — from ADMIN_EMAIL /
# ADMIN_PASSWORD in .env, defaulting to you@example.com / changeme123

# 5. Start the dev server
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` to sign in and start writing.

### Local Postgres via Docker (optional)

```bash
docker run --name learning-journal-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=learning_journal \
  -p 5432:5432 -d postgres:16
```

Then set:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/knowledge_library"
```

## 4. Deploying to Vercel + Neon

1. Push this project to a GitHub repository.
2. Create a database at [neon.tech](https://neon.tech) and copy its
   connection string.
3. Import the repo into [Vercel](https://vercel.com).
4. In Vercel's project settings, add the environment variables from
   `.env.example`: `DATABASE_URL` (your Neon string), `AUTH_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_SITE_URL` (your
   production domain).
5. Deploy. After the first deploy, run the schema push and seed once
   against production — the simplest way is to run them locally with
   `DATABASE_URL` temporarily pointed at your Neon connection string:
   ```bash
   DATABASE_URL="<neon-connection-string>" npm run db:push
   DATABASE_URL="<neon-connection-string>" npm run db:seed
   ```

## 5. Writing articles

Everything happens under `/admin`:

- **Categories** — create top-level categories (Science, Food, Programming…)
  and, optionally, one level of subcategories (Physics under Science,
  Nutrition under Food). Renaming updates the slug; deleting is blocked
  while a category still has articles or subcategories, so nothing is
  silently orphaned.
- **Articles** — write in Markdown, assign a category and optional tags,
  set an optional cover image URL, and either **Publish** or **Save as
  draft**. Reading time and the URL slug are computed automatically.
  To move an article to a different category, open it in the editor and
  change the Category dropdown, then save.
- **Drafts** — a quick filtered view of everything not yet published.

## 6. What's intentionally left out

In the spirit of "15 polished features over 100 average ones," a few
things were kept simple on purpose:

- No image upload/storage pipeline — cover images are pasted URLs. Wiring
  up Vercel Blob or S3 is a natural next step if you want to upload files
  directly.
- No visual drag-and-drop category reordering — order is set by an
  `order` field you can adjust directly in the database if needed.
- No password-reset UI — rotate `ADMIN_PASSWORD` and re-run the seed
  script instead.

## 7. A note on this build

This project was generated in a sandboxed environment without internet
access, so `npm install` was never run here and the app has not been
booted or tested live. The code follows Next.js 14 / Prisma conventions
throughout, but when you run `npm install` locally, do a quick sanity pass
(`npm run build`) and fix any small version-mismatch issues that come up
before you rely on it in production.

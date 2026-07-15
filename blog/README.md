# Learning Journal

Learning Journal is a small, single-author blog for keeping track of things I am learning. It has a public reading experience and a private admin area for drafting, editing, and publishing posts.

The app is built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Articles are written in Markdown, with support for code blocks, tables, and math.

## What it includes

- A public home page, article archive, categories, search, RSS feed, sitemap, and dark mode.
- A private `/admin` area for managing articles, categories, drafts, and site settings.
- One administrator account; there is no public sign-up flow.
- Markdown articles with syntax highlighting, heading links, a table of contents, and estimated reading time.
- Tags, featured articles, cover-image URLs, and scheduled publication fields.

## Project layout

```text
src/
  app/          Pages, routes, and server actions
  components/   Shared interface components
  lib/          Prisma client, authentication, queries, and utilities
prisma/
  schema.prisma Database schema
  seed.ts       Initial admin account and starter content
```

## Run it locally

You will need Node.js, npm, and PostgreSQL. Docker is a convenient way to run the database locally.

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

The site will be available at `http://localhost:3000`. Sign in at `http://localhost:3000/admin/login` using the admin credentials from your `.env` file.

### PostgreSQL with Docker

```bash
docker run --name learning-journal-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=learning_journal_db \
  -p 5432:5432 \
  -d postgres:16
```

Use this connection string in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learning_journal_db"
```

## Writing and publishing

Create categories first, then write posts from `/admin/articles`. You can add tags, a cover image URL, and choose whether a post is published or kept as a draft. Slugs and reading time are created automatically when you save.

## Useful commands

```bash
npm run dev        # start the development server
npm run build      # create a production build
npm run db:push    # sync the Prisma schema with the database
npm run db:seed    # create the admin user and starter content
npm run db:studio  # browse the database with Prisma Studio
```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio + MDX blog at `ahnafnafee.dev`. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4. Deployed to Vercel; also supports a stripped-down static export (used for a university-hosted mirror).

## Common Commands

Yarn is the package manager — `yarn.lock` is committed. Don't use `npm install`.

```bash
yarn dev                # dev server (Turbopack, env from .env.development.local)
yarn dev:webpack        # dev server forced to webpack (use if Turbopack misbehaves with mermaid/MDX)
yarn build              # production build (Vercel)
yarn export             # static export — runs export:prepare → next build → export:cleanup
yarn export:university  # static export with .env.development.static.local (BASE_PATH-aware)
yarn lint               # eslint . (flat config in eslint.config.mjs)
yarn lint:fix           # eslint . --fix
yarn type-check         # tsc --noEmit
yarn test               # vitest run (unit + integration suite)
yarn test:watch         # vitest in watch mode
yarn test:coverage      # vitest with v8 coverage report
yarn format             # prettier write across js/ts/tsx/md/mdx/json
yarn analyze            # bundle analyzer (cross-env ANALYZE=true next build)
yarn validate:json-ld   # walk built HTML, verify every <script type="application/ld+json">
yarn audit:alt-text     # scan MDX for weak <ContentImage>/<img> alt attributes
yarn postbuild          # runs automatically after build — generates sitemap via custom-next-sitemap.js
npx tsx indexing/sendIndexingRequest.ts   # batch-submit URLs to Google Indexing API
```

Tests live under `__tests__` directories co-located with the code they cover (e.g. `src/libs/seo/__tests__/`, `src/services/content/__tests__/`). The Vitest config (`vitest.config.ts`) uses `happy-dom` and resolves `@/*` paths via `vite-tsconfig-paths`. CI runs the suite on every push/PR via `.github/workflows/ci.yml`.

## Content Pipeline (the core architecture)

All blog posts and portfolio entries are MDX files on disk — there's no CMS.

1. **Source files** live in `src/data/blog/*.mdx` and `src/data/portfolio/*.mdx`. Filename (minus `.mdx`) becomes the URL slug.
2. **Frontmatter** is parsed by `gray-matter` in `src/services/content/`. The shape is enforced by ambient types in `src/types/index.d.ts` (`declare module 'me'`) — `Blog`, `Portfolio`, `Snippet`, etc. Add new content fields there first, then update the MDX files.
3. **Reading content**:
    - `getContents<T>('/blog')` — list all entries (used by `generateStaticParams` and listing pages).
    - `getContentBySlug<T>('/blog', slug)` — single entry.
    - Both resolve paths through `LOCATION_DIR` in `src/services/directory/location.ts` (= `src/data`). Change content location there, not in the readers.
4. **Rendering** uses `next-mdx-remote/rsc`'s `MDXRemote` in `src/app/blog/[slug]/page.tsx` and the portfolio equivalent. Plugin set is centralized in `src/libs/mdxConfig.ts` (remark-gfm, remark-math, rehype-prism-plus, rehype-slug, rehype-katex).
5. **Custom MDX components** live in `src/components/content/mdx/` and are wired into the `MDXComponents` map in `mdx/index.ts`. Notable overrides:
    - `Pre`, `Code` — code blocks with prism syntax highlighting.
    - `Mermaid` — renders ` ```mermaid ` blocks; mermaid + stylis are transpiled and pre-bundled (see `transpilePackages` and `experimental.optimizePackageImports` in `next.config.js`).
    - `ContentImage` — explicit component for ImageKit-hosted images. The default `img` MDX mapping was intentionally removed so external images / SVGs in MDX don't break; use `<ContentImage>` (or a raw `<img>`) explicitly.
    - `MDXLink`, `Blockquote`, `Table`, `Headings` — styled overrides.
6. **SEO** is generated per-page in `src/app/blog/[slug]/page.tsx` and the portfolio equivalent: `generateMetadata` builds Next.js Metadata (OG, Twitter, canonical, `modifiedTime`), and the page itself injects two JSON-LD blocks (BlogPosting + BreadcrumbList for blog; SoftwareSourceCode + BreadcrumbList for portfolio). The Person `@id` (`https://www.ahnafnafee.dev/#person`) is referenced from author/publisher; the full Person node is emitted only on the home page. When you add a new content type, mirror this pattern.
7. **OG image fallback**: if a post has no `thumbnail`, `generateOgImage` from `src/libs/metapage` constructs one via `/api/og`.

## Path Aliases

`tsconfig.json` baseUrl is `./src`. Use:
- `@/*` → `src/*`
- `@/UI` and `@/UI/*` → `src/components/UI` and `src/components/UI/*`

Imports are auto-sorted by `@trivago/prettier-plugin-sort-imports` (order defined in `.prettierrc.js`): `@/components` → `@/UI` → `@/services` → `@/libs` → `@/...` → relative → external → `@/styles/*`. Don't reshuffle by hand; let Prettier do it.

## Two Build Modes

`yarn build` is the standard Vercel build. `yarn export` produces a static site — but Next.js can't static-export a tree with API routes, so the export pipeline temporarily moves `src/app/api/` out:

- `scripts/export-prepare.js` copies `src/app/api/` → `temp_api_backup/` and deletes the original.
- `next build` runs with `STATIC_EXPORT=true` (read in `next.config.js` to flip `output: 'export'`, `images.unoptimized: true`, and apply `BASE_PATH` if set).
- `scripts/export-cleanup.js` restores the API directory from the backup.

If a build crashes mid-export, `temp_api_backup/` may be left behind — restore it manually before the next run, otherwise the API routes are gone.

`yarn export:university` is the same flow with `.env.development.static.local`, which sets a `BASE_PATH` for hosting under a sub-path.

## Revalidation

ISR endpoint at `GET /api/revalidate?secret=<SECRET>&slug=/blog/<slug>`. Secret is `NEXT_PUBLIC_SECRET` or `SECRET_KEY`. The `slug` parameter is the actual path (e.g. `/blog/local-llm-pdf-ocr`), not the route template.

## Sitemap

`custom-next-sitemap.js` runs in `postbuild`. It allowlists AI/LLM crawlers (GPTBot, Claude-Web, anthropic-ai, etc.), assigns per-route priorities, and skips robots.txt generation under `STATIC_EXPORT=true`. Edit this file (not a separate sitemap config) when adding new top-level routes.

## next.config.js Quirks

- Wrapped in both `withAxiom` (logs) and `withPWA` (next-pwa, disabled in dev).
- Strict CSP including `*.youtube.com`, `giscus.app`, `*.googletagmanager.com`, `cdn.jsdelivr.net`.
- Image `remotePatterns` allowlist — when adding a new external image host, register it here or `next/image` will reject it.
- `transpilePackages: ['mermaid', 'stylis']` — leave it; mermaid ships ESM that Next can't consume otherwise.
- Several legacy URL redirects (`/projects` → `/portfolio`, `/cv` → `/AhnafAnNafeeResume.pdf`, etc.) live in `redirects()`.

## Conventions

- Prettier: no semicolons, 2-space indent, single quotes, 120-col print width, `trailingComma: 'none'`. ESLint extends `next/core-web-vitals` + `@typescript-eslint/recommended`; `no-explicit-any` is intentionally off.
- Commits go through `commitizen` with `cz-conventional-changelog` — run `yarn commit` for the prompt. `lint-staged` runs Prettier on staged `js/jsx/ts/tsx/mdx/md/css` files.
- Frontmatter `published` for blog posts is `MM/DD/YYYY`. `featured: true` surfaces an entry on the home page. Optional `updated: "MM/DD/YYYY"` overrides `published` as the freshness signal — it flows into `dateModified` (BlogPosting JSON-LD), `<meta property="article:modified_time">`, and the sitemap `lastmod`. Set it whenever you make a substantive content edit; leave it off for typo fixes.
- Authoring convention: open every blog post with a 60–120 word TL;DR paragraph immediately under the H1. LLM crawlers (ChatGPT, Perplexity, AI Overviews) draw ~44% of their citations from the first 30% of an article, so front-loading the answer compounds visibility.

## Indexing Helper

`indexing/sendIndexingRequest.ts` reads URLs from the live sitemap, checks Search Console for index status, and submits unindexed URLs to the Google Indexing API. Requires `indexing/service_account.json` (gitignored) with Indexing API + Search Console API enabled and the service account added as an Owner in Search Console. The `indexing/` directory is excluded from the TypeScript build (`tsconfig.json`).

## Memory

There is per-project memory at `C:\Users\ahnaf\.claude\projects\D--GitHub-ahnafnafee-dev\memory\` — check `MEMORY.md` there at the start of a session for any user feedback or environment notes (e.g. `gh` CLI is installed and preferred over curl/WebFetch for any GitHub work).

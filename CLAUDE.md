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

Tests live under `__tests__` directories co-located with the code they cover (e.g. `src/libs/seo/__tests__/`, `src/services/content/__tests__/`). The Vitest config (`vitest.config.ts`) uses `happy-dom` and resolves `@/*` paths via Vite's native `resolve.tsconfigPaths: true`. CI runs the suite on every push/PR via `.github/workflows/ci.yml`.

## Content Pipeline (the core architecture)

All blog, portfolio, and research entries are MDX files on disk — there's no CMS.

1. **Source files** live in `src/data/blog/*.mdx`, `src/data/portfolio/*.mdx`, and `src/data/research/*.mdx`. Filename (minus `.mdx`) becomes the URL slug.
2. **Frontmatter** is parsed by `gray-matter` in `src/services/content/`. The shape is enforced by ambient types in `src/types/index.d.ts` (`declare module 'me'`) — `Blog`, `Portfolio`, `Research` (plus its sub-types `Author`, `Affiliation`, `Venue`, `ResearchLinks`, `ResearchIdentifiers`), `Snippet`, etc. Add new content fields there first, then update the MDX files.
3. **Reading content**:
   - `getContents<T>('/blog')` — list all entries (used by `generateStaticParams` and listing pages).
   - `getContentBySlug<T>('/blog', slug)` — single entry.
   - `getContentHeaders<T>('/blog')` — header-only (skips MDX body parsing) — use this whenever a page only needs frontmatter.
   - All three resolve paths through `LOCATION_DIR` in `src/services/directory/location.ts` (= `src/data`). Change content location there, not in the readers.
4. **Rendering** uses `next-mdx-remote/rsc`'s `MDXRemote` in `src/app/blog/[slug]/page.tsx` and the portfolio / research equivalents. Plugin set is centralized in `src/libs/mdxConfig.ts` (remark-gfm, remark-math, rehype-prism-plus, rehype-slug, rehype-katex).
5. **Custom MDX components** live in `src/components/content/mdx/` and are wired into the `MDXComponents` map in `mdx/index.ts`. Notable overrides:
   - `Pre`, `Code` — code blocks with prism syntax highlighting.
   - `Mermaid` — renders ` ```mermaid ` blocks; mermaid + stylis are transpiled and pre-bundled (see `transpilePackages` and `experimental.optimizePackageImports` in `next.config.js`).
   - `ContentImage` — explicit component for ImageKit-hosted images. The default `img` MDX mapping was intentionally removed so external images / SVGs in MDX don't break; use `<ContentImage>` (or a raw `<img>`) explicitly.
   - `MDXLink`, `Blockquote`, `Table`, `Headings` — styled overrides.
6. **Research-specific components** live in `src/components/content/research/`:
   - **Detail-page**: `HeadingResearch` (status chip, title, structured authors + affiliations, venue, action-button row, hr — author/affiliation `<sup>` markers are conditional + carry `title` tooltips, see Conventions), `ResearchTeaser` (full-bleed figure + caption, lives outside `prose` so it can breathe), `ResearchAbstract` (purple-accented `not-prose` card), `ResearchBibTeX` (anchored at `#bibtex`, copy-to-clipboard, mirrors `Pre.tsx` chrome).
   - **Listing-page**: `ResearchOverview` (intro paragraph), `ResearchNews` (date-column timeline; entries live in the `NEWS` array inside the file), `ResearchAreas` (colored chip row), `ResearchItem` + `ResearchSections` (listing card + section grouping). `ComingSoonImage` is a pastel-gradient placeholder used in place of the listing thumbnail when an entry has `comingSoon: true`.
   - **Shared**: `SectionHeading` is the bordered `text-lg md:text-xl font-bold text-black dark:text-white` h2 used by every section on the listing page (Overview / News / Research Areas / Sections groupers). Use it for any new sections to keep the rhythm consistent.
   - The detail page composition is in `src/app/research/[slug]/page.tsx`. The listing page is in `src/app/research/page.tsx` — both pass `pt-6 md:pt-10` to `AppLayoutPage` to give the first section breathing room from the sticky header.
7. **SEO** is generated per-page in `src/app/blog/[slug]/page.tsx` and the portfolio / research equivalents: `generateMetadata` builds Next.js Metadata (OG, Twitter, canonical, `modifiedTime`), and the page itself injects a single `@graph` JSON-LD block:
   - Blog: `BlogPosting` + `WebPage` + `BreadcrumbList`
   - Portfolio: `SoftwareSourceCode` + `WebPage` + `BreadcrumbList`
   - Research: `ScholarlyArticle` + `WebPage` + `BreadcrumbList`. The first author (matching `SITE_AUTHOR.name`) maps to `{'@id': PERSON_ID}`; coauthors emit inline `Person` nodes with `affiliation` and ORCID `identifier`. `isPartOf` resolves to `Periodical` for `published`/`accepted`/`workshop` venues and `CreativeWork` otherwise. DOI / arXiv / ResearchGate IDs from `identifiers` become `PropertyValue` entries on `identifier`.
     The Person `@id` (`https://www.ahnafnafee.dev/#person`) is referenced from author/publisher; the full Person node is emitted only on the home page. When you add a new content type, mirror this pattern.
8. **OG image fallback**: if a post has no `thumbnail`, `generateOgImage` from `src/libs/metapage` constructs one via `/api/og`. For research listing cards, the resolution order is `thumbnail > teaser > generated OG`; ImageKit URLs without an explicit `?tr=` get `?tr=w-600` appended so retina displays render sharp on the 176px max slot. The `isImagekitUrl` check parses `new URL(...).hostname` (CodeQL flagged the substring form as bypassable).

## Path Aliases

`tsconfig.json` baseUrl is `./src`. Use:

- `@/*` → `src/*`

Imports are auto-sorted by `@ianvs/prettier-plugin-sort-imports` (order defined in `.prettierrc.js`): `@/components` → `@/services` → `@/libs` → `@/...` → relative → third-party → `@/styles/*`. Empty strings in `importOrder` produce blank-line separators between groups. Don't reshuffle by hand; let Prettier do it.

## Component Layout

Two roots under `src/components/`:

- **`ui/`** — shadcn/ui primitives. Every file here is generated by `npx shadcn@latest add <name>` and follows shadcn's data-slot, variant, and class conventions. Don't edit by hand unless intentionally extending; instead use `npx shadcn@latest add <name> --diff` to merge upstream changes. Built on `radix-ui` (configured in `components.json` as `style: radix-nova`); `radix-ui` is **not** a competing UI system — it's shadcn's primitive layer.
- **`site/`** — bespoke composition components specific to this site (Header, Footer, Nav, AppLayoutPage, Hero, Searchbar, BackToTop, EmptyResult, MobileNav, ThemeMenu, links, image wrappers). They compose `ui/` primitives + project state.

When you need a new primitive, **search shadcn first** (`npx shadcn@latest search`). Only fall back to a bespoke component in `site/` (or a feature folder) if no primitive fits.

## Theme System

Two layers feed Tailwind v4:

1. **`tailwind.config.js`** keeps the **legacy palette scales** — `primary: colors.blue`, `theme: colors.neutral`, plus a custom `gray-{0..900}` ramp. Existing classes like `bg-primary-500`, `text-theme-700`, `dark:bg-gray-900` resolve through this. Bridged into v4 via `@config "../../tailwind.config.js"` in `globals.css`.
2. **`globals.css` `@theme inline` + `:root` / `.dark` blocks** define the **shadcn semantic tokens** (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`, etc.) and _intentionally_ map them to the same OKLCH values as the legacy scales:
   - `--primary` ↔ `blue-500` (light) / `blue-400` (dark) — same as legacy `primary-500/400`.
   - `--background` ↔ `neutral-50` (light) / custom `gray-900` `#111` (dark) — matches legacy body bg.
   - `--foreground` ↔ `neutral-800/100`, `--muted` ↔ `neutral-100/800`, `--border` ↔ `neutral-200/700`, `--ring` ↔ blue-500/400 (legacy focus ring).

Net result: `bg-primary` (shadcn) and `bg-primary-500` (legacy) render the same color; both surfaces remain valid during the transition. When adding new code, prefer the semantic tokens. Don't write `dark:` overrides for shadcn classes — `--background` etc. switch automatically via `.dark`.

Fonts: `--font-sans` resolves to `'Google Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`. Google Sans is loaded via Google Fonts CSS (`<link>` in `layout.tsx` head, with `preconnect` to `fonts.gstatic.com` — `font-src` in `next.config.js` CSP must include it). Local Inter `@font-face` stays in `globals.css` as a deeper fallback so the page never FOUCs. `tailwind.config.js` `fontFamily.primary` mirrors the same stack so the legacy `font-primary` utility picks up Google Sans too.

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

- Wrapped in both `withAxiom` (logs) and `withPWA` (`@ducanh2912/next-pwa` — the maintained next-pwa fork, Workbox 7, disabled in dev). Options nest under `workboxOptions` (skipWaiting, buildExcludes); `extendDefaultRuntimeCaching: true` preserves the legacy next-pwa@5 cache strategies. Note: `@serwist/next` was evaluated but doesn't generate `sw.js` under Next 16's Turbopack-default build (tracking [serwist#54](https://github.com/serwist/serwist/issues/54)) — revisit when stable.
- Strict CSP including `*.youtube.com`, `giscus.app`, `*.googletagmanager.com`, `cdn.jsdelivr.net`.
- Image `remotePatterns` allowlist — when adding a new external image host, register it here or `next/image` will reject it.
- `transpilePackages: ['mermaid', 'stylis']` — leave it; mermaid ships ESM that Next can't consume otherwise.
- Several legacy URL redirects (`/projects` → `/portfolio`, `/cv` → `/AhnafAnNafeeResume.pdf`, etc.) live in `redirects()`.

## Conventions

- Prettier: no semicolons, 2-space indent, single quotes, 120-col print width, `trailingComma: 'none'`. Import sorting via `@ianvs/prettier-plugin-sort-imports`; tailwind class sorting via `prettier-plugin-tailwindcss`. ESLint extends `next/core-web-vitals` + `@typescript-eslint/recommended`; `no-explicit-any` is intentionally off.
- **shadcn rules**: forms compose `Field` + `FieldLabel` + `FieldDescription` (no raw `div` + `Label`); inputs with leading/trailing icons use `InputGroup` + `InputGroupAddon`; icons inside `Button` get `data-icon="inline-start"` / `inline-end` (no `size-*` classes); use `cn()` for conditional classes; reach for `<Empty>`, `<Skeleton>`, `<Alert>`, `<Badge>`, `<Separator>` instead of styled `div`s. Toasts via `sonner` (`toast()` from `sonner`, `<Toaster>` from `@/components/ui/sonner`).
- Commits go through `commitizen` with `cz-conventional-changelog` — run `yarn commit` for the prompt. `lint-staged` runs Prettier on staged `js/jsx/ts/tsx/mdx/md/css` files.
- Frontmatter `published` for blog and research is `MM/DD/YYYY` (portfolio uses `date`). `featured: true` surfaces an entry on the home page. Optional `updated: "MM/DD/YYYY"` overrides `published` as the freshness signal — it flows into `dateModified` (BlogPosting / ScholarlyArticle JSON-LD), `<meta property="article:modified_time">`, and the sitemap `lastmod`. Set it whenever you make a substantive content edit; leave it off for typo fixes.
- Authoring convention: open every blog post with a 60–120 word TL;DR paragraph immediately under the H1. LLM crawlers (ChatGPT, Perplexity, AI Overviews) draw ~44% of their citations from the first 30% of an article, so front-loading the answer compounds visibility.
- **Research authoring**: use the YAML folded scalar (`abstract: >-`) — block scalar (`|`) preserves newlines and the abstract renders with broken lines. Authors use a structured array; `affiliations` indices are 1-based and reference the entry's `affiliations` array. `section` drives listing-page grouping (`top-tier` / `conferences` / `journals` / `workshops` / `others`). `new: true` renders a NEW badge inline with the title on the listing card. `comingSoon: true` swaps the listing thumbnail for the `ComingSoonImage` pastel placeholder (no thumbnail/teaser required). Authors matching `SITE_AUTHOR.name` are auto-bolded across `HeadingResearch` and `ResearchItem`.
- **Author / affiliation superscripts** in `HeadingResearch` are conditional. Each marker only renders when it actually disambiguates something:
  - `*` (corresponding author) — `corresponding: true` on the author. Shows when **2+ authors** AND at least one is corresponding.
  - `†` (equal contribution) — `equalContribution: true` on the author. Shows when **2+ authors** AND at least 2 are flagged. Renders on every flagged author.
  - `‡` (principal investigator) — `principalInvestigator: true` on the author. Shows when **2+ authors** AND at least one is PI.
  - `¹ ² ³` (affiliation indices) — derived from `affiliations: [...]` on each author. Shows when **2+ affiliations** exist on the entry.

  Marker order on each author follows academic convention: `*†‡` then numeric indices. The affiliation legend below the author line drops its leading `<sup>` under the same `showAffSup` rule. Single-author / single-affiliation entries collapse to clean text — no orphan markers. Each `<sup>` has `cursor-help` + a native `title` tooltip (affiliation index sups resolve to the full affiliation name; symbol sups resolve to their caption text). A combined caption line appears below the affiliation row when any symbol marker is shown — e.g. `*Corresponding author · †Equal contribution · ‡Principal investigator` — joined by `·`.

## Content Authoring Workflow

How to write a new blog / portfolio / research entry without re-deriving conventions from scratch. **Read this before any "write me a blog post about X" task.**

1. **File locations.** Blog → `src/data/blog/*.mdx`. Portfolio → `src/data/portfolio/*.mdx`. Research → `src/data/research/*.mdx`. Filename (minus `.mdx`) becomes the URL slug — kebab-case, short, topical (3–4 words max, no date prefix).

2. **Tone anchors.** First-person, conversational-technical, title-case headings, 850–1,400 words. Before drafting, **read 1–2 thematically adjacent posts in full** to calibrate voice. Reference posts: `local-llm-pdf-ocr.mdx` (deep technical, ~1,400w), `autograder-architecture.mdx` (architecture, ~850w), `doi-paper-scraper.mdx` (tooling), `modelfile-syntax-extension.mdx` (developer tool launch).

3. **TL;DR rule.** Open every blog post with a 60–120 word TL;DR paragraph **immediately under the frontmatter** (no `# Title` markdown — the page template renders frontmatter `title` as H1). LLM crawlers pull ~44% of citations from the first 30%, so front-loading the punch is non-negotiable.

4. **Frontmatter shape** (Blog). Mirror existing posts:

   ```yaml
   title: 'Bold sentence-case title'
   summary: "Single-sentence summary, doubles as meta description."
   featured: true                          # surfaces on home page
   author_name: 'Ahnaf An Nafee'
   github_username: 'ahnafnafee'
   published: 'MM/DD/YYYY'                 # today's date
   topics: ['Topic 1', 'Topic 2', ...]     # 4–6 broad categories
   keywords: ['kw1', 'kw2', ...]           # 30–40 lowercase entries
   thumbnail: null                         # or ImageKit URL — see #7
   related: []                             # other slugs to cross-link
   ```

   Research entries are richer (`authors[]`, `affiliations[]`, `venue`, `links`, `identifiers`, structured author flags) — see `Research` in `src/types/index.d.ts` and existing entries in `src/data/research/`. Research abstracts MUST use the YAML folded scalar `abstract: >-` (block scalar `|` preserves newlines and renders broken).

5. **Body structure.** Title-case headings. One Mermaid diagram per major architectural section is on-brand (use ```` ```mermaid ```` fences — handled by `Mermaid.tsx`). Code blocks framed by prose, not by intro text ("Here's an example:" — avoid). Tables fine for reference data. Raw `<img src=... className='w-full rounded-lg' />` for in-body images — the default `<img>` MDX mapping was intentionally removed.

6. **MDX components available.** From `src/components/content/mdx/`: `Pre`, `Code`, `Mermaid`, `ContentImage`, `MDXLink`, `Blockquote`, `Table`, `Headings`. Plugin set: remark-gfm, remark-math + rehype-katex (`$...$` and `$$...$$`), rehype-prism-plus, rehype-slug. Prism languages include js/ts/tsx/jsx/py/bash/json/yaml/css/html/sql/rust/go/java/c/cpp — unknown languages render as plain text.

7. **Thumbnail image generation (canonical theme).** The `thumbnail:` field is either an ImageKit URL at `https://ik.imagekit.io/8ieg70pvks/blog/<slug>.{jpg|jpeg|png}` or `null` to fall back to `/api/og`. For AI-generated thumbnails (ChatGPT Images 2.0 / GPT Image / DALL·E 3), use the **"Editorial Tech Illustration"** theme:

   - **Style anchor**: Flat editorial tech illustration — Stripe blog / Vercel changelog / Linear docs feel. Geometric, clean, modern. **No** hand-drawn squiggles, **no** sticker / doodle aesthetic, **no** 3D renders, **no** photorealism, **no** whiteboard textures.
   - **Background**: Warm off-white `#FAF9F6` with a barely-visible dotted grid for subtle texture.
   - **Composition**: Title top-left in bold sans-serif (`#1F2937`, ≤ 2 lines, 8% padding from edges); byline `Ahnaf An Nafee` directly below in regular weight (`#6B7280`, 70% title size); hero illustration occupying the center 60% horizontally centered; bottom 10% breathing room.
   - **Palette (strict)**: only these colors —
     | Hex | Role |
     | --- | --- |
     | `#FAF9F6` | Background |
     | `#3B82F6` | Blue primary (main brand accent) |
     | `#8B5CF6` | Purple accent |
     | `#F59E0B` | Orange accent |
     | `#10B981` | Green accent (optional — "growth" / "success" themes) |
     | `#EF4444` | Warning red (sparingly — error / warning semantics only) |
     | `#1F2937` | Dark text |
     | `#6B7280` | Muted text / connector lines |
     | `#FFFFFF` | Card surfaces |
     | `#E5E7EB` | Card borders |
   - **Draw style**: Flat shapes, no gradients, no glow, subtle drop shadows (max 8% opacity), 1.5–2px line weights, 8px rounded corners, generous whitespace.
   - **Aspect ratio**: **16:9 at 1200×630**. The listing-card and post-detail thumbnail containers crop non-16:9 images on narrow viewports (mobile), so tighter aspect ratios like 4:3 / 3:2 lose top/bottom content. Note: 16:9 also matches the OG card spec, but thumbnails and OG cards are still separate concerns — when `thumbnail:` is `null` the OG image is generated programmatically via `/api/og` (see `src/libs/metapage` `generateOgImage`); when set, the same image is used for both the listing card and the OG card.
   - **Universal template prompt** (fill in `{TITLE}` and `{HERO}`):

     > Create a 1200×630 wide thumbnail image (16:9 aspect ratio) for a developer blog post titled "{TITLE}" by Ahnaf An Nafee. Style: flat editorial tech illustration in the spirit of Stripe blog, Vercel changelog, or Linear docs — geometric, clean, modern. Background: warm off-white #FAF9F6 with a faint dotted-grid texture. Title text in bold sans-serif (#1F2937), top-left aligned with 8% padding, 2 lines maximum. Byline "Ahnaf An Nafee" directly below the title in regular-weight sans-serif (#6B7280), 70% the title size. Hero illustration occupying the center-right 60% of the canvas (16:9 is wide — use the horizontal space): {HERO}. Strict palette — only these colors: #FAF9F6 (bg), #3B82F6 (blue), #8B5CF6 (purple), #F59E0B (orange), #10B981 (green, only for growth themes), #EF4444 (red, only for warning semantics), #1F2937 (dark text), #6B7280 (muted/lines), #FFFFFF with #E5E7EB borders (cards). Flat shapes only — no gradients, no glow, subtle drop shadows (max 8% opacity), 1.5–2px line weights, 8px rounded corners, generous whitespace. Avoid: hand-drawn squiggles, sticker / doodle style, 3D depth, photorealism, real readable code, whiteboard textures, brand logos other than abstract representations.
   - **Retroactive application**: The earlier thumbnails (`local-llm-pdf-ocr`, `doi-paper-scraper`, `autograder-architecture`) are in an older hand-drawn whiteboard style and should be re-generated under this theme when bandwidth allows. Workflow: generate the new image → upload to ImageKit at `blog/<slug>.{jpg|png}` → update the post's `thumbnail:` field with the new URL (include `?updatedAt=<unix-ms>` for cache-bust) → optionally set `updated: 'MM/DD/YYYY'` to bump the freshness signal in the sitemap and `dateModified` JSON-LD.

8. **Related posts.** `related: []` is the default. When adding a new post, optionally scan for natural backlinks and update older posts' `related:` arrays — polish step, don't gate on it.

9. **Pre-write checklist.** `Glob src/data/blog/*.mdx` → read closest anchor post → confirm `Blog` type in `src/types/index.d.ts` → fetch repo README if applicable (`gh api repos/<owner>/<repo>/readme --jq '.content' | base64 -d`) → confirm today's date for `published`.

10. **Verify checklist.** `yarn type-check` → `yarn lint` → `yarn dev` → visit `/blog/<slug>` → confirm TL;DR renders under H1, headings have anchors, Mermaid renders, code blocks colored → `yarn build` → `yarn validate:json-ld` → `yarn audit:alt-text` if any `<img>` / `<ContentImage>` → word count in 850–1,400 range → TL;DR is 60–120 words (count it).

11. **What NOT to do.** No `# Title` markdown (page template handles H1). No "In this post, I'll explain..." filler — open with the punch. No keyword stuffing without body coverage. No fabricated stats / version numbers / model names — verify against linked sources. No paragraph-length comments inside code blocks — let prose do the work.

## Indexing Helper

`indexing/sendIndexingRequest.ts` reads URLs from the live sitemap, checks Search Console for index status, and submits unindexed URLs to the Google Indexing API. Requires `indexing/service_account.json` (gitignored) with Indexing API + Search Console API enabled and the service account added as an Owner in Search Console. The `indexing/` directory is excluded from the TypeScript build (`tsconfig.json`).

## Memory

There is per-project memory at `C:\Users\ahnaf\.claude\projects\D--GitHub-ahnafnafee-dev\memory\` — check `MEMORY.md` there at the start of a session for any user feedback or environment notes (e.g. `gh` CLI is installed and preferred over curl/WebFetch for any GitHub work).

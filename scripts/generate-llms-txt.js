// Generates public/llms.txt (a curated map of the site) and public/llms-full.txt
// (every document inlined in full). Chained into `yarn build` and `yarn export`
// so both ship a fresh pair. LLMs (ChatGPT, Perplexity, Claude) read llms.txt to
// find content and llms-full.txt to answer from one fetch instead of crawling
// each URL.

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Mirrors src/libs/constants/site.ts. Override via NEXT_PUBLIC_SITE_URL when
// generating for a non-canonical host (preview deploys, university mirror).
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').trim() || 'https://www.ahnafnafee.dev'
const OUTPUT = path.join(__dirname, '..', 'public', 'llms.txt')
const OUTPUT_FULL = path.join(__dirname, '..', 'public', 'llms-full.txt')

function readMdxEntries(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '')
      try {
        const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'))
        return { slug, content, ...data }
      } catch (err) {
        console.warn(`[llms.txt] Failed to parse ${f}:`, err.message)
        return null
      }
    })
    .filter(Boolean)
}

function fmtDate(value) {
  if (!value) return ''
  const str = String(value).trim()
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) {
    const [, mm, dd, yyyy] = m
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
  }
  const d = new Date(str)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
}

const blogs = readMdxEntries(path.join(__dirname, '..', 'src', 'data', 'blog'))
const portfolio = readMdxEntries(path.join(__dirname, '..', 'src', 'data', 'portfolio'))
const research = readMdxEntries(path.join(__dirname, '..', 'src', 'data', 'research'))

// Sort blogs newest-first by published.
blogs.sort((a, b) => {
  const da = new Date(a.published || 0).getTime()
  const db = new Date(b.published || 0).getTime()
  return db - da
})
portfolio.sort((a, b) => {
  const da = new Date(a.date || 0).getTime()
  const db = new Date(b.date || 0).getTime()
  return db - da
})
research.sort((a, b) => {
  const da = new Date(a.published || 0).getTime()
  const db = new Date(b.published || 0).getTime()
  return db - da
})

const lines = [
  '# llms.txt - Information for AI assistants and LLMs',
  '# Learn more: https://llmstxt.org/',
  '',
  '> Ahnaf An Nafee — PhD student at GMU researching the intersection of AI and 3D computer graphics. Building scalable applications and immersive experiences.',
  '',
  '# Site Information',
  '- Name: Ahnaf An Nafee',
  `- URL: ${BASE_URL}`,
  '- Description: Personal portfolio and blog covering AI-driven 3D content generation, machine learning for graphics, software engineering, and game development.',
  '- Topics: Artificial Intelligence, 3D Computer Graphics, Machine Learning, Generative AI, Software Engineering, Game Development, React, Next.js, TypeScript, Unity, Unreal Engine, Python',
  '',
  '# Content Access',
  '',
  '## Blog',
  '- RSS Feed: /rss.xml (all posts with descriptions)',
  '- Full RSS: /rss-full.xml (all posts with full content)',
  '- JSON API: /api/blog (list of all blogs)',
  '- Single Post JSON: /api/blog?slug={slug}',
  '- Single Post Markdown: /api/blog?slug={slug}&format=md',
  '- Open Graph Meta: /meta/blog?slug={slug}',
  '',
  '## Portfolio',
  '- JSON API: /api/portfolio (list of all projects)',
  '- Single Project JSON: /api/portfolio?slug={slug}',
  '- Single Project Markdown: /api/portfolio?slug={slug}&format=md',
  '- Open Graph Meta: /meta/portfolio?slug={slug}',
  '',
  '## Research',
  '- JSON API: /api/research (list of all research entries)',
  '- Single Entry JSON: /api/research?slug={slug}',
  '- Single Entry Markdown: /api/research?slug={slug}&format=md',
  '- Open Graph Meta: /meta/research?slug={slug}',
  '',
  '## Discovery',
  '- Sitemap: /sitemap.xml',
  '- Full content of every post, project, and research entry in one file: /llms-full.txt',
  '',
  '# Blog Posts',
  ''
]

for (const post of blogs) {
  const published = fmtDate(post.published)
  const updated = fmtDate(post.updated)
  const stamp =
    updated && updated !== published ? `published ${published}, updated ${updated}` : `published ${published}`
  lines.push(`- [${post.title}](${BASE_URL}/blog/${post.slug}) — ${stamp}`)
  if (post.summary) lines.push(`  Summary: ${post.summary}`)
  if (Array.isArray(post.topics) && post.topics.length) lines.push(`  Topics: ${post.topics.join(', ')}`)
  lines.push('')
}

lines.push('# Research')
lines.push('')

for (const r of research) {
  const published = fmtDate(r.published)
  const updated = fmtDate(r.updated)
  const stamp =
    updated && updated !== published ? `published ${published}, updated ${updated}` : `published ${published}`
  lines.push(`- [${r.title}](${BASE_URL}/research/${r.slug}) — ${stamp}`)
  if (r.summary) lines.push(`  Summary: ${r.summary}`)
  if (Array.isArray(r.topics) && r.topics.length) lines.push(`  Topics: ${r.topics.join(', ')}`)
  if (r.venue && (r.venue.name || r.venue.short)) {
    const v = r.venue.short || r.venue.name
    lines.push(`  Venue: ${v}${r.venue.year ? ` (${r.venue.year})` : ''}`)
  }
  if (r.links && r.links.paper) lines.push(`  Paper: ${r.links.paper}`)
  if (r.links && r.links.code) lines.push(`  Code: ${r.links.code}`)
  lines.push('')
}

lines.push('# Portfolio')
lines.push('')

for (const project of portfolio) {
  const date = fmtDate(project.date)
  const updated = fmtDate(project.updated)
  const stamp = updated && updated !== date ? `${date}, updated ${updated}` : date
  lines.push(`- [${project.title}](${BASE_URL}/portfolio/${project.slug}) — ${stamp}`)
  if (project.summary) lines.push(`  Summary: ${project.summary}`)
  if (Array.isArray(project.stack) && project.stack.length) lines.push(`  Stack: ${project.stack.join(', ')}`)
  lines.push('')
}

lines.push('# How to Use This Site')
lines.push('1. Fetch /api/blog for a list of all published blog posts')
lines.push('2. Use /api/blog?slug={slug}&format=md to get full markdown content of any post')
lines.push('3. Fetch /api/portfolio for a list of all projects')
lines.push('4. Subscribe to /rss-full.xml for complete article content')
lines.push('5. Or fetch /llms-full.txt once for the complete text of everything above')
lines.push('')
lines.push('# Permissions')
lines.push('- AI assistants may read and summarize content from this site')
lines.push('- Content may be used for training with attribution')
lines.push('- Please link back to original articles/projects when citing')
lines.push('')
lines.push('# Contact')
lines.push('- GitHub: https://github.com/ahnafnafee')
lines.push('- LinkedIn: https://www.linkedin.com/in/ahnafnafee')
lines.push('- Twitter: https://twitter.com/ahnaf_nafee')
lines.push('')

fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8')
console.log(
  `[llms.txt] Wrote ${blogs.length} posts + ${portfolio.length} projects + ${research.length} research entries to ${OUTPUT}`
)

// llms-full.txt inlines each document's body verbatim. MDX bodies carry no H1
// (the page template renders the frontmatter title), so an H1 per document keeps
// the concatenated file's heading hierarchy intact.
function fullSection(entry, section) {
  const published = fmtDate(entry.published || entry.date)
  const updated = fmtDate(entry.updated)
  const out = [`# ${entry.title}`, '', `URL: ${BASE_URL}/${section}/${entry.slug}`]
  if (published) {
    out.push(`Published: ${published}${updated && updated !== published ? ` (updated ${updated})` : ''}`)
  }
  if (entry.summary) out.push(`Summary: ${entry.summary}`)
  if (Array.isArray(entry.topics) && entry.topics.length) out.push(`Topics: ${entry.topics.join(', ')}`)
  if (Array.isArray(entry.stack) && entry.stack.length) out.push(`Stack: ${entry.stack.join(', ')}`)
  out.push('', (entry.content || '').trim(), '', '---', '')
  return out
}

const fullLines = [
  '# Ahnaf An Nafee - Full Site Content',
  '',
  `> Complete text of every blog post, research entry, and portfolio project on ${BASE_URL}.`,
  `> Curated index and API map: ${BASE_URL}/llms.txt`,
  '> Content may be used with attribution. Please link back to the URL listed above each document.',
  '',
  '---',
  ''
]

for (const post of blogs) fullLines.push(...fullSection(post, 'blog'))
for (const r of research) fullLines.push(...fullSection(r, 'research'))
for (const project of portfolio) fullLines.push(...fullSection(project, 'portfolio'))

fs.writeFileSync(OUTPUT_FULL, fullLines.join('\n'), 'utf8')
console.log(
  `[llms.txt] Wrote ${(fs.statSync(OUTPUT_FULL).size / 1024).toFixed(0)} KB of full content to ${OUTPUT_FULL}`
)

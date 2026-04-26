const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Hardcode the canonical site URL. We never want localhost in sitemap.xml,
// even on local builds — sitemap.xml is gitignored but Vercel/static-export
// builds should produce identical output regardless of NODE_ENV (which yarn
// doesn't propagate to postbuild). Override with SITE_URL if a sub-path build
// needs it.
const isStaticExport = process.env.STATIC_EXPORT === 'true'
const siteUrl = process.env.SITE_URL || 'https://www.ahnafnafee.dev'

// Parse MM/DD/YYYY or ISO frontmatter dates → ISO string. Returns null on failure.
function toIso(value) {
  if (!value) return null
  const str = String(value).trim()
  const mmddyyyy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mmddyyyy) {
    const [, mm, dd, yyyy] = mmddyyyy
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    return Number.isNaN(d.getTime()) ? null : d.toISOString()
  }
  const iso = new Date(str)
  return Number.isNaN(iso.getTime()) ? null : iso.toISOString()
}

// Walk MDX content directories once at module load.
// Stores lastmod + thumbnail + title per route so transform() can emit
// image sitemap entries (boosts Google Images discoverability).
function loadFrontmatterMeta() {
  const map = new Map()
  const dataRoot = path.join(__dirname, 'src', 'data')
  const sections = [
    { dir: path.join(dataRoot, 'blog'), prefix: '/blog', imageKey: 'thumbnail' },
    { dir: path.join(dataRoot, 'portfolio'), prefix: '/portfolio', imageKey: 'image' },
    { dir: path.join(dataRoot, 'research'), prefix: '/research', imageKey: 'teaser' }
  ]
  for (const { dir, prefix, imageKey } of sections) {
    if (!fs.existsSync(dir)) continue
    for (const entry of fs.readdirSync(dir)) {
      if (!entry.endsWith('.mdx')) continue
      const slug = entry.replace(/\.mdx$/, '')
      try {
        const raw = fs.readFileSync(path.join(dir, entry), 'utf8')
        const { data } = matter(raw)
        const candidate = data.updated || data.published || data.date
        const iso = toIso(candidate)
        const meta = {
          lastmod: iso || null,
          image: data[imageKey] || null,
          title: data.title || null
        }
        map.set(`${prefix}/${slug}`, meta)
      } catch (err) {
        console.warn(`[sitemap] Failed to parse ${entry}:`, err.message)
      }
    }
  }
  return map
}

const frontmatterMeta = loadFrontmatterMeta()
const buildTime = new Date().toISOString()

function priorityFor(path) {
  if (path === '/') return { priority: 1.0, changefreq: 'weekly' }
  if (path === '/resume') return { priority: 0.9, changefreq: 'monthly' }
  if (path === '/portfolio' || path === '/blog') return { priority: 0.8, changefreq: 'weekly' }
  if (path === '/research') return { priority: 0.8, changefreq: 'weekly' }
  if (path.startsWith('/portfolio/')) return { priority: 0.7, changefreq: 'monthly' }
  if (path.startsWith('/research/')) return { priority: 0.75, changefreq: 'monthly' }
  if (path.startsWith('/blog/')) return { priority: 0.6, changefreq: 'monthly' }
  if (path.startsWith('/snippet/')) return { priority: 0.5, changefreq: 'monthly' }
  return { priority: 0.7, changefreq: 'monthly' }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  // Auto-generate robots.txt. The hardcoded siteUrl (top of file) ensures local
  // builds output the canonical domain too, not localhost — so the committed
  // file is identical to what Vercel produces.
  generateRobotsTxt: !isStaticExport,
  robotsTxtOptions: {
    policies: [
      // Single combined wildcard record so crawlers that only honor the first
      // matching User-agent don't miss the Disallow directives.
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/static/'] },
      // AI / LLM crawlers — explicitly allow each so they don't fall back to
      // wildcard rules and so we have a single source of truth.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' }
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`, `${siteUrl}/server-sitemap.xml`],
    crawlDelay: 1
  },
  priority: 1.0,
  exclude: ['/server-sitemap.xml', '/api/*', '/_next/*', '/static/*', '/.well-known/*'],
  generateIndexSitemap: false,
  sitemapSize: 10000,
  changefreq: 'weekly',
  transform: async (config, urlPath) => {
    const { priority, changefreq } = priorityFor(urlPath)
    const meta = frontmatterMeta.get(urlPath)
    const entry = {
      loc: urlPath,
      changefreq,
      priority,
      lastmod: (meta && meta.lastmod) || buildTime
    }
    if (meta && meta.image) {
      // next-sitemap reads `image.loc.href`, so wrap in a URL object.
      // Skip silently if the URL is malformed (don't block the build).
      try {
        entry.images = [{ loc: new URL(meta.image), title: meta.title || urlPath }]
      } catch {}
    }
    return entry
  },
  additionalPaths: async (config) => {
    return [
      await config.transform(config, '/'),
      await config.transform(config, '/resume'),
      await config.transform(config, '/portfolio'),
      await config.transform(config, '/blog'),
      await config.transform(config, '/research'),
    ]
  }
}

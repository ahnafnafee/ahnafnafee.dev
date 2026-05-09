#!/usr/bin/env node
/**
 * Unified search-engine notifier: IndexNow + Google Indexing API + Baidu Push.
 *
 * Resolves URLs from one of three sources, in priority order:
 *   1. CLI args  — node scripts/notify-search-engines.js <url> [url ...]
 *   2. CHANGED_FILES env (newline-separated paths from CI git-diff) — maps
 *      src/data/{blog,portfolio,research}/<slug>.mdx → /<section>/<slug>.
 *   3. Sitemap mode — fetch sitemap.xml and submit every URL (use sparingly;
 *      IndexNow has per-host rate limits, and Google has a 200/day quota).
 *
 * Engines are best-effort: a Baidu token miss or Google API failure does not
 * fail the run — IndexNow alone covers Bing/Yahoo/DuckDuckGo/Yandex.
 */

const { submit: indexnow } = require('./indexnow-submit')
const { push: baidu } = require('./baidu-push')
const { publish: google } = require('./google-index-urls')

const SITE = process.env.SITE_URL || 'https://www.ahnafnafee.dev'

function changedFilesToUrls(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
  const urls = new Set()
  for (const line of lines) {
    // Match src/data/<section>/<slug>.mdx — sections are blog/portfolio/research.
    const m = line.match(/^src\/data\/(blog|portfolio|research)\/([^/]+)\.mdx$/)
    if (m) {
      urls.add(`${SITE}/${m[1]}/${m[2]}`)
      // Also nudge the listing page since it shows the new card.
      urls.add(`${SITE}/${m[1]}`)
    }
  }
  return [...urls]
}

async function urlsFromSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function resolveUrls() {
  const cliArgs = process.argv.slice(2).filter(Boolean)
  if (cliArgs.length) return cliArgs
  if (process.env.CHANGED_FILES) {
    const urls = changedFilesToUrls(process.env.CHANGED_FILES)
    if (urls.length) return urls
    console.log('[notify] CHANGED_FILES set but no MDX content paths matched; skipping')
    return []
  }
  if (process.env.SITEMAP_MODE === 'true') {
    return urlsFromSitemap()
  }
  console.error('[notify] no URLs (pass args, set CHANGED_FILES, or SITEMAP_MODE=true)')
  return []
}

async function main() {
  const urls = await resolveUrls()
  if (!urls.length) {
    console.log('[notify] nothing to submit')
    return
  }
  console.log(`[notify] submitting ${urls.length} URL(s):`)
  for (const u of urls) console.log(`  - ${u}`)
  const results = await Promise.allSettled([indexnow(urls), google(urls), baidu(urls)])
  results.forEach((r, i) => {
    const name = ['indexnow', 'google', 'baidu'][i]
    if (r.status === 'rejected') console.error(`[notify] ${name} threw:`, r.reason?.message || r.reason)
  })
  // Only fail the process if IndexNow fails — it's the load-bearing engine.
  const indexnowResult = results[0]
  if (indexnowResult.status === 'rejected' || indexnowResult.value?.ok === false) {
    process.exit(1)
  }
}

main()

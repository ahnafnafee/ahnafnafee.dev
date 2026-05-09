#!/usr/bin/env node
/**
 * Submit URLs to IndexNow — covers Bing, Yahoo, DuckDuckGo, Yandex, Seznam.
 *
 * IndexNow is a single open protocol that all participating search engines
 * share. One POST to api.indexnow.org fans out to every member. No account,
 * no API key registration — just a public key file at the site root.
 *
 * Docs: https://www.indexnow.org/documentation
 *
 * Usage:
 *   node scripts/indexnow-submit.js https://www.ahnafnafee.dev/research
 *   node scripts/indexnow-submit.js url1 url2 url3
 *
 * Env:
 *   INDEXNOW_KEY    — 8-128 char alphanumeric key (matches public/<key>.txt).
 *                     Defaults to the committed key if unset.
 *   INDEXNOW_HOST   — host to submit for. Defaults to www.ahnafnafee.dev.
 */

const DEFAULT_KEY = 'e9d816e728085bf88259a66cffd93444'
const DEFAULT_HOST = 'www.ahnafnafee.dev'
const ENDPOINT = 'https://api.indexnow.org/IndexNow'

async function submit(urls, { key, host } = {}) {
  const k = key || process.env.INDEXNOW_KEY || DEFAULT_KEY
  const h = host || process.env.INDEXNOW_HOST || DEFAULT_HOST
  if (!urls.length) {
    console.log('[indexnow] no URLs to submit')
    return { ok: true, submitted: 0 }
  }
  const body = {
    host: h,
    key: k,
    keyLocation: `https://${h}/${k}.txt`,
    urlList: urls
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  })
  // 200 = success, 202 = accepted (still queued), 422 = URL doesn't match host,
  // 400 = bad request, 403 = key file mismatch, 429 = rate limited.
  if (res.status === 200 || res.status === 202) {
    console.log(`[indexnow] ✅ ${res.status} — submitted ${urls.length} URL(s)`)
    return { ok: true, submitted: urls.length, status: res.status }
  }
  const text = await res.text().catch(() => '')
  console.error(`[indexnow] ❌ ${res.status} ${res.statusText}: ${text}`)
  return { ok: false, status: res.status, error: text }
}

async function main() {
  const urls = process.argv.slice(2).filter(Boolean)
  if (!urls.length) {
    console.error('Usage: node scripts/indexnow-submit.js <url> [url ...]')
    process.exit(1)
  }
  const result = await submit(urls)
  process.exit(result.ok ? 0 : 1)
}

if (require.main === module) main()

module.exports = { submit }

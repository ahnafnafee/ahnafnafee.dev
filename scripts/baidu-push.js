#!/usr/bin/env node
/**
 * Submit URLs to Baidu Search via the Push (普通收录) API.
 *
 * Docs: https://ziyuan.baidu.com/linksubmit/index
 * Endpoint requires a per-site token from Baidu Search Resource Platform.
 *
 * Usage:
 *   BAIDU_PUSH_TOKEN=xxx node scripts/baidu-push.js url1 url2
 *
 * Env:
 *   BAIDU_PUSH_TOKEN — required. Token shown in Baidu's Push API config page.
 *   BAIDU_HOST       — site host registered with Baidu (no scheme).
 *                      Defaults to www.ahnafnafee.dev.
 *
 * Skips silently when token is missing — lets the unified runner call this
 * unconditionally on machines that haven't registered with Baidu.
 */

const DEFAULT_HOST = 'www.ahnafnafee.dev'

async function push(urls, { token, host } = {}) {
  const t = token || process.env.BAIDU_PUSH_TOKEN
  const h = host || process.env.BAIDU_HOST || DEFAULT_HOST
  if (!t) {
    console.log('[baidu] BAIDU_PUSH_TOKEN not set — skipping')
    return { ok: true, skipped: true }
  }
  if (!urls.length) {
    console.log('[baidu] no URLs to submit')
    return { ok: true, submitted: 0 }
  }
  const endpoint = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(h)}&token=${encodeURIComponent(t)}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: urls.join('\n')
  })
  const json = await res.json().catch(() => ({}))
  if (res.ok && typeof json.success === 'number') {
    console.log(`[baidu] ✅ accepted ${json.success}/${urls.length}; remaining quota=${json.remain}`)
    if (json.not_same_site?.length) console.warn('[baidu] not_same_site:', json.not_same_site)
    if (json.not_valid?.length) console.warn('[baidu] not_valid:', json.not_valid)
    return { ok: true, submitted: json.success }
  }
  console.error(`[baidu] ❌ ${res.status}:`, json)
  return { ok: false, error: json }
}

async function main() {
  const urls = process.argv.slice(2).filter(Boolean)
  if (!urls.length) {
    console.error('Usage: BAIDU_PUSH_TOKEN=xxx node scripts/baidu-push.js <url> [url ...]')
    process.exit(1)
  }
  const result = await push(urls)
  process.exit(result.ok ? 0 : 1)
}

if (require.main === module) main()

module.exports = { push }

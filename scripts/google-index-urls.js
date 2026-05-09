#!/usr/bin/env node
/**
 * Submit a small set of URLs to Google's Indexing API.
 *
 * Companion to indexing/sendIndexingRequest.ts (which scans the whole sitemap
 * and shuffles a daily batch). This one is the on-deploy hook: given N changed
 * URLs from a CI run, push them through urlNotifications.publish.
 *
 * Note: Google officially only accepts JobPosting and BroadcastEvent URLs via
 * the Indexing API. Other URLs are accepted in practice but not guaranteed —
 * the reliable signal for normal pages remains a fresh sitemap + Search Console.
 * Submitting here is best-effort and never blocks the pipeline.
 *
 * Usage:
 *   GOOGLE_SERVICE_ACCOUNT_JSON='{"client_email":...,"private_key":...}' \
 *     node scripts/google-index-urls.js url1 url2
 *
 * Env:
 *   GOOGLE_SERVICE_ACCOUNT_JSON — JSON string of the service account credentials.
 *                                 Falls back to indexing/service_account.json on disk.
 */

const fs = require('fs')
const path = require('path')

async function loadAuth() {
  let creds
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    } catch (err) {
      console.error('[google] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON:', err.message)
      return null
    }
  } else {
    const file = path.join(__dirname, '..', 'indexing', 'service_account.json')
    if (!fs.existsSync(file)) {
      console.log('[google] no credentials (env or indexing/service_account.json) — skipping')
      return null
    }
    creds = JSON.parse(fs.readFileSync(file, 'utf8'))
  }
  // Lazy require so the script works even if googleapis isn't installed in CI's
  // minimal image. CI workflow installs deps before invoking, so this is safe.
  const { google } = require('googleapis')
  return new google.auth.GoogleAuth({
    credentials: { client_email: creds.client_email, private_key: creds.private_key },
    scopes: ['https://www.googleapis.com/auth/indexing']
  })
}

async function publish(urls) {
  const auth = await loadAuth()
  if (!auth) return { ok: true, skipped: true }
  if (!urls.length) {
    console.log('[google] no URLs to submit')
    return { ok: true, submitted: 0 }
  }
  const { google } = require('googleapis')
  const indexing = google.indexing({ version: 'v3', auth })
  let submitted = 0
  for (const url of urls) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' }
      })
      console.log(`[google] 🚀 ${res.status} ${url}`)
      submitted++
    } catch (err) {
      // 403 = API not enabled or service account lacks permission. Don't fail
      // the whole pipeline — IndexNow + sitemap still cover us.
      console.error(`[google] ❌ ${url}: ${err.message}`)
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  return { ok: true, submitted }
}

async function main() {
  const urls = process.argv.slice(2).filter(Boolean)
  if (!urls.length) {
    console.error('Usage: node scripts/google-index-urls.js <url> [url ...]')
    process.exit(1)
  }
  const result = await publish(urls)
  process.exit(result.ok ? 0 : 1)
}

if (require.main === module) main()

module.exports = { publish }

import { neon } from '@neondatabase/serverless'

// Lazy singleton. Built once on first call to keep cold-start cheap and to
// avoid throwing at module-import time if DATABASE_URL is missing.
//
// Returns null instead of throwing when DATABASE_URL is unset so contributors
// without DB credentials can still run `yarn build` and `yarn dev`. Callers
// that need a value MUST handle null (treat it as a degraded-mode signal).

type SqlClient = ReturnType<typeof neon>

let cached: SqlClient | null | undefined

export function getSql(): SqlClient | null {
  if (cached !== undefined) return cached
  const url = process.env.DATABASE_URL
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      // Loud in prod logs — silent in dev so a contributor without DB access
      // doesn't get spammed every hot reload.
      console.warn('[neon] DATABASE_URL not set — pageview reads/writes will no-op.')
    }
    cached = null
    return null
  }
  cached = neon(url)
  return cached
}

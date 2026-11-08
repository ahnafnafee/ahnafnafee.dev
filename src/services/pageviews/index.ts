import { isPublishedContentSlug } from '@/services/content/slugs'
import { getSql } from '@/services/db/neon'

export const PAGEVIEW_WRITE_LIMIT = 120
export const PAGEVIEW_WINDOW_SECONDS = 60

export class InvalidPageviewSlugError extends Error {}
export class PageviewRateLimitError extends Error {}
export class PageviewUnavailableError extends Error {}

// All three functions degrade gracefully when DATABASE_URL is unset:
//   - getView / getViewsBatch return 0 / {}
//   - incrementView returns 0
// This keeps the UI rendering and the build green when the env isn't wired.

export async function getView(slug: string): Promise<number> {
  const sql = getSql()
  if (!sql) return 0
  try {
    const rows = (await sql`SELECT count FROM pageviews WHERE slug = ${slug}`) as Array<{ count: number | string }>
    if (!rows[0]) return 0
    return Number(rows[0].count)
  } catch (err) {
    console.error('[pageviews.getView]', err)
    return 0
  }
}

export async function getViewsBatch(slugs: string[]): Promise<Record<string, number>> {
  const result: Record<string, number> = {}
  for (const s of slugs) result[s] = 0
  if (slugs.length === 0) return result
  const sql = getSql()
  if (!sql) return result
  try {
    const rows = (await sql`SELECT slug, count FROM pageviews WHERE slug = ANY(${slugs})`) as Array<{
      slug: string
      count: number | string
    }>
    for (const row of rows) result[row.slug] = Number(row.count)
    return result
  } catch (err) {
    console.error('[pageviews.getViewsBatch]', err)
    return result
  }
}

export async function incrementView(slug: string): Promise<number> {
  if (!(await isPublishedContentSlug(slug))) throw new InvalidPageviewSlugError('Unknown content slug')
  const sql = getSql()
  if (!sql) return 0
  let rows: Array<{ count: number | string }>
  try {
    // A single row lock protects the shared budget across server instances.
    // No per-visitor rows or process-local counters can grow without bound.
    rows = (await sql`
      INSERT INTO pageviews (slug, count, last_seen_at, write_window_started_at, write_window_count)
      VALUES (${slug}, 1, now(), now(), 1)
      ON CONFLICT (slug) DO UPDATE
      SET count = pageviews.count + 1,
          last_seen_at = now(),
          write_window_started_at = CASE
            WHEN pageviews.write_window_started_at <= now() - ${PAGEVIEW_WINDOW_SECONDS} * interval '1 second'
            THEN now() ELSE pageviews.write_window_started_at END,
          write_window_count = CASE
            WHEN pageviews.write_window_started_at <= now() - ${PAGEVIEW_WINDOW_SECONDS} * interval '1 second'
            THEN 1 ELSE pageviews.write_window_count + 1 END
      WHERE pageviews.write_window_started_at <= now() - ${PAGEVIEW_WINDOW_SECONDS} * interval '1 second'
         OR pageviews.write_window_count < ${PAGEVIEW_WRITE_LIMIT}
      RETURNING count
    `) as Array<{ count: number | string }>
  } catch (err) {
    console.error('[pageviews.incrementView]', err)
    throw new PageviewUnavailableError('Pageview storage unavailable')
  }
  if (!rows[0]) throw new PageviewRateLimitError('Pageview write limit reached')
  return Number(rows[0].count)
}

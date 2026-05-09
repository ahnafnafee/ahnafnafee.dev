import { getSql } from '@/services/db/neon'

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
  const sql = getSql()
  if (!sql) return 0
  try {
    const rows = (await sql`
      INSERT INTO pageviews (slug, count, last_seen_at)
      VALUES (${slug}, 1, now())
      ON CONFLICT (slug) DO UPDATE
      SET count = pageviews.count + 1, last_seen_at = now()
      RETURNING count
    `) as Array<{ count: number | string }>
    return rows[0] ? Number(rows[0].count) : 0
  } catch (err) {
    console.error('[pageviews.incrementView]', err)
    return 0
  }
}

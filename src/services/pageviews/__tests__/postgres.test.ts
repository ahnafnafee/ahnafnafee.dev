// @vitest-environment node
import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'

import { incrementView, PAGEVIEW_WRITE_LIMIT, PageviewRateLimitError, PageviewUnavailableError } from '../index'

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { sqlSpy } = vi.hoisted(() => ({ sqlSpy: vi.fn() }))
vi.mock('@/services/db/neon', () => ({ getSql: () => sqlSpy }))

const execute = promisify(execFile)
const container = process.env.PAGEVIEWS_TEST_POSTGRES_CONTAINER
const slug = 'autograder-architecture'

async function psql(query: string): Promise<string> {
  const { stdout } = await execute('docker', [
    'exec',
    container!,
    'psql',
    '-U',
    'postgres',
    '-X',
    '-A',
    '-t',
    '-q',
    '-v',
    'ON_ERROR_STOP=1',
    '-c',
    query
  ])
  return stdout.trim()
}

function literal(value: string | number): string {
  return typeof value === 'number' ? String(value) : `'${value.replace(/'/g, "''")}'`
}

describe.skipIf(!container)('pageview writes against isolated PostgreSQL', () => {
  let initialSchema: string
  let migration: string

  beforeAll(async () => {
    initialSchema = await readFile('db/migrations/0001_pageviews.sql', 'utf8')
    migration = await readFile('db/migrations/0002_pageview_write_limits.sql', 'utf8')
  })

  beforeEach(async () => {
    // The explicitly selected disposable container has no host-network access.
    await psql(`DROP TABLE IF EXISTS pageviews; ${initialSchema}`)
    sqlSpy.mockImplementation(async (strings: TemplateStringsArray, ...parameters: Array<string | number>) => {
      const query = strings.reduce(
        (text, part, i) => text + part + (i < parameters.length ? literal(parameters[i]) : ''),
        ''
      )
      return JSON.parse(
        await psql(`WITH affected AS (${query}) SELECT coalesce(json_agg(affected), '[]'::json) FROM affected;`)
      )
    })
  })

  it('applies the migration twice, preserves existing counts and counts a normal visit', async () => {
    await psql(`INSERT INTO pageviews (slug, count) VALUES ('${slug}', 42); ${migration} ${migration}`)
    expect(await incrementView(slug)).toBe(43)
    expect(await psql('SELECT write_window_count FROM pageviews')).toBe('1')
  })

  it('lets only one concurrent connection spend the final slot, then resets an expired window', async () => {
    await psql(
      `${migration} INSERT INTO pageviews (slug, count, write_window_count) VALUES ('${slug}', 500, ${PAGEVIEW_WRITE_LIMIT - 1});`
    )
    const attempts = await Promise.allSettled(Array.from({ length: 8 }, () => incrementView(slug)))
    expect(attempts.filter((attempt) => attempt.status === 'fulfilled')).toHaveLength(1)
    for (const attempt of attempts) {
      if (attempt.status === 'rejected') expect(attempt.reason).toBeInstanceOf(PageviewRateLimitError)
    }
    expect(await psql('SELECT count, write_window_count FROM pageviews')).toBe(`501|${PAGEVIEW_WRITE_LIMIT}`)
    await psql("UPDATE pageviews SET write_window_started_at = now() - interval '61 seconds'")
    expect(await incrementView(slug)).toBe(502)
    expect(await psql('SELECT write_window_count FROM pageviews')).toBe('1')
  }, 30000)

  it('fails closed without the migration and does not create an unrestricted row', async () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      await expect(incrementView(slug)).rejects.toBeInstanceOf(PageviewUnavailableError)
      expect(await psql('SELECT count(*) FROM pageviews')).toBe('0')
    } finally {
      errorLog.mockRestore()
    }
  })
})

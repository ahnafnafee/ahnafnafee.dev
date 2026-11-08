// @vitest-environment node
import { execFile, spawnSync } from 'node:child_process'
import { promisify } from 'node:util'

import { migrateProduction } from '../scripts/migrate-production.mjs'

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const production = {
  VERCEL: '1',
  VERCEL_ENV: 'production',
  VERCEL_TARGET_ENV: 'production',
  DATABASE_URL: 'postgres://migration-test:test-password@database.example.test/test'
}

type Batch = { queries: Array<{ query: string; params: unknown[] }> }

function success(batch: Batch) {
  return new Response(
    JSON.stringify({ results: batch.queries.map(() => ({ command: 'SET', fields: [], rows: [], rowCount: 0 })) }),
    { status: 200 }
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('production deployment migrations', () => {
  it.each([
    { VERCEL_ENV: 'preview', VERCEL_TARGET_ENV: 'preview' },
    { VERCEL_ENV: 'development', VERCEL_TARGET_ENV: 'development' },
    { VERCEL_ENV: 'production', VERCEL_TARGET_ENV: 'staging' }
  ])('never contacts a shared database for $VERCEL_TARGET_ENV builds', async (overrides) => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await migrateProduction({ ...production, ...overrides }, vi.fn())
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    { VERCEL: '' },
    { VERCEL_ENV: '' },
    { VERCEL_ENV: 'unknown' },
    { DATABASE_URL: '' },
    { DATABASE_URL: '  ' }
  ])('rejects incomplete production configuration before contacting storage: %j', async (overrides) => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await expect(migrateProduction({ ...production, ...overrides }, vi.fn())).rejects.toThrow(/required/)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends the ordered migrations in one bounded Neon transaction', async () => {
    const fetchMock = vi.fn(async (_url: unknown, options: RequestInit) => {
      return success(JSON.parse(String(options.body)))
    })
    vi.stubGlobal('fetch', fetchMock)
    const log = vi.fn()
    await migrateProduction(production, log)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const options = fetchMock.mock.calls[0][1]
    const batch: Batch = JSON.parse(String(options.body))
    expect(batch.queries.map(({ query }) => query)).toEqual([
      "SET LOCAL lock_timeout = '5s'",
      "SET LOCAL statement_timeout = '30s'",
      expect.stringContaining('pg_advisory_xact_lock'),
      expect.stringContaining('CREATE TABLE IF NOT EXISTS pageviews'),
      expect.stringContaining('CREATE INDEX IF NOT EXISTS pageviews_last_seen_idx'),
      expect.stringContaining('ADD COLUMN IF NOT EXISTS write_window_count')
    ])
    expect(options.signal).toBeInstanceOf(AbortSignal)
    expect(log.mock.calls.at(-1)?.[0]).toContain('committed')
  })

  it('propagates a storage failure without announcing a committed migration', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Database unavailable')))
    const log = vi.fn()
    await expect(migrateProduction(production, log)).rejects.toThrow()
    expect(log.mock.calls.flat().join(' ')).not.toContain('committed')
  })

  it('exits unsuccessfully and redacts provider errors from build logs', () => {
    const preload = `globalThis.fetch = async () => { throw new Error(${JSON.stringify(production.DATABASE_URL)}) }`
    const result = spawnSync(
      process.execPath,
      ['--import', `data:text/javascript,${encodeURIComponent(preload)}`, 'scripts/migrate-production.mjs'],
      { encoding: 'utf8', env: { ...process.env, ...production } }
    )
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Database migration failed. Build aborted.')
    expect(result.stderr).not.toContain('test-password')
    expect(result.stderr).not.toContain('database.example.test')
    expect(result.stdout).not.toContain('committed')
  })
})

const container = process.env.PAGEVIEWS_TEST_POSTGRES_CONTAINER
const execute = promisify(execFile)
const database = `deployment_migrations_${process.pid}`

async function psql(query: string, selectedDatabase = database) {
  const { stdout } = await execute('docker', [
    'exec',
    container!,
    'psql',
    '-U',
    'postgres',
    '-d',
    selectedDatabase,
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

describe.skipIf(!container)('deployment transaction against isolated PostgreSQL', () => {
  beforeAll(async () => {
    await psql(`CREATE DATABASE ${database}`, 'postgres')
  })

  afterAll(async () => {
    await psql(`DROP DATABASE ${database}`, 'postgres')
  })

  beforeEach(async () => {
    await psql('DROP TABLE IF EXISTS pageviews')
    // Execute the actual driver's submitted batch on one PostgreSQL connection.
    // A separate test database keeps these tests independent of pageview writes.
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: unknown, options: RequestInit) => {
        const batch: Batch = JSON.parse(String(options.body))
        expect(batch.queries.every(({ params }) => params.length === 0)).toBe(true)
        await psql(`BEGIN;\n${batch.queries.map(({ query }) => query + ';').join('\n')}\nCOMMIT;`)
        return success(batch)
      })
    )
  })

  it('creates a fresh schema and safely replays it without losing counts', async () => {
    await migrateProduction(production, vi.fn())
    await psql("INSERT INTO pageviews (slug, count) VALUES ('autograder-architecture', 42)")
    await migrateProduction(production, vi.fn())
    expect(await psql('SELECT count, write_window_count FROM pageviews')).toBe('42|0')
  })

  it('serializes simultaneous first deployments', async () => {
    await Promise.all(Array.from({ length: 4 }, () => migrateProduction(production, vi.fn())))
    expect(await psql("SELECT count(*) FROM information_schema.columns WHERE table_name = 'pageviews'")).toBe('5')
  }, 15000)

  it('rolls back earlier DDL if a later migration fails', async () => {
    // Force ALTER TABLE to fail after the initial table and index are created.
    await psql(`
      CREATE FUNCTION reject_test_alter() RETURNS event_trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'test migration failure'; END $$;
      CREATE EVENT TRIGGER reject_test_alter ON ddl_command_start
        WHEN TAG IN ('ALTER TABLE') EXECUTE FUNCTION reject_test_alter();
    `)
    try {
      await expect(migrateProduction(production, vi.fn())).rejects.toThrow()
      expect(await psql("SELECT to_regclass('pageviews') IS NULL")).toBe('t')
      expect(await psql("SELECT to_regclass('pageviews_last_seen_idx') IS NULL")).toBe('t')
    } finally {
      await psql('DROP EVENT TRIGGER reject_test_alter; DROP FUNCTION reject_test_alter()')
    }
  })
})

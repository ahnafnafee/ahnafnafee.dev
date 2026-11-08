#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

import { neon } from '@neondatabase/serverless'

// Only these reviewed, idempotent migrations run on deployment. Separate SQL
// statements with an explicit marker rather than parsing semicolons in SQL.
const migrationFiles = ['0001_pageviews.sql', '0002_pageview_write_limits.sql']

class MigrationConfigurationError extends Error {}

/** @param {Record<string, string | undefined>} env */
export async function migrateProduction(env = process.env, log = console.log) {
  if (env.VERCEL !== '1' || !['production', 'preview', 'development'].includes(env.VERCEL_ENV)) {
    throw new MigrationConfigurationError(
      'Vercel system environment variables are required. Use yarn build for local builds.'
    )
  }

  if (env.VERCEL_ENV !== 'production' || (env.VERCEL_TARGET_ENV && env.VERCEL_TARGET_ENV !== 'production')) {
    log('[migrate] Skipping database migrations outside the production deployment.')
    return
  }

  if (!env.DATABASE_URL?.trim()) {
    throw new MigrationConfigurationError('DATABASE_URL is required for a production deployment.')
  }

  // Do not load local env files here: the deployment must use its own secrets.
  const statements = (
    await Promise.all(
      migrationFiles.map(async (file) => {
        const source = await readFile(new URL(`../db/migrations/${file}`, import.meta.url), 'utf8')
        return source.split(/^-- statement-breakpoint\r?$/m).map((statement) => statement.trim())
      })
    )
  ).flat()

  const sql = neon(env.DATABASE_URL)
  log(`[migrate] Applying ${migrationFiles.join(', ')} before the production build.`)
  await sql.transaction(
    (transaction) => [
      transaction.query("SET LOCAL lock_timeout = '5s'"),
      transaction.query("SET LOCAL statement_timeout = '30s'"),
      // Serialize concurrent production builds, including first-time table creation.
      transaction.query("SELECT pg_advisory_xact_lock(hashtext('ahnafnafee.dev'), hashtext('pageview-migrations'))"),
      ...statements.map((statement) => transaction.query(statement))
    ],
    { fetchOptions: { signal: AbortSignal.timeout(60000) } }
  )
  log('[migrate] Pageview migrations committed. Starting the application build.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await migrateProduction()
  } catch (error) {
    // Provider errors can include connection details. Keep secrets out of build logs.
    console.error(
      `[migrate] ${error instanceof MigrationConfigurationError ? error.message : 'Database migration failed.'} Build aborted.`
    )
    process.exitCode = 1
  }
}

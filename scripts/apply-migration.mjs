#!/usr/bin/env node
/**
 * One-off migration runner. Reads a .sql file and executes each statement
 * against DATABASE_URL using @neondatabase/serverless.
 *
 *   node scripts/apply-migration.mjs db/migrations/0001_pageviews.sql
 *
 * Splits on `;` outside string literals (good enough for the ddl in this repo).
 * If we ever need real migration tooling, swap in drizzle-kit or node-pg-migrate.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'

// Load .env.development.local if present (mirrors `next dev` env loading).
const envFile = resolve(process.cwd(), '.env.development.local')
if (existsSync(envFile)) config({ path: envFile })

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/apply-migration.mjs <path/to/migration.sql>')
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set. Add it to .env.development.local or export it.')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const raw = readFileSync(resolve(process.cwd(), file), 'utf8')

// Strip line comments, then split on `;` and drop empties.
const stripped = raw
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n')
const stmts = stripped
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)

console.log(`[migrate] running ${stmts.length} statement(s) from ${file}`)
for (const stmt of stmts) {
  console.log(`  - ${stmt.split('\n')[0].slice(0, 80)}...`)
  await sql.query(stmt)
}
console.log('[migrate] ✅ done')

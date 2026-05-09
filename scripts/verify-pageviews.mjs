#!/usr/bin/env node
import { existsSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'

const envFile = resolve(process.cwd(), '.env.development.local')
if (existsSync(envFile)) config({ path: envFile })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const rows = await sql`SELECT count(*)::int AS n FROM pageviews`
console.log(`[verify] pageviews table exists; rows = ${rows[0].n}`)
const sample = await sql`SELECT slug, count, last_seen_at FROM pageviews LIMIT 5`
if (sample.length === 0) {
  console.log('[verify] (empty — expected before any traffic)')
} else {
  console.table(sample)
}

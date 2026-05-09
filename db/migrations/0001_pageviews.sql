-- Pageview counter, one row per public route slug.
--
-- Schema is intentionally minimal: the counter is incremented on first paint
-- (POST /api/pageviews) and read in batches by listing pages and individually
-- by detail pages.  No history, no per-day rollup — keep cost flat for a free
-- Neon tier.
--
-- Apply via the Neon SQL editor (or psql) once per environment:
--   psql "$DATABASE_URL" -f db/migrations/0001_pageviews.sql

CREATE TABLE IF NOT EXISTS pageviews (
  slug         TEXT PRIMARY KEY,
  count        BIGINT NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on last_seen_at lets a future cleanup job evict slugs that no longer
-- correspond to live routes (e.g. renamed posts).
CREATE INDEX IF NOT EXISTS pageviews_last_seen_idx ON pageviews(last_seen_at);

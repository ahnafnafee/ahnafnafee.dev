# Pageview storage and limits

The public pageview writer accepts only canonical slugs belonging to a published
blog, portfolio or research MDX file. Slugs remain shared across sections, as in
the existing API. Unknown slugs return 404 before obtaining a database client.

Apply both migrations to each database before deploying:

```sh
node scripts/apply-migration.mjs db/migrations/0001_pageviews.sql
node scripts/apply-migration.mjs db/migrations/0002_pageview_write_limits.sql
```

The second migration is idempotent and preserves existing counts. It adds a
window timestamp and counter to each existing pageview row. A single atomic
upsert admits at most 120 increments per slug per 60-second database window.
The row's conflict lock enforces this budget across concurrent server instances.
State grows with published slugs rather than visitor identities or IP addresses.

Exhausted budgets return 429 with `Retry-After: 60`; configured storage/schema
failures return 503. Neither case falls back to unrestricted writes. Without
`DATABASE_URL`, valid requests retain the existing successful zero-count mode.

These counts are approximate public analytics. An abusive visitor can consume
the shared budget and cause legitimate visits to be undercounted. Fixed windows
allow bursts on either side of a boundary. The database limit bounds accepted
updates and persistent row cardinality; hosting-level rate limits are still
needed to bound rejected HTTP requests and database attempts.

## Local database regression tests

Use a disposable PostgreSQL container, never a production database. The test
suite drops and recreates its `pageviews` table. The container does not need
published ports or access to the host network:

```sh
docker run --detach --rm --network none --name site-security-postgres -e POSTGRES_HOST_AUTH_METHOD=trust postgres:17.11
docker exec site-security-postgres pg_isready -U postgres
```

Set `PAGEVIEWS_TEST_POSTGRES_CONTAINER=site-security-postgres` in the current
shell, then run:

```sh
yarn vitest run src/services/pageviews/__tests__/postgres.test.ts
docker stop site-security-postgres
```

Without that variable, the database integration tests are skipped. Ordinary
unit tests still exercise invalid slugs, no-database behavior, exhausted budgets
and storage failures. The PostgreSQL tests execute the actual service query on
separate connections to check migration compatibility, last-slot contention,
window reset and failure before migration.

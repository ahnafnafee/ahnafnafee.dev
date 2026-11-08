# Pageview storage and limits

The public pageview writer accepts only canonical slugs belonging to a published
blog, portfolio or research MDX file. Slugs remain shared across sections, as in
the existing API. Unknown slugs return 404 before obtaining a database client.

## Deployment migrations

Vercel uses `corepack yarn build:vercel`, which runs
`scripts/migrate-production.mjs` before `yarn build`. Production deployments
apply the explicitly listed `0001_pageviews.sql` and
`0002_pageview_write_limits.sql` in one Neon transaction. Both are idempotent,
so rebuilding or retrying a deployment preserves existing counts. The advisory
transaction lock serializes simultaneous production migrations, including
initial table creation. SQL statements within a file use an explicit
`-- statement-breakpoint` delimiter.

Only `VERCEL=1` with `VERCEL_ENV=production` can migrate; a custom
`VERCEL_TARGET_ENV` skips the migration. Preview and development deployments
skip it even when they have access to `DATABASE_URL`. The runner does not load
local environment files. Missing Vercel metadata, a missing production
`DATABASE_URL`, or a database error aborts the build. Keep Vercel's system
environment variables enabled and configure the production database before
deploying. Provider errors are redacted from build logs.

Lock waits are limited to 5 seconds, each statement to 30 seconds, and the HTTP
request to 60 seconds. A database-side error rolls back the transaction. A
network timeout can leave the outcome uncertain; retrying is safe because the
migrations are idempotent. Migrations commit before the application build, so
a later build failure does not roll them back. These additive migrations also
remain compatible with the previous application version.

Ordinary `yarn build`, CI builds and static exports do not run migrations.
For local databases or deployments on other hosts, apply both files manually:

```sh
node scripts/apply-migration.mjs db/migrations/0001_pageviews.sql
node scripts/apply-migration.mjs db/migrations/0002_pageview_write_limits.sql
```

The second migration adds a window timestamp and counter to each existing
pageview row. A single atomic upsert admits at most 120 increments per slug
per 60-second database window.
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
yarn vitest run src/services/pageviews/__tests__/postgres.test.ts tests/deployment-migrations.test.ts
docker stop site-security-postgres
```

Without that variable, the database integration tests are skipped. Ordinary
unit tests still exercise invalid slugs, no-database behavior, exhausted budgets
and storage failures. The PostgreSQL tests execute the actual service query on
separate connections to check migration compatibility, last-slot contention,
window reset and failure before migration. Deployment tests execute the actual
Neon transaction batch in a separate disposable database to check fresh setup,
repeat runs, concurrent migrations and rollback after a later DDL failure.

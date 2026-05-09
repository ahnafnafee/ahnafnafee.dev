# Search-engine indexing pipeline

This template ships with a two-tier indexing system that pings every major
search engine when a new MDX post lands on `main`, plus a weekly catch-up
job that re-submits anything Google missed.

If you fork this repo, follow [Setup](#setup) once and the rest is automatic.

---

## What it does

| Tier | Trigger | Engines | Source script |
|---|---|---|---|
| **On-publish ping** | Push to `main` touching `src/data/{blog,portfolio,research}/*.mdx` | IndexNow (Bing, Yahoo, DuckDuckGo, Yandex, Seznam) + Google + Baidu (optional) | `scripts/notify-search-engines.js` |
| **Weekly catch-up** | Cron, Mondays 06:00 UTC | Google only (with Search Console pre-check) | `indexing/sendIndexingRequest.ts` |

The two tiers are complementary. The on-publish ping is best-effort and
fast; it tells engines "this URL is new, come crawl it." The weekly job
is an audit pass — it scans the live sitemap, asks Search Console which
URLs are unindexed, and re-submits the stragglers within Google's daily
200-URL quota.

---

## Setup

### 1. IndexNow (covers Bing, Yahoo, DuckDuckGo, Yandex)

IndexNow is an open protocol — a single POST to `api.indexnow.org` fans
out to every participating engine. No account or developer registration.

**One-time:**

1. Generate a 32-char hex key (or pick any 8–128 alphanumeric string):
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
2. Save the key as `public/<key>.txt` containing exactly the key string
   on a single line. The committed example uses
   `public/e9d816e728085bf88259a66cffd93444.txt` — replace it with your
   own value before forking.
3. Update the `DEFAULT_KEY` constant in `scripts/indexnow-submit.js` to
   match, **or** set `INDEXNOW_KEY` as a GitHub Actions secret.

**Verify:** after deploying, `https://<your-domain>/<key>.txt` should
return the key string. IndexNow validates ownership against this file.

### 2. Google Indexing API

**One-time:**

1. Google Cloud Console → create a service account.
2. Enable the **Indexing API** and **Search Console API** for the project.
3. Download the service account JSON key.
4. Google Search Console → add the service account email as an
   **Owner** of the site property (without owner permissions, the
   Indexing API rejects with 403).
5. Save the JSON locally as `indexing/service_account.json` (gitignored).
6. Add the same JSON as a GitHub Actions secret named
   `GOOGLE_SERVICE_ACCOUNT_JSON` (paste the entire JSON object as the
   secret value — multi-line `private_key` is fine).

**Note:** Google officially only accepts `JobPosting` and `BroadcastEvent`
URLs via the Indexing API, but other URLs are accepted in practice. The
reliable signal for general pages remains a fresh sitemap + Search Console
verification — the API call is opportunistic.

### 3. Baidu Push (optional, requires CN phone verification)

Skip this section unless you specifically want Chinese-market traffic.
The script skips silently when `BAIDU_PUSH_TOKEN` is unset.

1. Register at https://ziyuan.baidu.com/ (requires a Chinese phone number).
2. Add and verify your site.
3. Copy the Push API token from the link-submit page.
4. Add it as a GitHub Actions secret named `BAIDU_PUSH_TOKEN`.

### 4. Repository secrets summary

| Secret | Required? | Used by |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Recommended | Both workflows |
| `INDEXNOW_KEY` | Optional (script falls back to default) | On-publish workflow |
| `BAIDU_PUSH_TOKEN` | Optional | On-publish workflow |

---

## Workflows

### `.github/workflows/notify-search-engines.yml`

Triggered by:

- **Push to `main`** affecting `src/data/{blog,portfolio,research}/*.mdx`.
  Diffs `HEAD~1..HEAD`, maps each MDX path to its public URL plus the
  parent listing page, waits for the sitemap to be reachable, then pings
  every configured engine in parallel.
- **`workflow_dispatch`** — manual run with two optional inputs:
  - `urls` — space-separated URL list to submit.
  - `sitemap_mode` — `true` to fan out every URL in `sitemap.xml` (use
    sparingly; IndexNow has per-host rate limits).

Failures in Baidu or Google do **not** fail the workflow. Only IndexNow
failure is fatal — that's the load-bearing engine.

### `.github/workflows/google-batch-reindex.yml`

Triggered by:

- **Cron**, Mondays 06:00 UTC. Off-peak so the rest of the day's quota is
  free for the on-publish hook.
- **`workflow_dispatch`** for ad-hoc runs.

Installs `tsx` and `googleapis` on the fly and runs
`indexing/sendIndexingRequest.ts`, which:

1. Fetches `sitemap.xml`.
2. Shuffles and caps at 200 URLs (Google's daily Indexing API quota).
3. For each URL, calls Search Console URL Inspection to skip ones already
   `Indexed` / `SubmittedAndIndexed`.
4. Submits the rest via `urlNotifications.publish` with a 1.5 s delay.

---

## Local usage

| Command | What it does |
|---|---|
| `yarn indexing:notify <url> [url …]` | Submit specific URLs to all configured engines |
| `yarn indexing:indexnow <url> [url …]` | IndexNow only |
| `yarn indexing:google <url> [url …]` | Google only |
| `yarn indexing:baidu <url> [url …]` | Baidu only (requires `BAIDU_PUSH_TOKEN`) |
| `yarn indexing:sitemap` | Submit every URL in `sitemap.xml` to all engines (manual catch-up; rate-limit aware) |
| `npx tsx indexing/sendIndexingRequest.ts` | Run the weekly Google catch-up locally |

`scripts/notify-search-engines.js` also accepts URLs via the
`CHANGED_FILES` env var (newline-separated MDX paths) — used by the CI
diff step.

---

## Manual checklist for a new post

After pushing the MDX file to `main`, the on-publish workflow handles
indexing automatically. The remaining manual steps add high-quality
discovery signals that engines can't infer from a ping:

1. **Google Search Console** → URL Inspection → paste the new URL → "Request indexing." Single most reliable Google signal.
2. **Bing Webmaster Tools** → Submit URL. Bing also receives the IndexNow ping but a manual submission accelerates first-crawl.
3. **Internal linking** — link to the new page from at least one existing high-traffic page (home, listing, related-posts list). Internal links are one of the strongest non-content ranking factors.
4. **External backlinks (legitimate channels only)** — share to communities where engagement is real (academic Twitter, Mastodon, Reddit if the rules allow self-promotion, ORCID, Hugging Face Papers for research, arXiv for preprints). Do not use traffic-generation services or click farms — modern spam systems detect these and the penalty is deindexing.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `[indexnow] ❌ 403` | Key file missing at `https://<host>/<key>.txt` | Verify the file is in `public/`, deploy, retry |
| `[indexnow] ❌ 422` | URL host doesn't match `host` in submission | Check `DEFAULT_HOST` in `scripts/indexnow-submit.js` |
| `[indexnow] ❌ 429` | Rate-limited | Wait an hour; avoid `SITEMAP_MODE=true` runs in quick succession |
| `[google] ❌ 403` on every URL | Service account not an Owner in Search Console, or APIs not enabled | Re-check setup steps 1–4 |
| `[google] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON` | Secret was pasted with surrounding quotes or escaped newlines | Paste the raw JSON object only |
| `[baidu] BAIDU_PUSH_TOKEN not set — skipping` | Expected if you didn't set up Baidu | Ignore unless you want Chinese-market indexing |
| Workflow ran but URLs aren't in Google after a week | Google honored the ping but chose not to index (low quality / duplicate / thin content) | Improve content, internal linking, and request manual indexing in GSC |

---

## What this pipeline does NOT do

- Generate fake clicks, fake backlinks, or simulated engagement. These
  violate every search engine's webmaster guidelines and the modern
  detection penalty is deindexing.
- Replace good content, internal linking, and legitimate community
  engagement. The pipeline accelerates first-crawl; it does not move
  rankings on its own.
- Cover every search engine on Earth. IndexNow + Google + Baidu cover
  >95% of global search traffic. Niche regional engines (Naver, Seznam
  outside the IndexNow network, etc.) need separate integrations.

---

## File map

```
.github/workflows/
  notify-search-engines.yml       # On-publish ping
  google-batch-reindex.yml        # Weekly catch-up
indexing/
  sendIndexingRequest.ts          # Google batch with Search Console pre-check
  service_account.json            # gitignored — Google service account creds
public/
  <key>.txt                       # IndexNow ownership proof
scripts/
  notify-search-engines.js        # Orchestrator
  indexnow-submit.js              # IndexNow client
  google-index-urls.js            # Google client (single-shot)
  baidu-push.js                   # Baidu Push API client
```

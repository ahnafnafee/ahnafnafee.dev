import { SITE_URL } from '@/libs/constants/site'

import type { genOgImagePayload } from 'me'

const TOPIC_CAP = 5
const TOPIC_MAX_CHARS = 24

function sanitizeTopics(topics: ReadonlyArray<string> | undefined): string {
  if (!topics || topics.length === 0) return ''
  // Strip commas (our serialization separator) and surrounding whitespace,
  // truncate each topic, drop empties, cap the array.
  const cleaned = topics
    .map((t) => (t ?? '').replace(/,/g, ' ').trim())
    .filter((t) => t.length > 0)
    .map((t) => (t.length > TOPIC_MAX_CHARS ? t.slice(0, TOPIC_MAX_CHARS) : t))
    .slice(0, TOPIC_CAP)
  return cleaned.join(',')
}

export const generateOgImage = (payload: genOgImagePayload) => {
  // Read NEXT_PUBLIC_SITE_URL at call-time so per-request overrides and tests
  // can stub the host without restarting the module. SITE_URL is the
  // canonical fallback (resolved once at module load).
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE_URL
  // Auto cache-bust per deployment: prefer explicit env, then Vercel commit SHA, then fallback
  const version =
    process.env.NEXT_PUBLIC_OG_VERSION ||
    (process.env.VERCEL_GIT_COMMIT_SHA ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : '5.0')

  const params = new URLSearchParams({ title: payload?.title ?? 'Ahnaf An Nafee', v: version })

  if (payload?.subTitle) params.set('subtitle', payload.subTitle)
  if (payload?.theme) params.set('theme', payload.theme)
  if (payload?.type) params.set('type', payload.type)
  if (payload?.category) params.set('category', payload.category)
  if (payload?.section) params.set('section', payload.section)
  if (payload?.venue) params.set('venue', payload.venue)

  const topicsCsv = sanitizeTopics(payload?.topics)
  if (topicsCsv) params.set('topics', topicsCsv)

  return `${baseUrl}/api/og?${params.toString()}`
}

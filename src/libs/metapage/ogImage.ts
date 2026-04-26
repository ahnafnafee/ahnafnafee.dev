import { SITE_URL } from '@/libs/constants/site'

import type { genOgImagePayload } from 'me'

export const generateOgImage = (payload: genOgImagePayload) => {
  // Read NEXT_PUBLIC_SITE_URL at call-time so per-request overrides and tests
  // can stub the host without restarting the module. SITE_URL is the
  // canonical fallback (resolved once at module load).
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE_URL
  // Auto cache-bust per deployment: prefer explicit env, then Vercel commit SHA, then fallback
  const version =
    process.env.NEXT_PUBLIC_OG_VERSION ||
    (process.env.VERCEL_GIT_COMMIT_SHA ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : '4.1')

  // Use URLSearchParams for proper encoding
  const params = new URLSearchParams({ title: payload?.title ?? 'Ahnaf An Nafee', v: version })

  if (payload?.subTitle) {
    params.set('subtitle', payload.subTitle)
  }

  if (payload?.theme) {
    params.set('theme', payload.theme)
  }

  return `${baseUrl}/api/og?${params.toString()}`
}

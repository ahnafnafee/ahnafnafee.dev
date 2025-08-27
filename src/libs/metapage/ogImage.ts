import type { genOgImagePayload } from 'me'

export const generateOgImage = (payload: genOgImagePayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahnafnafee.dev'
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

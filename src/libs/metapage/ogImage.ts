import type { genOgImagePayload } from 'me'

export const generateOgImage = (payload: genOgImagePayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahnafnafee.dev'
  const title = encodeURIComponent(payload?.title ?? 'Ahnaf An Nafee')
  const subtitle = payload?.subTitle ? encodeURIComponent(payload.subTitle) : ''

  // Version for cache busting - increment this when making changes
  const version = '3.2'

  // Use URLSearchParams for proper encoding
  const params = new URLSearchParams({
    title: payload?.title ?? 'Ahnaf An Nafee',
    v: version
  })

  if (payload?.subTitle) {
    params.set('subtitle', payload.subTitle)
  }

  return `${baseUrl}/api/og?${params.toString()}`
}

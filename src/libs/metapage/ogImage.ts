import type { genOgImagePayload } from 'me'

export const generateOgImage = (payload: genOgImagePayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahnafnafee.dev'
  const title = encodeURIComponent(payload?.title ?? 'Ahnaf An Nafee')
  const subtitle = payload?.subTitle ? encodeURIComponent(payload.subTitle) : ''

  // Version for cache busting - increment this when making changes
  const version = '3.0'

  let url = `${baseUrl}/api/og?title=${title}&v=${version}`
  if (subtitle) {
    url += `&subtitle=${subtitle}`
  }

  return url
}

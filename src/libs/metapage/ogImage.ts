import type { genOgImagePayload } from 'me'

export const generateOgImage = (payload: genOgImagePayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahnafnafee.dev'
  const title = encodeURIComponent(payload?.title ?? 'Ahnaf An Nafee')
  const subtitle = payload?.subTitle ? encodeURIComponent(payload.subTitle) : ''

  let url = `${baseUrl}/api/og?title=${title}`
  if (subtitle) {
    url += `&subtitle=${subtitle}`
  }

  return url
}

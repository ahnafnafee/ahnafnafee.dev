import type { PageView, PageViewResponse } from 'me'
import { NextRequest, NextResponse } from 'next/server'

let token: null | string | false = null

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ message: 'query parameter is required', view: null }, { status: 400 })
  }

  // if (!token && token !== false) {
  //   const newToken = await getToken()
  //   if (!newToken) {
  //     token = false
  //   } else {
  //     token = newToken
  //   }
  // }

  if (token === false) {
    return NextResponse.json({ message: 'Cannot get token', view: null }, { status: 500 })
  }

  let view = 0

  const end_date = new Date()
  const firtsDeployedAppAtMs = 1645722000000

  const config = { headers: { Authorization: 'Bearer ' + token } }

  const articleURL = `/api/website/1/stats?start_at=${firtsDeployedAppAtMs}&end_at=${end_date.getTime()}&url=/article/${slug.toString()}`
  const blogURL = `/api/website/1/stats?start_at=${firtsDeployedAppAtMs}&end_at=${end_date.getTime()}&url=/blog/${slug.toString()}`

  // const settles = await Promise.allSettled([
  //   UMAMI.get<PageView>(articleURL, config),
  //   UMAMI.get<PageView>(blogURL, config)
  // ])

  // settles.forEach((settle) => {
  //   if (settle.status === 'fulfilled') {
  //     const prop = settle.value
  //     view += prop.data.pageviews.value
  //   }
  // })

  return NextResponse.json({ message: 'Retrieved succesfully', view })
}

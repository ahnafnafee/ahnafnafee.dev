import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

import { BANNER_FONT_FAMILY, BANNER_SIZE, Banner, normalizeCommand } from '@/libs/og/banner'

export const runtime = 'edge'

const PROFILE_URL = 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-560,h-560'

const monoRegular = fetch(new URL('./fonts/JetBrainsMono-Regular.ttf', import.meta.url)).then((r) => r.arrayBuffer())
const monoBold = fetch(new URL('./fonts/JetBrainsMono-Bold.ttf', import.meta.url)).then((r) => r.arrayBuffer())
const pixel = fetch(new URL('./fonts/PressStart2P-Regular.ttf', import.meta.url)).then((r) => r.arrayBuffer())

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const raw = searchParams.get('title')?.slice(0, 60) || 'home'
    const command = normalizeCommand(raw)

    const [monoRegularData, monoBoldData, pixelData] = await Promise.all([monoRegular, monoBold, pixel])

    return new ImageResponse(<Banner name={command} profileSrc={PROFILE_URL} />, {
      width: BANNER_SIZE.width,
      height: BANNER_SIZE.height,
      emoji: 'twemoji',
      fonts: [
        { name: BANNER_FONT_FAMILY.mono, data: monoRegularData, weight: 400, style: 'normal' },
        { name: BANNER_FONT_FAMILY.mono, data: monoBoldData, weight: 700, style: 'normal' },
        { name: BANNER_FONT_FAMILY.pixel, data: pixelData, weight: 400, style: 'normal' }
      ]
    })
  } catch (err) {
    console.info(JSON.stringify(err))
    return new Response('Failed to generate the og image', {
      status: 500,
      statusText: 'failed to generate the og image'
    })
  }
}

import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

import { BANNER_FONT_FAMILY, BANNER_SIZE, Banner, normalizeCommand } from '@/libs/og/banner'

export const runtime = 'nodejs'

const PROFILE_URL = 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-560,h-560'

const MONO_REGULAR_PATH = fileURLToPath(new URL('./fonts/JetBrainsMono-Regular.ttf', import.meta.url))
const MONO_BOLD_PATH = fileURLToPath(new URL('./fonts/JetBrainsMono-Bold.ttf', import.meta.url))
const PIXEL_PATH = fileURLToPath(new URL('./fonts/PressStart2P-Regular.ttf', import.meta.url))

const monoRegular = fs.readFile(MONO_REGULAR_PATH)
const monoBold = fs.readFile(MONO_BOLD_PATH)
const pixel = fs.readFile(PIXEL_PATH)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const raw = searchParams.get('title')?.slice(0, 60) || 'home'
    const command = normalizeCommand(raw)

    const [monoRegularData, monoBoldData, pixelData] = await Promise.all([monoRegular, monoBold, pixel])

    const img = new ImageResponse(<Banner name={command} profileSrc={PROFILE_URL} />, {
      width: BANNER_SIZE.width,
      height: BANNER_SIZE.height,
      emoji: 'twemoji',
      fonts: [
        { name: BANNER_FONT_FAMILY.mono, data: monoRegularData, weight: 400, style: 'normal' },
        { name: BANNER_FONT_FAMILY.mono, data: monoBoldData, weight: 700, style: 'normal' },
        { name: BANNER_FONT_FAMILY.pixel, data: pixelData, weight: 400, style: 'normal' }
      ]
    })

    // Buffer the response body — the streaming ImageResponse can land as a
    // 0-byte response under Vercel's Node runtime, so materialize the bytes
    // and return a fresh Response with explicit Content-Type / Cache-Control.
    const body = await img.arrayBuffer()
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (err) {
    console.error('OG render failed:', err instanceof Error ? (err.stack ?? err.message) : err)
    return new Response('Failed to generate the og image', {
      status: 500,
      statusText: 'failed to generate the og image'
    })
  }
}

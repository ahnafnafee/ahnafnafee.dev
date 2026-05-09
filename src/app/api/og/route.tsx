import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

import { OgCard } from '@/libs/og/og-shell'
import { OG_FONT_FAMILY, OG_SIZE, resolvePageType } from '@/libs/og/og-tokens'

import type { OgPageType } from '@/libs/og/og-types'

export const runtime = 'nodejs'

const PROFILE_URL = 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-560,h-560'
// Hard cap on the profile fetch at module-load. Without this, a slow
// ImageKit response would stall every concurrent request for the lifetime
// of the stall (the existing .catch() only handles hard rejections, not
// hung connections).
const PROFILE_FETCH_TIMEOUT_MS = 3000

const MONO_REGULAR_PATH = fileURLToPath(new URL('./fonts/JetBrainsMono-Regular.ttf', import.meta.url))
const MONO_BOLD_PATH = fileURLToPath(new URL('./fonts/JetBrainsMono-Bold.ttf', import.meta.url))

const monoRegular = fs.readFile(MONO_REGULAR_PATH)
const monoBold = fs.readFile(MONO_BOLD_PATH)

function detectMime(bytes: Uint8Array): string {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'image/png'
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg'
  if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'image/gif'
  return 'application/octet-stream'
}

// Pre-fetch the profile photo once per process so cold renders don't pay the
// network round-trip and so an ImageKit hiccup degrades gracefully (the OgCard
// shows an "AN" initials fallback when profileSrc is empty).
const profileDataUrl: Promise<string> = (async () => {
  try {
    const res = await fetch(PROFILE_URL, {
      redirect: 'follow',
      signal: AbortSignal.timeout(PROFILE_FETCH_TIMEOUT_MS)
    })
    if (!res.ok) return ''
    const buf = Buffer.from(await res.arrayBuffer())
    return `data:${detectMime(buf)};base64,${buf.toString('base64')}`
  } catch {
    return ''
  }
})()

function readParam(searchParams: URLSearchParams, key: string, max: number): string | undefined {
  const value = searchParams.get(key)
  if (!value) return undefined
  return value.slice(0, max).trim() || undefined
}

function readTopics(searchParams: URLSearchParams): string[] {
  const raw = searchParams.get('topics')
  if (!raw) return []
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 5)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = readParam(searchParams, 'title', 140) ?? 'Ahnaf An Nafee'
    const subtitle = readParam(searchParams, 'subtitle', 220)
    const category = readParam(searchParams, 'category', 40)
    const section = readParam(searchParams, 'section', 40)
    const venue = readParam(searchParams, 'venue', 80)
    const topics = readTopics(searchParams)
    const type: OgPageType = resolvePageType(searchParams.get('type'))

    const [monoRegularData, monoBoldData, profileSrc] = await Promise.all([monoRegular, monoBold, profileDataUrl])

    // OG_FONT_FAMILY.sans currently aliases to JetBrains Mono (see og-tokens.ts).
    // Registering twice under both names so satori can resolve any
    // sans/mono font-family reference back to the same typeface — keeps the
    // design coherent if/when the alias diverges.
    const fonts: Array<{ name: string; data: ArrayBuffer | Buffer; weight: 400 | 700 | 800; style: 'normal' }> = [
      { name: OG_FONT_FAMILY.sans, data: monoRegularData, weight: 400, style: 'normal' },
      { name: OG_FONT_FAMILY.sans, data: monoBoldData, weight: 700, style: 'normal' },
      { name: OG_FONT_FAMILY.sans, data: monoBoldData, weight: 800, style: 'normal' }
    ]
    if (OG_FONT_FAMILY.mono !== OG_FONT_FAMILY.sans) {
      fonts.push(
        { name: OG_FONT_FAMILY.mono, data: monoRegularData, weight: 400, style: 'normal' },
        { name: OG_FONT_FAMILY.mono, data: monoBoldData, weight: 700, style: 'normal' }
      )
    }

    const img = new ImageResponse(
      (
        <OgCard
          type={type}
          title={title}
          subtitle={subtitle}
          topics={topics}
          category={category}
          section={section}
          venue={venue}
          profileSrc={profileSrc}
        />
      ),
      {
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        emoji: 'twemoji',
        fonts: fonts as never
      }
    )

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

/**
 * Local preview tool for the dynamic OG banner.
 *
 * Renders the same `Banner` component used by /api/og to PNG files on disk,
 * so you can iterate on the design without spinning up the dev server.
 *
 * Usage (from project root):
 *   npx tsx scripts/generate-banner-og.tsx --all
 *   npx tsx scripts/generate-banner-og.tsx blog portfolio
 *   npx tsx scripts/generate-banner-og.tsx <any-custom-name>
 */

import { ImageResponse } from '@vercel/og'
import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'

import { BANNER_FONT_FAMILY, BANNER_SIZE, Banner, normalizeCommand } from '../src/libs/og/banner'

const NAV_COMMANDS = ['home', 'research', 'blog', 'portfolio', 'resume'] as const

const ROOT = process.cwd()
const FONTS_DIR = path.join(ROOT, 'src', 'app', 'api', 'og', 'fonts')
const OUT_DIR = path.join(ROOT, 'scripts', 'og-output')
const CACHE_DIR = path.join(OUT_DIR, '.cache')

const PROFILE_URL = 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-560,h-560'

async function readFont(filename: string): Promise<ArrayBuffer> {
  const buf = await fs.readFile(path.join(FONTS_DIR, filename))
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

function detectMime(buf: Buffer): string {
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'image/png'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg'
  if (buf[0] === 0x47 && buf[1] === 0x49) return 'image/gif'
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'image/webp'
  return 'application/octet-stream'
}

async function loadProfile(): Promise<string> {
  const cachePath = path.join(CACHE_DIR, 'profile.bin')
  try {
    const cached = await fs.readFile(cachePath)
    return `data:${detectMime(cached)};base64,${cached.toString('base64')}`
  } catch {
    const res = await fetch(PROFILE_URL, { redirect: 'follow' })
    if (!res.ok) throw new Error(`profile fetch failed: ${PROFILE_URL} (${res.status})`)
    const buf = Buffer.from(await res.arrayBuffer())
    await fs.mkdir(CACHE_DIR, { recursive: true })
    await fs.writeFile(cachePath, buf)
    return `data:${detectMime(buf)};base64,${buf.toString('base64')}`
  }
}

async function loadAllFonts() {
  const [monoRegular, monoBold, pixel] = await Promise.all([
    readFont('JetBrainsMono-Regular.ttf'),
    readFont('JetBrainsMono-Bold.ttf'),
    readFont('PressStart2P-Regular.ttf')
  ])
  return { monoRegular, monoBold, pixel }
}

async function renderBanner(
  name: string,
  fonts: Awaited<ReturnType<typeof loadAllFonts>>,
  profileSrc: string
): Promise<Buffer> {
  const img = new ImageResponse(<Banner name={normalizeCommand(name)} profileSrc={profileSrc} />, {
    width: BANNER_SIZE.width,
    height: BANNER_SIZE.height,
    emoji: 'twemoji',
    fonts: [
      { name: BANNER_FONT_FAMILY.mono, data: fonts.monoRegular, weight: 400, style: 'normal' },
      { name: BANNER_FONT_FAMILY.mono, data: fonts.monoBold, weight: 700, style: 'normal' },
      { name: BANNER_FONT_FAMILY.pixel, data: fonts.pixel, weight: 400, style: 'normal' }
    ]
  })
  return Buffer.from(await img.arrayBuffer())
}

async function main() {
  const args = process.argv.slice(2)
  const all = args.includes('--all')
  const inputs = all ? [...NAV_COMMANDS] : args.filter((a) => !a.startsWith('--')).map((a) => a.toLowerCase())

  if (inputs.length === 0) {
    console.error('Usage:')
    console.error('  npx tsx scripts/generate-banner-og.tsx --all')
    console.error('  npx tsx scripts/generate-banner-og.tsx <name> [<name> ...]')
    console.error('')
    console.error(`Top-nav names: ${NAV_COMMANDS.join(', ')}`)
    console.error('You can also pass any custom command word.')
    process.exit(1)
  }

  await fs.mkdir(OUT_DIR, { recursive: true })

  console.log('Loading fonts and profile photo (profile cached after first run)...')
  const [fonts, profileSrc] = await Promise.all([loadAllFonts(), loadProfile()])

  for (const name of inputs) {
    process.stdout.write(`  rendering ${name}... `)
    const png = await renderBanner(name, fonts, profileSrc)
    const outPath = path.join(OUT_DIR, `ahnafnafee-${name}.png`)
    await fs.writeFile(outPath, png)
    console.log(`✓ ${path.relative(ROOT, outPath)}`)
  }

  console.log('')
  console.log(`Done. Files in ${path.relative(ROOT, OUT_DIR)}/`)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})

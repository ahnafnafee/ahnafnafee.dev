/* eslint-disable @next/next/no-img-element */
/**
 * Generate banner-style OG images for top-nav pages.
 *
 * Output goes to scripts/og-output/. Upload the PNGs to imagekit
 * (overwriting existing or as new files) and point page metadata at them.
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

const NAV_COMMANDS = ['home', 'research', 'blog', 'portfolio', 'resume'] as const

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'scripts', 'og-output')
const CACHE_DIR = path.join(OUT_DIR, '.cache')

type FontSpec = { name: string; url: string; weight: 400 | 700 }

const FONTS: Record<'monoRegular' | 'monoBold' | 'pixel', FontSpec> = {
  monoRegular: {
    name: 'JetBrainsMono-Regular.ttf',
    url: 'https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Regular.ttf',
    weight: 400
  },
  monoBold: {
    name: 'JetBrainsMono-Bold.ttf',
    url: 'https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Bold.ttf',
    weight: 700
  },
  pixel: {
    name: 'PressStart2P-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf',
    weight: 400
  }
}

const PROFILE_URL = 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-560,h-560'

async function readCached(file: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(file)
  } catch {
    return null
  }
}

async function loadFont(spec: FontSpec): Promise<ArrayBuffer> {
  const cachePath = path.join(CACHE_DIR, spec.name)
  const cached = await readCached(cachePath)
  if (cached) return cached.buffer.slice(cached.byteOffset, cached.byteOffset + cached.byteLength)

  const res = await fetch(spec.url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`font fetch failed: ${spec.url} (${res.status})`)
  const arr = await res.arrayBuffer()
  await fs.mkdir(CACHE_DIR, { recursive: true })
  await fs.writeFile(cachePath, Buffer.from(arr))
  return arr
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
  const cached = await readCached(cachePath)
  if (cached) return `data:${detectMime(cached)};base64,${cached.toString('base64')}`

  const res = await fetch(PROFILE_URL, { redirect: 'follow' })
  if (!res.ok) throw new Error(`profile fetch failed: ${PROFILE_URL} (${res.status})`)
  const arr = await res.arrayBuffer()
  const buf = Buffer.from(arr)
  await fs.mkdir(CACHE_DIR, { recursive: true })
  await fs.writeFile(cachePath, buf)
  return `data:${detectMime(buf)};base64,${buf.toString('base64')}`
}

const COLORS = {
  frame1: '#f9a8d4',
  frame2: '#ec4899',
  bgOuter: '#1a0820',
  bgInner: '#3b1247',
  termGreen: '#22c55e',
  termCyan: '#22d3ee',
  termGray: '#9ca3af',
  termWhite: '#f5f5f5',
  termBlue: '#60a5fa',
  accent: '#c084fc'
}

function Prompt({ command }: { command: string }) {
  return (
    <div style={{ display: 'flex', fontSize: 26, fontFamily: 'JetBrains Mono', whiteSpace: 'pre' }}>
      <span style={{ color: COLORS.termGreen, fontWeight: 700 }}>ahnafnafee</span>
      <span style={{ color: COLORS.termGray }}>@</span>
      <span style={{ color: COLORS.termCyan, fontWeight: 700 }}>ahnafnafee.dev</span>
      <span style={{ color: COLORS.termWhite }}>:~ </span>
      <span style={{ color: COLORS.termWhite, fontWeight: 700 }}>{command}</span>
    </div>
  )
}

function SocialLine({ n, label, value }: { n: number; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, marginBottom: 4 }}>
      <span style={{ color: COLORS.termBlue, fontWeight: 700, width: 38, display: 'flex' }}>{n}.</span>
      <span style={{ color: COLORS.termBlue, fontWeight: 700, width: 150, display: 'flex' }}>{label}</span>
      <span style={{ color: COLORS.termGray, marginRight: 12 }}>-</span>
      <span style={{ color: COLORS.termWhite }}>{value}</span>
    </div>
  )
}

function Banner({ name, profileSrc }: { name: string; profileSrc: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundImage: `linear-gradient(135deg, ${COLORS.frame1} 0%, ${COLORS.frame2} 50%, ${COLORS.frame1} 100%)`,
        padding: 20
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          backgroundImage: `radial-gradient(circle at 30% 30%, ${COLORS.bgInner} 0%, ${COLORS.bgOuter} 70%)`,
          padding: '54px 64px',
          fontFamily: 'JetBrains Mono'
        }}
      >
        {/* Left column: terminal text */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Prompt command={name} />

          <div
            style={{
              display: 'flex',
              color: COLORS.termWhite,
              fontFamily: 'Press Start 2P',
              fontSize: 44,
              margin: '28px 0 16px',
              letterSpacing: 2,
              whiteSpace: 'nowrap',
              textShadow: `4px 4px 0 ${COLORS.frame2}`
            }}
          >
            AHNAF AN NAFEE
          </div>

          <div style={{ color: COLORS.termGray, fontSize: 22, marginTop: 16 }}>--</div>
          <div style={{ color: COLORS.termWhite, fontSize: 22, fontWeight: 700, marginTop: 4 }}>
            The project is open-source 🎉
          </div>
          <div style={{ color: COLORS.termGray, fontSize: 22, marginTop: 4, marginBottom: 28 }}>--</div>

          <Prompt command='socials' />

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18 }}>
            <SocialLine n={1} label='Email' value='ahnafnafee@gmail.com' />
            <SocialLine n={2} label='GitHub' value='https://github.com/ahnafnafee' />
            <SocialLine n={3} label='LinkedIn' value='https://linkedin.com/in/ahnafnafee' />
          </div>
        </div>

        {/* Right column: profile photo */}
        <div
          style={{
            width: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 24
          }}
        >
          <img
            src={profileSrc}
            width={280}
            height={280}
            alt=''
            style={{
              borderRadius: '50%',
              border: `4px solid ${COLORS.termWhite}`,
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </div>
  )
}

async function loadAllFonts() {
  const [monoRegular, monoBold, pixel] = await Promise.all([
    loadFont(FONTS.monoRegular),
    loadFont(FONTS.monoBold),
    loadFont(FONTS.pixel)
  ])
  return { monoRegular, monoBold, pixel }
}

async function renderBanner(
  name: string,
  fonts: Awaited<ReturnType<typeof loadAllFonts>>,
  profileSrc: string
): Promise<Buffer> {
  const img = new ImageResponse(<Banner name={name} profileSrc={profileSrc} />, {
    width: 1200,
    height: 630,
    emoji: 'twemoji',
    fonts: [
      { name: 'JetBrains Mono', data: fonts.monoRegular, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: fonts.monoBold, weight: 700, style: 'normal' },
      { name: 'Press Start 2P', data: fonts.pixel, weight: 400, style: 'normal' }
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

  console.log('Loading fonts and profile photo (cached after first run)...')
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
  console.log('Upload them to imagekit to take effect.')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})

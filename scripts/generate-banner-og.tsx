/**
 * Local preview tool for the dynamic OG card.
 *
 * Renders the same `<OgCard>` used by /api/og to PNG files on disk so you can
 * iterate on the design without spinning up the dev server.
 *
 * Usage (from project root):
 *   npx tsx scripts/generate-banner-og.tsx --all
 *   npx tsx scripts/generate-banner-og.tsx home blog-post research-post
 *
 * Output: scripts/og-output/<scenario>.png
 *
 * The Inter Variable WOFF2 (public/fonts/inter-var-latin.woff2) is loaded if
 * available. JetBrains Mono is loaded from src/app/api/og/fonts/ unconditionally
 * as the fallback monospace face.
 */

import { ImageResponse } from '@vercel/og'
import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'

import { OgCard } from '../src/libs/og/og-shell'
import { OG_FONT_FAMILY, OG_SIZE } from '../src/libs/og/og-tokens'

import type { OgCardProps, OgPageType } from '../src/libs/og/og-types'

const ROOT = process.cwd()
const FONTS_DIR = path.join(ROOT, 'src', 'app', 'api', 'og', 'fonts')
const OUT_DIR = path.join(ROOT, 'scripts', 'og-output')
const CACHE_DIR = path.join(OUT_DIR, '.cache')

const PROFILE_URL = 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-560,h-560'

type Scenario = {
  name: string
  props: Omit<OgCardProps, 'profileSrc'>
}

const SCENARIOS: Scenario[] = [
  {
    name: 'home',
    props: {
      type: 'home',
      title: 'Ahnaf An Nafee',
      subtitle: 'PhD Student exploring AI for 3D content creation and immersive experiences'
    }
  },
  {
    name: 'blog-list',
    props: {
      type: 'blog',
      title: 'Blog',
      subtitle: 'Notes on AI, 3D graphics, machine learning, and software engineering'
    }
  },
  {
    name: 'blog-post-short',
    props: {
      type: 'blog-post',
      title: 'Why Wireframes Still Matter',
      subtitle: 'A short defence of low-poly aesthetics in modern UI design.',
      topics: ['Graphics', 'Design', 'Aesthetics']
    }
  },
  {
    name: 'blog-post-medium',
    props: {
      type: 'blog-post',
      title: 'Scaling Education: A Strategy Pattern Approach to Grading',
      subtitle: 'Deep dive into building a scalable autograder using Python, Java, and the Strategy Pattern.',
      topics: ['Education Technology', 'Software Architecture', 'Python', 'Java', 'Automation']
    }
  },
  {
    name: 'portfolio-list',
    props: {
      type: 'portfolio',
      title: 'Portfolio',
      subtitle: 'Selected projects across software, games, and graphics'
    }
  },
  {
    name: 'portfolio-post',
    props: {
      type: 'portfolio-post',
      title: 'Bookworm',
      subtitle: 'A mobile-targeted website where book lovers can search and store books.',
      topics: ['react', 'next.js', 'typescript', 'tailwindcss', 'supabase'],
      category: 'software'
    }
  },
  {
    name: 'research-list',
    props: {
      type: 'research',
      title: 'Research',
      subtitle: 'Papers and projects at the intersection of AI and 3D computer graphics'
    }
  },
  {
    name: 'research-post-long',
    props: {
      type: 'research-post',
      title: 'Performance Analysis of 3D Mesh Simplification Algorithms: QEM vs. Vertex Clustering',
      subtitle: 'A 2×2×2 factorial study comparing Quadric Error Metrics and Vertex Clustering on CAD and organic models.',
      topics: ['3D Graphics', 'Mesh Simplification', 'Statistical Analysis'],
      category: 'graphics',
      section: 'others',
      venue: 'GMU CS700 · 2025'
    }
  },
  {
    name: 'research-post-short',
    props: {
      type: 'research-post',
      title: 'Neural Mesh Compression',
      subtitle: 'A learned codec for triangle meshes.',
      topics: ['3D Graphics', 'ML', 'Compression'],
      category: 'graphics',
      venue: 'arXiv preprint · 2026'
    }
  },
  {
    name: 'resume',
    props: {
      type: 'resume',
      title: 'Resume',
      subtitle: 'PhD student in AI & 3D Graphics @ GMU · Ex-CTO'
    }
  },
  {
    name: 'page-fallback',
    props: {
      type: 'page',
      title: 'Security Policy',
      subtitle: 'Responsible Disclosure Guidelines'
    }
  }
]

function detectMime(buf: Buffer): string {
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'image/png'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg'
  if (buf[0] === 0x47 && buf[1] === 0x49) return 'image/gif'
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'image/webp'
  return 'application/octet-stream'
}

async function readBufferAB(filePath: string): Promise<ArrayBuffer> {
  const buf = await fs.readFile(filePath)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

async function loadFonts() {
  const [monoRegular, monoBold] = await Promise.all([
    readBufferAB(path.join(FONTS_DIR, 'JetBrainsMono-Regular.ttf')),
    readBufferAB(path.join(FONTS_DIR, 'JetBrainsMono-Bold.ttf'))
  ])
  return { monoRegular, monoBold }
}

async function loadProfile(): Promise<string> {
  const cachePath = path.join(CACHE_DIR, 'profile.bin')
  try {
    const cached = await fs.readFile(cachePath)
    return `data:${detectMime(cached)};base64,${cached.toString('base64')}`
  } catch {
    const res = await fetch(PROFILE_URL, { redirect: 'follow' })
    if (!res.ok) {
      console.warn(`profile fetch failed (${res.status}); rendering with initials fallback`)
      return ''
    }
    const buf = Buffer.from(await res.arrayBuffer())
    await fs.mkdir(CACHE_DIR, { recursive: true })
    await fs.writeFile(cachePath, buf)
    return `data:${detectMime(buf)};base64,${buf.toString('base64')}`
  }
}

type LoadedFonts = Awaited<ReturnType<typeof loadFonts>>

async function renderScenario(scenario: Scenario, fonts: LoadedFonts, profileSrc: string): Promise<Buffer> {
  const fontConfig: Array<{
    name: string
    data: ArrayBuffer
    weight: 400 | 700 | 800
    style: 'normal'
  }> = [
    { name: OG_FONT_FAMILY.sans, data: fonts.monoRegular, weight: 400, style: 'normal' },
    { name: OG_FONT_FAMILY.sans, data: fonts.monoBold, weight: 700, style: 'normal' },
    { name: OG_FONT_FAMILY.sans, data: fonts.monoBold, weight: 800, style: 'normal' }
  ]
  if (OG_FONT_FAMILY.mono !== OG_FONT_FAMILY.sans) {
    fontConfig.push(
      { name: OG_FONT_FAMILY.mono, data: fonts.monoRegular, weight: 400, style: 'normal' },
      { name: OG_FONT_FAMILY.mono, data: fonts.monoBold, weight: 700, style: 'normal' }
    )
  }

  const img = new ImageResponse(<OgCard {...scenario.props} profileSrc={profileSrc} />, {
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    emoji: 'twemoji',
    fonts: fontConfig as never
  })

  return Buffer.from(await img.arrayBuffer())
}

async function main() {
  const args = process.argv.slice(2)
  const all = args.includes('--all') || args.length === 0
  const wanted = all
    ? SCENARIOS
    : SCENARIOS.filter((s) => args.includes(s.name) || args.includes(s.props.type as OgPageType))

  if (wanted.length === 0) {
    console.error('Usage:')
    console.error('  npx tsx scripts/generate-banner-og.tsx              # renders all')
    console.error('  npx tsx scripts/generate-banner-og.tsx --all')
    console.error('  npx tsx scripts/generate-banner-og.tsx home blog-post-short research-post-long')
    console.error('')
    console.error(`Available scenarios: ${SCENARIOS.map((s) => s.name).join(', ')}`)
    process.exit(1)
  }

  await fs.mkdir(OUT_DIR, { recursive: true })

  console.log('Loading fonts and profile photo (profile cached after first run)...')
  const [fonts, profileSrc] = await Promise.all([loadFonts(), loadProfile()])
  if (!profileSrc) {
    console.warn('  profile photo unavailable — rendering "AN" initials fallback')
  }

  for (const scenario of wanted) {
    process.stdout.write(`  rendering ${scenario.name}... `)
    try {
      const png = await renderScenario(scenario, fonts, profileSrc)
      const outPath = path.join(OUT_DIR, `${scenario.name}.png`)
      await fs.writeFile(outPath, png)
      console.log(`✓ ${path.relative(ROOT, outPath)} (${(png.byteLength / 1024).toFixed(1)} KB)`)
    } catch (err) {
      console.log(`✗ FAILED`)
      console.error(err instanceof Error ? (err.stack ?? err.message) : err)
    }
  }

  console.log('')
  console.log(`Done. Files in ${path.relative(ROOT, OUT_DIR)}/`)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})

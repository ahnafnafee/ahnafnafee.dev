// Per-page-type accent tokens + shared layout constants for the OG card.
// Centralized here so the shell, mesh, and typography modules all read from
// one source of truth. Server-only.

// server-only

import type { OgAccent, OgPageType } from './og-types'

export const OG_SIZE = { width: 1200, height: 630 } as const

// Satori in @vercel/og@0.8.5 / next/og can't parse WOFF2 fonts, so we ship
// JetBrains Mono as the single typeface and use it for both display ("sans"
// slot) and tabular ("mono" slot). It's a clean modern monospace that reads
// well at large sizes and lands a coherent technical/research aesthetic.
// Future work: bundle Inter TTF and re-introduce the editorial-sans split.
export const OG_FONT_FAMILY = {
  sans: 'JetBrains Mono',
  mono: 'JetBrains Mono'
} as const

export const OG_BG = '#0b0d12'
export const OG_FG = '#f5f7fa'
export const OG_FG_MUTED = '#94a3b8'
export const OG_AUTHOR_LINE = 'Ahnaf An Nafee'
export const OG_AUTHOR_ROLE = 'PhD · AI & 3D Graphics · DCXR Lab @ GMU'
export const OG_DOMAIN = 'ahnafnafee.dev'

// Multi-line printout rendered on the home OG card in place of a flat
// subtitle. Each line reads as `> {label} · {value}` in a monospace
// stack — encodes role / focus / lab in a scannable terminal-style block.
export const HOME_PROMPT_LINES: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'role', value: 'PhD Student' },
  { label: 'focus', value: 'AI × 3D Graphics' },
  { label: 'lab', value: 'DCXR Lab @ GMU' }
] as const

const HOME_ACCENT: OgAccent = {
  mesh: '#a855f7',
  titleStops: ['#3b82f6', '#a855f7', '#ec4899'],
  rule: '#a855f7',
  chipBg: '#a855f7',
  chipFg: '#ffffff',
  topicBg: 'rgba(168, 85, 247, 0.16)',
  topicFg: '#e9d5ff'
}

const BLOG_ACCENT: OgAccent = {
  mesh: '#f43f5e',
  titleStops: ['#f59e0b', '#f43f5e'],
  rule: '#f43f5e',
  chipBg: '#f43f5e',
  chipFg: '#ffffff',
  topicBg: 'rgba(244, 63, 94, 0.16)',
  topicFg: '#fecdd3'
}

const PORTFOLIO_ACCENT: OgAccent = {
  mesh: '#14b8a6',
  titleStops: ['#10b981', '#14b8a6'],
  rule: '#14b8a6',
  chipBg: '#10b981',
  chipFg: '#ffffff',
  topicBg: 'rgba(20, 184, 166, 0.18)',
  topicFg: '#99f6e4'
}

const RESEARCH_ACCENT: OgAccent = {
  mesh: '#8b5cf6',
  titleStops: ['#6366f1', '#8b5cf6'],
  rule: '#8b5cf6',
  chipBg: '#6366f1',
  chipFg: '#ffffff',
  topicBg: 'rgba(139, 92, 246, 0.18)',
  topicFg: '#ddd6fe'
}

const FALLBACK_ACCENT: OgAccent = {
  mesh: '#64748b',
  titleStops: ['#94a3b8', '#cbd5e1'],
  rule: '#64748b',
  chipBg: '#475569',
  chipFg: '#f1f5f9',
  topicBg: 'rgba(100, 116, 139, 0.22)',
  topicFg: '#cbd5e1'
}

export const OG_ACCENTS: Record<OgPageType, OgAccent> = {
  home: HOME_ACCENT,
  blog: BLOG_ACCENT,
  'blog-post': BLOG_ACCENT,
  portfolio: PORTFOLIO_ACCENT,
  'portfolio-post': PORTFOLIO_ACCENT,
  research: RESEARCH_ACCENT,
  'research-post': RESEARCH_ACCENT,
  resume: FALLBACK_ACCENT,
  page: FALLBACK_ACCENT
}

// Empty string suppresses the chip — used for `page` so we don't double-print
// the domain (the domain appears in the top-left corner already).
export const OG_TYPE_LABEL: Record<OgPageType, string> = {
  home: 'HOME',
  blog: 'BLOG',
  'blog-post': 'BLOG',
  portfolio: 'PORTFOLIO',
  'portfolio-post': 'PORTFOLIO',
  research: 'RESEARCH',
  'research-post': 'RESEARCH',
  resume: 'RESUME',
  page: ''
}

export function resolvePageType(value: string | null | undefined): OgPageType {
  if (!value) return 'page'
  switch (value) {
    case 'home':
    case 'blog':
    case 'blog-post':
    case 'portfolio':
    case 'portfolio-post':
    case 'research':
    case 'research-post':
    case 'resume':
    case 'page':
      return value
    default:
      return 'page'
  }
}

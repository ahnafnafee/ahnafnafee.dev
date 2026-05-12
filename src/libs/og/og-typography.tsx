// Typography primitives for the OG card. All components are designed to render
// inside satori (next/og) — every multi-child container has `display: 'flex'`
// because satori enforces that rule on every node with >1 child.

// server-only

import React from 'react'

import { OG_FG, OG_FG_MUTED, OG_FONT_FAMILY } from './og-tokens'

import type { OgAccent } from './og-types'

// Title sizing via empirical length buckets.
//
// Earlier iterations computed chars-per-line from `fontSize * 0.6` (raw
// monospace advance). That underestimated word-wrap losses for long titles —
// the picker thought 110 chars fit in 4 lines at 60px, but they actually
// wrapped to 5 lines and the last one was clipped. These buckets are tuned
// against the empirical wrap of JetBrains Mono Bold at 1056px content width,
// with each `maxLen` chosen so the rendered title stays inside the ~270px
// center-band budget on article cards (subtitle dropped).
type TitleSize = { fontSize: number; lineHeight: number }

// Center-band budget is ~286px (1200×630 canvas minus 60+56 padding, 32
// top-chip row, and the 148px avatar cap). Each bucket caps `maxLen` so the
// rendered title + rule + (optional topics row) stays inside that budget.
// Long titles (50px tier) trigger og-shell.tsx to drop the topics row,
// which buys the title the full center band.
const TITLE_BUCKETS: ReadonlyArray<{ maxLen: number; size: TitleSize }> = [
  { maxLen: 18, size: { fontSize: 92, lineHeight: 1.04 } },
  { maxLen: 32, size: { fontSize: 80, lineHeight: 1.06 } },
  { maxLen: 50, size: { fontSize: 70, lineHeight: 1.08 } },
  { maxLen: 78, size: { fontSize: 60, lineHeight: 1.1 } },
  { maxLen: 130, size: { fontSize: 50, lineHeight: 1.16 } }
]

// The title-length threshold at which og-shell hides the topics row to give
// the 50px tier the full center band. Tied to the 50px bucket's lower bound
// (matches TITLE_BUCKETS[3].maxLen).
export const TITLE_HIDE_TOPICS_THRESHOLD = 78

function chooseTitleSize(textLength: number): { size: TitleSize; capChars: number } {
  for (const bucket of TITLE_BUCKETS) {
    if (textLength <= bucket.maxLen) return { size: bucket.size, capChars: bucket.maxLen }
  }
  // Anything beyond the last bucket renders at the smallest size with hard
  // truncation so it still fits cleanly.
  const last = TITLE_BUCKETS[TITLE_BUCKETS.length - 1]
  return { size: last.size, capChars: last.maxLen }
}

function clampToCap(text: string, capChars: number): string {
  if (text.length <= capChars) return text
  return text.slice(0, Math.max(0, capChars - 1)).trimEnd() + '…'
}

export function GradientTitle({ children, accent }: { children: string; accent: OgAccent }) {
  const raw = children ?? ''
  const { size, capChars } = chooseTitleSize(raw.length)
  const display = clampToCap(raw, capChars)
  const stops = accent.titleStops.join(', ')

  return (
    <div
      style={{
        display: 'flex',
        fontFamily: OG_FONT_FAMILY.sans,
        fontSize: size.fontSize,
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight: size.lineHeight,
        backgroundImage: `linear-gradient(135deg, ${stops})`,
        backgroundClip: 'text',
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        maxWidth: '100%'
      }}
    >
      {display}
    </div>
  )
}

export function Subtitle({ children }: { children: string }) {
  const text = children.length > 140 ? children.slice(0, 138).trimEnd() + '…' : children
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: OG_FONT_FAMILY.sans,
        fontSize: 24,
        fontWeight: 400,
        lineHeight: 1.35,
        color: OG_FG_MUTED,
        maxWidth: '92%'
      }}
    >
      {text}
    </div>
  )
}

export function TypeChip({ accent, label }: { accent: OgAccent; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 32,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: accent.chipBg,
        color: accent.chipFg,
        fontFamily: OG_FONT_FAMILY.sans,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.18em',
        borderRadius: 999
      }}
    >
      {label}
    </div>
  )
}

export function TopicChip({ accent, children }: { accent: OgAccent; children: string }) {
  const text = children.length > 28 ? children.slice(0, 26) + '…' : children
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 30,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: accent.topicBg,
        color: accent.topicFg,
        fontFamily: OG_FONT_FAMILY.sans,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.04em',
        borderRadius: 6
      }}
    >
      {text}
    </div>
  )
}

export function MetaText({ children, color }: { children: string; color?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: OG_FONT_FAMILY.mono,
        fontSize: 16,
        color: color ?? OG_FG_MUTED,
        letterSpacing: '0.02em'
      }}
    >
      {children}
    </div>
  )
}

export function AuthorLine({ children }: { children: string }) {
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: OG_FONT_FAMILY.sans,
        fontSize: 22,
        fontWeight: 700,
        color: OG_FG,
        letterSpacing: '-0.005em'
      }}
    >
      {children}
    </div>
  )
}

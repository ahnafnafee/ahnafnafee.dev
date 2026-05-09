// Typography primitives for the OG card. All components are designed to render
// inside satori (next/og) — every multi-child container has `display: 'flex'`
// because satori enforces that rule on every node with >1 child.

// server-only

import React from 'react'

import { OG_FG, OG_FG_MUTED, OG_FONT_FAMILY } from './og-tokens'

import type { OgAccent } from './og-types'

const TITLE_MAX_CHARS = 110
const TITLE_ELLIPSIS_AT = 108

type TitleSize = { fontSize: number; lineHeight: number }

function pickTitleSize(length: number): TitleSize {
  if (length <= 24) return { fontSize: 78, lineHeight: 1.04 }
  if (length <= 38) return { fontSize: 66, lineHeight: 1.06 }
  if (length <= 56) return { fontSize: 54, lineHeight: 1.1 }
  if (length <= 80) return { fontSize: 44, lineHeight: 1.14 }
  return { fontSize: 38, lineHeight: 1.16 }
}

function clampTitle(text: string): string {
  if (text.length <= TITLE_MAX_CHARS) return text
  return text.slice(0, TITLE_ELLIPSIS_AT).trimEnd() + '…'
}

export function GradientTitle({ children, accent }: { children: string; accent: OgAccent }) {
  const display = clampTitle(children)
  const { fontSize, lineHeight } = pickTitleSize(display.length)
  const stops = accent.titleStops.join(', ')

  return (
    <div
      style={{
        display: 'flex',
        fontFamily: OG_FONT_FAMILY.sans,
        fontSize,
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight,
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
  const text = children.length > 180 ? children.slice(0, 178).trimEnd() + '…' : children
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

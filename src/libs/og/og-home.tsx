/* eslint-disable @next/next/no-img-element */
// Home-only OG card variant. Inherits the dark mesh canvas + JetBrains Mono
// grammar from the shared shell, but layers in terminal-style decorations:
// a shell-prompt suffix on the domain, a multi-line `> field · value`
// printout in place of the subtitle, a secondary mirrored mesh in the
// bottom-right, a soft radial glow behind the title, and corner brackets.
// Server-only.

// server-only

import React from 'react'

import { MeshBackdrop } from './og-mesh'
import {
  HOME_PROMPT_LINES,
  OG_ACCENTS,
  OG_AUTHOR_LINE,
  OG_AUTHOR_ROLE,
  OG_BG,
  OG_DOMAIN,
  OG_FG,
  OG_FG_MUTED,
  OG_FONT_FAMILY,
  OG_SIZE,
  OG_TYPE_LABEL
} from './og-tokens'
import { AuthorLine, GradientTitle, MetaText, TopicChip, TypeChip } from './og-typography'

import type { OgAccent, OgCardProps } from './og-types'

// Primary mesh: same placement as the generic shell so the home card still
// reads as part of the same family. Slightly higher opacity than the shared
// shell (0.24 vs 0.20) — the home card is the brand hero and can afford the
// extra visual weight.
const PRIMARY_MESH = {
  width: 820,
  height: 684,
  top: -90,
  left: -140,
  opacity: 0.24
}

// Secondary mesh: smaller, mirrored, peeks out behind the avatar. The
// 180° rotation reuses the same precomputed edges but gives the corner a
// distinct silhouette so the canvas doesn't read as "one mesh + empty
// bottom-right".
const SECONDARY_MESH = {
  width: 520,
  height: 434,
  bottom: -110,
  right: -160,
  opacity: 0.13
}

const HOME_TOPIC_CAP = 4

const BRACKET_COLOR = 'rgba(168, 85, 247, 0.45)'

function Avatar({ src, accent }: { src: string; accent: OgAccent }) {
  if (!src) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 148,
          height: 148,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent.titleStops.join(', ')})`,
          color: '#ffffff',
          fontFamily: OG_FONT_FAMILY.sans,
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          border: `4px solid ${OG_BG}`,
          boxShadow: `0 0 0 2px ${accent.rule}`
        }}
      >
        AN
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        width: 148,
        height: 148,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `4px solid ${OG_BG}`,
        boxShadow: `0 0 0 2px ${accent.rule}`
      }}
    >
      <img
        src={src}
        width={148}
        height={148}
        alt=''
        style={{
          width: 148,
          height: 148,
          objectFit: 'cover',
          borderRadius: '50%'
        }}
      />
    </div>
  )
}

function PromptLine({ accent, label, value }: { accent: OgAccent; label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: OG_FONT_FAMILY.mono,
        fontSize: 20,
        lineHeight: 1.4,
        letterSpacing: '0.01em'
      }}
    >
      <div
        style={{
          display: 'flex',
          color: accent.rule,
          fontWeight: 700,
          marginRight: 14,
          width: 14
        }}
      >
        {'>'}
      </div>
      <div
        style={{
          display: 'flex',
          color: OG_FG_MUTED,
          width: 84,
          marginRight: 8
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          color: accent.rule,
          marginRight: 14,
          fontWeight: 700
        }}
      >
        ·
      </div>
      <div style={{ display: 'flex', color: OG_FG, fontWeight: 500 }}>{value}</div>
    </div>
  )
}

function CornerBracket({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const stroke = `2px solid ${BRACKET_COLOR}`
  const size = 22
  const inset = 30
  const positional: React.CSSProperties =
    corner === 'tl'
      ? { top: inset, left: inset, borderTop: stroke, borderLeft: stroke }
      : corner === 'tr'
        ? { top: inset, right: inset, borderTop: stroke, borderRight: stroke }
        : corner === 'bl'
          ? { bottom: inset, left: inset, borderBottom: stroke, borderLeft: stroke }
          : { bottom: inset, right: inset, borderBottom: stroke, borderRight: stroke }
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        display: 'flex',
        ...positional
      }}
    />
  )
}

export function HomeOgCard(props: OgCardProps) {
  const accent = OG_ACCENTS.home
  const typeLabel = OG_TYPE_LABEL.home
  const topics = (props.topics ?? []).filter((t) => t && t.trim().length > 0).slice(0, HOME_TOPIC_CAP)

  return (
    <div
      style={{
        position: 'relative',
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: 'flex',
        backgroundColor: OG_BG,
        fontFamily: OG_FONT_FAMILY.sans,
        color: OG_FG
      }}
    >
      {/* Primary mesh (top-left) */}
      <div
        style={{
          position: 'absolute',
          top: PRIMARY_MESH.top,
          left: PRIMARY_MESH.left,
          width: PRIMARY_MESH.width,
          height: PRIMARY_MESH.height,
          display: 'flex',
          opacity: PRIMARY_MESH.opacity
        }}
      >
        <MeshBackdrop accent={accent} width={PRIMARY_MESH.width} height={PRIMARY_MESH.height} />
      </div>

      {/* Secondary mesh (bottom-right, mirrored) */}
      <div
        style={{
          position: 'absolute',
          bottom: SECONDARY_MESH.bottom,
          right: SECONDARY_MESH.right,
          width: SECONDARY_MESH.width,
          height: SECONDARY_MESH.height,
          display: 'flex',
          opacity: SECONDARY_MESH.opacity,
          transform: 'rotate(180deg)'
        }}
      >
        <MeshBackdrop accent={accent} width={SECONDARY_MESH.width} height={SECONDARY_MESH.height} />
      </div>

      {/* Subtle radial vignette so the bottom-right is darker behind the avatar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          display: 'flex',
          backgroundImage: `radial-gradient(circle at 100% 100%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)`
        }}
      />

      {/* Radial glow behind the title block (brand purple) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          display: 'flex',
          backgroundImage: `radial-gradient(ellipse 640px 320px at 30% 46%, rgba(168, 85, 247, 0.28) 0%, rgba(168, 85, 247, 0) 70%)`
        }}
      />

      {/* Corner brackets — viewfinder frame */}
      <CornerBracket corner='tl' />
      <CornerBracket corner='tr' />
      <CornerBracket corner='bl' />
      <CornerBracket corner='br' />

      {/* Content layer */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 72px 56px 72px'
        }}
      >
        {/* Top bar: domain + shell-prompt suffix on left, [HOME] chip on right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MetaText>{OG_DOMAIN}</MetaText>
            <div
              style={{
                display: 'flex',
                marginLeft: 10,
                fontFamily: OG_FONT_FAMILY.mono,
                fontSize: 16,
                color: accent.rule,
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              ~ %
            </div>
          </div>
          {typeLabel ? <TypeChip accent={accent} label={typeLabel} /> : <div style={{ display: 'flex' }} />}
        </div>

        {/* Center: title + rule + printout + chips */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            paddingTop: 24,
            paddingBottom: 24
          }}
        >
          <GradientTitle accent={accent}>{props.title}</GradientTitle>

          <div
            style={{
              display: 'flex',
              height: 4,
              width: 96,
              backgroundColor: accent.rule,
              marginTop: 14,
              marginBottom: 18,
              borderRadius: 2
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
          >
            {HOME_PROMPT_LINES.map((line) => (
              <PromptLine key={line.label} accent={accent} label={line.label} value={line.value} />
            ))}
          </div>

          {topics.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: 20
              }}
            >
              {topics.map((topic) => (
                <TopicChip key={topic} accent={accent}>
                  {topic}
                </TopicChip>
              ))}
            </div>
          ) : null}
        </div>

        {/* Bottom: author bar + avatar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 760
            }}
          >
            <AuthorLine>{OG_AUTHOR_LINE}</AuthorLine>
            <div
              style={{
                display: 'flex',
                fontFamily: OG_FONT_FAMILY.sans,
                fontSize: 16,
                color: OG_FG_MUTED,
                marginTop: 4,
                letterSpacing: '0.01em'
              }}
            >
              {OG_AUTHOR_ROLE}
            </div>
          </div>
          <Avatar src={props.profileSrc} accent={accent} />
        </div>
      </div>
    </div>
  )
}

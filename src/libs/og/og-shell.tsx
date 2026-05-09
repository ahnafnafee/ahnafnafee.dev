/* eslint-disable @next/next/no-img-element */
// Main OG card composition. Layered: dark canvas → faded wireframe mesh →
// content (top bar, title block, bottom bar). Server-only.

// server-only

import React from 'react'

import { MeshBackdrop } from './og-mesh'
import {
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
import { AuthorLine, GradientTitle, MetaText, Subtitle, TopicChip, TypeChip } from './og-typography'

import type { OgAccent, OgCardProps } from './og-types'

const MESH_LAYOUT = {
  width: 820,
  height: 684,
  top: -90,
  left: -140,
  opacity: 0.2
}

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

function VenueLine({ accent, venue }: { accent: OgAccent; venue: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 8,
        fontFamily: OG_FONT_FAMILY.mono,
        fontSize: 15,
        color: accent.topicFg,
        letterSpacing: '0.03em'
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 6,
          height: 6,
          backgroundColor: accent.rule,
          borderRadius: '50%',
          marginRight: 10
        }}
      />
      {venue}
    </div>
  )
}

export function OgCard(props: OgCardProps) {
  const accent = OG_ACCENTS[props.type]
  const typeLabel = OG_TYPE_LABEL[props.type]
  const topics = (props.topics ?? []).slice(0, 5).filter((t) => t && t.trim().length > 0)

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
      {/* Wireframe mesh layer */}
      <div
        style={{
          position: 'absolute',
          top: MESH_LAYOUT.top,
          left: MESH_LAYOUT.left,
          width: MESH_LAYOUT.width,
          height: MESH_LAYOUT.height,
          display: 'flex',
          opacity: MESH_LAYOUT.opacity
        }}
      >
        <MeshBackdrop accent={accent} width={MESH_LAYOUT.width} height={MESH_LAYOUT.height} />
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
        {/* Top bar: domain + page-type chip (chip suppressed when label is empty) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <MetaText>{OG_DOMAIN}</MetaText>
          {typeLabel ? <TypeChip accent={accent} label={typeLabel} /> : <div style={{ display: 'flex' }} />}
        </div>

        {/* Center: title + rule + subtitle + topics */}
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
              marginTop: 22,
              marginBottom: props.subtitle ? 22 : 18,
              borderRadius: 2
            }}
          />

          {props.subtitle ? <Subtitle>{props.subtitle}</Subtitle> : null}

          {topics.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: props.subtitle ? 22 : 8
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
            {props.venue ? <VenueLine accent={accent} venue={props.venue} /> : null}
          </div>
          <Avatar src={props.profileSrc} accent={accent} />
        </div>
      </div>
    </div>
  )
}

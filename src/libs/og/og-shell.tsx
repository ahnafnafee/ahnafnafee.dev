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
import { AuthorLine, GradientTitle, MetaText, Subtitle, TITLE_HIDE_TOPICS_THRESHOLD, TopicChip, TypeChip } from './og-typography'

import type { OgAccent, OgCardProps, OgPageType } from './og-types'

const MESH_LAYOUT = {
  width: 820,
  height: 684,
  top: -90,
  left: -140,
  opacity: 0.2
}

// Article (*-post) cards are intentionally minimal — title is hero, no
// summary paragraph, fewer topic chips. Listing / index pages keep the
// summary because their titles are short and the canvas would feel empty.
const ARTICLE_TOPIC_CAP = 3
const LISTING_TOPIC_CAP = 5

function isArticleType(type: OgPageType): boolean {
  return type === 'blog-post' || type === 'portfolio-post' || type === 'research-post'
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
  const isArticle = isArticleType(props.type)
  const topicCap = isArticle ? ARTICLE_TOPIC_CAP : LISTING_TOPIC_CAP
  // Drop topics on article cards whose title falls into the 50px (long-tail)
  // bucket — the title alone fills the center band at that tier, and a
  // topics row would push the last title line off-canvas.
  const titleIsLongTier = isArticle && (props.title?.length ?? 0) > TITLE_HIDE_TOPICS_THRESHOLD
  const topics = titleIsLongTier
    ? []
    : (props.topics ?? []).filter((t) => t && t.trim().length > 0).slice(0, topicCap)
  // Article cards drop the subtitle entirely — at OG scan distance, a
  // 200-char abstract paragraph is unreadable and just steals space from
  // the title (which is the actual hook). The <meta name="description">
  // still carries the full summary for SEO consumers.
  const showSubtitle = !isArticle && Boolean(props.subtitle)

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
              marginTop: 24,
              marginBottom: showSubtitle ? 22 : 26,
              borderRadius: 2
            }}
          />

          {showSubtitle ? <Subtitle>{props.subtitle!}</Subtitle> : null}

          {topics.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: showSubtitle ? 22 : 0
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

/* eslint-disable @next/next/no-img-element */
import React from 'react'

export const BANNER_COLORS = {
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

export const BANNER_SIZE = { width: 1200, height: 630 } as const

export const BANNER_FONT_FAMILY = {
  mono: 'JetBrains Mono',
  pixel: 'Press Start 2P'
} as const

export function normalizeCommand(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, '-')
}

function Prompt({ command }: { command: string }) {
  return (
    <div
      style={{
        display: 'flex',
        fontSize: 26,
        fontFamily: BANNER_FONT_FAMILY.mono,
        whiteSpace: 'pre'
      }}
    >
      <span style={{ color: BANNER_COLORS.termGreen, fontWeight: 700 }}>ahnafnafee</span>
      <span style={{ color: BANNER_COLORS.termGray }}>@</span>
      <span style={{ color: BANNER_COLORS.termCyan, fontWeight: 700 }}>ahnafnafee.dev</span>
      <span style={{ color: BANNER_COLORS.termWhite }}>:~ </span>
      <span style={{ color: BANNER_COLORS.termWhite, fontWeight: 700 }}>{command}</span>
    </div>
  )
}

function SocialLine({ n, label, value }: { n: number; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', fontFamily: BANNER_FONT_FAMILY.mono, fontSize: 22, marginBottom: 4 }}>
      <span style={{ color: BANNER_COLORS.termBlue, fontWeight: 700, width: 38, display: 'flex' }}>{n}.</span>
      <span style={{ color: BANNER_COLORS.termBlue, fontWeight: 700, width: 150, display: 'flex' }}>{label}</span>
      <span style={{ color: BANNER_COLORS.termGray, marginRight: 12 }}>-</span>
      <span style={{ color: BANNER_COLORS.termWhite }}>{value}</span>
    </div>
  )
}

export function Banner({ name, profileSrc }: { name: string; profileSrc: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundImage: `linear-gradient(135deg, ${BANNER_COLORS.frame1} 0%, ${BANNER_COLORS.frame2} 50%, ${BANNER_COLORS.frame1} 100%)`,
        padding: 20
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          backgroundImage: `radial-gradient(circle at 30% 30%, ${BANNER_COLORS.bgInner} 0%, ${BANNER_COLORS.bgOuter} 70%)`,
          padding: '54px 64px',
          fontFamily: BANNER_FONT_FAMILY.mono
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Prompt command={name} />

          <div
            style={{
              display: 'flex',
              color: BANNER_COLORS.termWhite,
              fontFamily: BANNER_FONT_FAMILY.pixel,
              fontSize: 44,
              margin: '28px 0 16px',
              letterSpacing: 2,
              whiteSpace: 'nowrap',
              textShadow: `4px 4px 0 ${BANNER_COLORS.frame2}`
            }}
          >
            AHNAF AN NAFEE
          </div>

          <div style={{ color: BANNER_COLORS.termGray, fontSize: 22, marginTop: 16 }}>--</div>
          <div style={{ color: BANNER_COLORS.termWhite, fontSize: 22, fontWeight: 700, marginTop: 4 }}>
            The project is open-source 🎉
          </div>
          <div style={{ color: BANNER_COLORS.termGray, fontSize: 22, marginTop: 4, marginBottom: 28 }}>--</div>

          <Prompt command='socials' />

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18 }}>
            <SocialLine n={1} label='Email' value='ahnafnafee@gmail.com' />
            <SocialLine n={2} label='GitHub' value='https://github.com/ahnafnafee' />
            <SocialLine n={3} label='LinkedIn' value='https://linkedin.com/in/ahnafnafee' />
          </div>
        </div>

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
              border: `4px solid ${BANNER_COLORS.termWhite}`,
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </div>
  )
}

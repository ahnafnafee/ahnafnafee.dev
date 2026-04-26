import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { generateOgImage } from '../ogImage'

describe('generateOgImage', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.unstubAllEnvs()
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.NEXT_PUBLIC_OG_VERSION
    delete process.env.VERCEL_GIT_COMMIT_SHA
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('returns a URL pointing to /api/og on the canonical site by default', () => {
    const url = generateOgImage({ title: 'Hello' })
    expect(url.startsWith('https://www.ahnafnafee.dev/api/og?')).toBe(true)
  })

  it('honors NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
    const url = generateOgImage({ title: 'Hello' })
    expect(url.startsWith('http://localhost:3000/api/og?')).toBe(true)
  })

  it('encodes the title query string safely', () => {
    const url = generateOgImage({ title: 'Path: A/B and "quotes"' })
    const params = new URL(url).searchParams
    expect(params.get('title')).toBe('Path: A/B and "quotes"')
  })

  it('emits subtitle and theme params when provided', () => {
    const url = generateOgImage({ title: 'Hello', subTitle: 'World', theme: 'dark' })
    const params = new URL(url).searchParams
    expect(params.get('subtitle')).toBe('World')
    expect(params.get('theme')).toBe('dark')
  })

  it('omits subtitle and theme params when not provided', () => {
    const url = generateOgImage({ title: 'Hello' })
    const params = new URL(url).searchParams
    expect(params.has('subtitle')).toBe(false)
    expect(params.has('theme')).toBe(false)
  })

  it('uses VERCEL_GIT_COMMIT_SHA short hash for cache-busting on Vercel', () => {
    process.env.VERCEL_GIT_COMMIT_SHA = 'abcdef1234567890'
    const url = generateOgImage({ title: 'Hello' })
    expect(new URL(url).searchParams.get('v')).toBe('abcdef1')
  })

  it('NEXT_PUBLIC_OG_VERSION takes precedence over commit sha', () => {
    process.env.VERCEL_GIT_COMMIT_SHA = 'abcdef1234567890'
    process.env.NEXT_PUBLIC_OG_VERSION = 'custom'
    const url = generateOgImage({ title: 'Hello' })
    expect(new URL(url).searchParams.get('v')).toBe('custom')
  })

  it('falls back to a default title when payload is empty-ish', () => {
    const url = generateOgImage({} as any)
    const params = new URL(url).searchParams
    expect(params.get('title')).toBe('Ahnaf An Nafee')
  })
})

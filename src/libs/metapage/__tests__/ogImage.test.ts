import { generateOgImage } from '../ogImage'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

  it('emits a type param when provided', () => {
    const url = generateOgImage({ title: 'Hello', type: 'research-post' })
    expect(new URL(url).searchParams.get('type')).toBe('research-post')
  })

  it('serializes a topics array as a comma-separated query value', () => {
    const url = generateOgImage({ title: 'Hello', topics: ['A', 'B', 'C'] })
    expect(new URL(url).searchParams.get('topics')).toBe('A,B,C')
  })

  it('round-trips category, section, and venue', () => {
    const url = generateOgImage({
      title: 'Hello',
      category: 'graphics',
      section: 'top-tier',
      venue: 'GMU CS700 · 2025'
    })
    const params = new URL(url).searchParams
    expect(params.get('category')).toBe('graphics')
    expect(params.get('section')).toBe('top-tier')
    expect(params.get('venue')).toBe('GMU CS700 · 2025')
  })

  it('caps the topics array at 5 entries', () => {
    const url = generateOgImage({ title: 'Hello', topics: ['t1', 't2', 't3', 't4', 't5', 't6', 't7'] })
    expect(new URL(url).searchParams.get('topics')).toBe('t1,t2,t3,t4,t5')
  })

  it('strips commas inside topic strings to keep the csv shape', () => {
    const url = generateOgImage({ title: 'Hello', topics: ['A, B', 'C'] })
    expect(new URL(url).searchParams.get('topics')).toBe('A  B,C')
  })

  it('omits new params when not provided (backwards-compat regression guard)', () => {
    const url = generateOgImage({ title: 'Hello' })
    const params = new URL(url).searchParams
    expect(params.has('type')).toBe(false)
    expect(params.has('topics')).toBe(false)
    expect(params.has('category')).toBe(false)
    expect(params.has('section')).toBe(false)
    expect(params.has('venue')).toBe(false)
  })
})

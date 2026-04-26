import { describe, expect, it } from 'vitest'
import type { Blog } from 'me'
import { getAdjacentPosts } from '../getAdjacentPosts'

const make = (slug: string, published: string, title = slug): { header: Blog } => ({
  header: {
    title,
    slug,
    summary: '',
    featured: false,
    author_name: 'a',
    github_username: 'g',
    published,
    topics: [],
    keywords: [],
    related: []
  }
})

describe('getAdjacentPosts', () => {
  // Sorted newest-first: c (2024), b (2022), a (2020)
  const posts = [
    make('a', '01/01/2020'),
    make('b', '01/01/2022'),
    make('c', '01/01/2024')
  ]

  it('returns prev (older) and next (newer) for a middle post', () => {
    const { prev, next } = getAdjacentPosts('b', posts)
    expect(prev?.slug).toBe('a')
    expect(next?.slug).toBe('c')
  })

  it('returns null next for the newest post', () => {
    const { prev, next } = getAdjacentPosts('c', posts)
    expect(prev?.slug).toBe('b')
    expect(next).toBeNull()
  })

  it('returns null prev for the oldest post', () => {
    const { prev, next } = getAdjacentPosts('a', posts)
    expect(prev).toBeNull()
    expect(next?.slug).toBe('b')
  })

  it('returns both null when slug is not in the list', () => {
    const { prev, next } = getAdjacentPosts('missing', posts)
    expect(prev).toBeNull()
    expect(next).toBeNull()
  })

  it('returns both null for an empty list', () => {
    const { prev, next } = getAdjacentPosts('a', [])
    expect(prev).toBeNull()
    expect(next).toBeNull()
  })

  it('only emits slug + title (no leak of other Blog fields)', () => {
    const { prev } = getAdjacentPosts('b', posts)
    expect(prev).toEqual({ slug: 'a', title: 'a' })
  })
})

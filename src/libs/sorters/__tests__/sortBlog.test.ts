import { getMostPopularBlog, getNewestBlog } from '../sortBlog'

import type { Blog } from 'me'
import { describe, expect, it } from 'vitest'

const mk = (overrides: Partial<Blog>): Blog => ({
  title: 't',
  slug: 's',
  summary: '',
  featured: false,
  author_name: 'a',
  github_username: 'g',
  published: '01/01/2020',
  topics: [],
  keywords: [],
  related: [],
  ...overrides
})

describe('getNewestBlog', () => {
  it('puts newer dates first when used as a sort comparator', () => {
    const posts = [
      mk({ slug: 'old', published: '01/01/2020' }),
      mk({ slug: 'new', published: '06/01/2024' }),
      mk({ slug: 'mid', published: '03/01/2022' })
    ]
    posts.sort(getNewestBlog)
    expect(posts.map((p) => p.slug)).toEqual(['new', 'mid', 'old'])
  })

  it('returns 0 for equal dates (stable order)', () => {
    const a = mk({ slug: 'a', published: '01/01/2024' })
    const b = mk({ slug: 'b', published: '01/01/2024' })
    expect(getNewestBlog(a, b)).toBe(0)
  })

  it('returns -1 when first arg is newer, 1 when second is newer', () => {
    const newer = mk({ published: '06/01/2024' })
    const older = mk({ published: '01/01/2020' })
    expect(getNewestBlog(newer, older)).toBe(-1)
    expect(getNewestBlog(older, newer)).toBe(1)
  })
})

describe('getMostPopularBlog', () => {
  it('puts higher view counts first', () => {
    const posts = [mk({ slug: 'low', views: 10 }), mk({ slug: 'high', views: 1000 }), mk({ slug: 'mid', views: 100 })]
    posts.sort(getMostPopularBlog)
    expect(posts.map((p) => p.slug)).toEqual(['high', 'mid', 'low'])
  })

  it('treats two zero-view posts as equal (returns 0)', () => {
    const a = mk({ views: 0 })
    const b = mk({ views: 0 })
    expect(getMostPopularBlog(a, b)).toBe(0)
  })
})

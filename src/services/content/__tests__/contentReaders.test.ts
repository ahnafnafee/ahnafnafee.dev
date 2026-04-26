import { describe, expect, it } from 'vitest'
import { getContentBySlug, getContents } from '../index'
import type { Blog, Portfolio } from 'me'

// Integration tests — read actual MDX files from src/data/. They depend on
// at least one entry existing in each section, which is true for the live
// site (committed content). If the repo is ever scaffolded fresh, these
// would need fixture files.

  it('returns every blog post with parsed frontmatter and content', async () => {
    const posts = await getContents<Blog>('/blog')
    expect(posts.length).toBeGreaterThan(0)
    for (const post of posts) {
      expect(post.header.slug).toBeTruthy()
      expect(post.header.title).toBeTruthy()
      expect(post.header.summary).toBeTruthy()
      expect(post.header.published).toBeTruthy()
      expect(typeof post.content).toBe('string')
    }
  })

  it('returns every portfolio entry with parsed frontmatter', async () => {
    const items = await getContents<Portfolio>('/portfolio')
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(item.header.slug).toBeTruthy()
      expect(item.header.title).toBeTruthy()
      expect(item.header.date).toBeTruthy()
      expect(Array.isArray(item.header.stack)).toBe(true)
    }
  })

  it('derives the slug from the filename, not from frontmatter', async () => {
    const posts = await getContents<Blog>('/blog')
    for (const post of posts) {
      // slug should be a clean kebab-cased filename (no .mdx, no spaces)
      expect(post.header.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })
})

describe('getContentBySlug', () => {
  it('resolves a known blog slug', async () => {
    // autograder-architecture is one of the committed posts
    const post = await getContentBySlug<Blog>('/blog', 'autograder-architecture')
    expect(post.header.slug).toBe('autograder-architecture')
    expect(post.header.title).toContain('Strategy Pattern')
    expect(post.content.length).toBeGreaterThan(100)
  })

  it('resolves a known portfolio slug', async () => {
    const item = await getContentBySlug<Portfolio>('/portfolio', 'bookworm')
    expect(item.header.slug).toBe('bookworm')
    expect(item.header.stack).toContain('react')
  })

  it('throws when the slug does not exist', async () => {
    await expect(
      getContentBySlug<Blog>('/blog', 'this-post-does-not-exist-and-never-will')
    ).rejects.toThrow()
  })

  it('content is just the markdown body — frontmatter is stripped', async () => {
    const post = await getContentBySlug<Blog>('/blog', 'autograder-architecture')
    // The body should not start with the YAML fence
    expect(post.content.trimStart().startsWith('---')).toBe(false)
  })
})

import { getNewestBlog } from './sortBlog'

import type { Blog } from 'me'

export type AdjacentPosts = {
  prev: Pick<Blog, 'slug' | 'title'> | null
  next: Pick<Blog, 'slug' | 'title'> | null
}

// Given the current slug and the full blog list, return the previous (older) and next (newer) post
// for site navigation. Newer posts come first in the sort, so prev = i+1, next = i-1.
export function getAdjacentPosts(currentSlug: string, posts: Array<{ header: Blog }>): AdjacentPosts {
  const sorted = [...posts].sort((a, b) => getNewestBlog(a.header, b.header))
  const i = sorted.findIndex((p) => p.header.slug === currentSlug)
  if (i === -1) return { prev: null, next: null }

  const next = i > 0 ? sorted[i - 1].header : null
  const prev = i < sorted.length - 1 ? sorted[i + 1].header : null

  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null
  }
}

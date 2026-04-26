import type { Research } from 'me'

/**
 * Sort research entries newest-first by `published` (MM/DD/YYYY or ISO).
 * Mirrors getNewestBlog so the listing/featured-on-home rhythms match.
 */
export const getNewestResearch = (a: Research, b: Research) => {
  return new Date(a.published) < new Date(b.published) ? 1 : new Date(a.published) > new Date(b.published) ? -1 : 0
}

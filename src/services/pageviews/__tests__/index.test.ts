import {
  getView,
  getViewsBatch,
  incrementView,
  InvalidPageviewSlugError,
  PageviewRateLimitError,
  PageviewUnavailableError
} from '../index'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the Neon client BEFORE importing the module under test so the singleton
// in src/services/db/neon.ts picks up the stub. The mock returns whatever the
// per-test `sqlSpy` was configured to resolve with.
const { sqlSpy, getSqlSpy } = vi.hoisted(() => ({ sqlSpy: vi.fn(), getSqlSpy: vi.fn() }))
vi.mock('@/services/db/neon', () => ({
  getSql: getSqlSpy
}))

describe('pageviews service', () => {
  beforeEach(() => {
    sqlSpy.mockReset()
    getSqlSpy.mockReset().mockReturnValue(sqlSpy)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getViewsBatch', () => {
    it('returns an empty record for an empty input without hitting the DB', async () => {
      const result = await getViewsBatch([])
      expect(result).toEqual({})
      expect(sqlSpy).not.toHaveBeenCalled()
    })

    it('zero-fills missing slugs and merges DB rows in', async () => {
      sqlSpy.mockResolvedValueOnce([
        { slug: 'a', count: 10 },
        { slug: 'c', count: '999' } // count can come back as string from pg
      ])
      const result = await getViewsBatch(['a', 'b', 'c'])
      expect(result).toEqual({ a: 10, b: 0, c: 999 })
    })

    it('returns zero-filled record on DB error', async () => {
      sqlSpy.mockRejectedValueOnce(new Error('boom'))
      const result = await getViewsBatch(['a', 'b'])
      expect(result).toEqual({ a: 0, b: 0 })
    })
  })

  describe('getView', () => {
    it('returns 0 when no row exists', async () => {
      sqlSpy.mockResolvedValueOnce([])
      expect(await getView('missing')).toBe(0)
    })

    it('coerces string counts to number', async () => {
      sqlSpy.mockResolvedValueOnce([{ count: '42' }])
      expect(await getView('cool-post')).toBe(42)
    })
  })

  describe('incrementView', () => {
    it('returns the new count from the RETURNING clause', async () => {
      sqlSpy.mockResolvedValueOnce([{ count: 7 }])
      expect(await incrementView('autograder-architecture')).toBe(7)
    })

    it.each(['not-a-published-post', '../blog/autograder-architecture', 'a'.repeat(129)])(
      'rejects unknown or invalid slug %j before obtaining the database client',
      async (slug) => {
        await expect(incrementView(slug)).rejects.toBeInstanceOf(InvalidPageviewSlugError)
        expect(getSqlSpy).not.toHaveBeenCalled()
        expect(sqlSpy).not.toHaveBeenCalled()
      }
    )

    it('preserves the zero-count mode without database configuration', async () => {
      getSqlSpy.mockReturnValue(null)
      expect(await incrementView('autograder-architecture')).toBe(0)
      expect(sqlSpy).not.toHaveBeenCalled()
    })

    it('reports an exhausted database write budget', async () => {
      sqlSpy.mockResolvedValueOnce([])
      await expect(incrementView('autograder-architecture')).rejects.toBeInstanceOf(PageviewRateLimitError)
      expect(sqlSpy).toHaveBeenCalledTimes(1)
    })

    it('fails closed on a configured database error without retrying an unrestricted write', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      sqlSpy.mockRejectedValueOnce(new Error('missing window columns'))
      await expect(incrementView('autograder-architecture')).rejects.toBeInstanceOf(PageviewUnavailableError)
      expect(sqlSpy).toHaveBeenCalledTimes(1)
    })
  })
})

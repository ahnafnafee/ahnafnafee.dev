import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the Neon client BEFORE importing the module under test so the singleton
// in src/services/db/neon.ts picks up the stub. The mock returns whatever the
// per-test `sqlSpy` was configured to resolve with.
const sqlSpy = vi.fn()
vi.mock('@/services/db/neon', () => ({
  getSql: () => sqlSpy
}))

import { getView, getViewsBatch, incrementView } from '../index'

describe('pageviews service', () => {
  beforeEach(() => {
    sqlSpy.mockReset()
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
      expect(await incrementView('cool-post')).toBe(7)
    })
  })
})

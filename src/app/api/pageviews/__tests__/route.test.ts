import { getView, incrementView, InvalidPageviewSlugError, PageviewRateLimitError } from '@/services/pageviews'

import { GET, POST } from '../route'

import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/pageviews', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/pageviews')>()),
  getView: vi.fn(),
  incrementView: vi.fn()
}))

const request = () =>
  new NextRequest('https://example.test/api/pageviews?slug=autograder-architecture', { method: 'POST' })

beforeEach(() => vi.resetAllMocks())

describe('pageview responses', () => {
  it('keeps read requests read-only', async () => {
    vi.mocked(getView).mockResolvedValue(9)
    const response = await GET(request())
    expect(await response.json()).toEqual({ message: 'Retrieved successfully', view: 9 })
    expect(incrementView).not.toHaveBeenCalled()
  })

  it.each([0, 9])('returns an uncached successful count of %i', async (view) => {
    vi.mocked(incrementView).mockResolvedValue(view)
    const response = await POST(request())
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect((await response.json()).view).toBe(view)
  })

  it('rejects missing slugs without attempting a write', async () => {
    const response = await POST(new NextRequest('https://example.test/api/pageviews'))
    expect(response.status).toBe(400)
    expect(incrementView).not.toHaveBeenCalled()
  })

  it('returns 404 for unpublished slugs', async () => {
    vi.mocked(incrementView).mockRejectedValue(new InvalidPageviewSlugError())
    expect((await POST(request())).status).toBe(404)
  })

  it('returns an uncached 429 and retry interval when the shared budget is exhausted', async () => {
    vi.mocked(incrementView).mockRejectedValue(new PageviewRateLimitError())
    const response = await POST(request())
    expect(response.status).toBe(429)
    expect(response.headers.get('retry-after')).toBe('60')
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect((await response.json()).view).toBeNull()
  })

  it('returns 503 without exposing database errors', async () => {
    vi.mocked(incrementView).mockRejectedValue(new Error('private database diagnostics'))
    const response = await POST(request())
    expect(response.status).toBe(503)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.text()).not.toContain('private database diagnostics')
  })
})

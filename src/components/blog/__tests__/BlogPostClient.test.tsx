import { BlogPostClient } from '../BlogPostClient'

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import type { Blog } from 'me'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/content', () => ({ PRButton: () => null }))
vi.mock('@/components/content/blog', () => ({
  GiscusComment: () => null,
  HeadingContent: ({ postViews }: { postViews: number }) => <span data-testid='views'>{postViews}</span>
}))
vi.mock('@/components/content/mdx', () => ({ ContentImageZoom: () => null }))

const header = { slug: 'autograder-architecture' } as Blog
const response = (status: number, view: number | null) => ({ ok: status === 200, json: async () => ({ view }) })

beforeEach(() => sessionStorage.clear())
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('blog pageview writes', () => {
  it.each([429, 503])('reads the existing count after a rejected %i write without marking it seen', async (status) => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response(status, null)).mockResolvedValueOnce(response(200, 73))
    vi.stubGlobal('fetch', fetchMock)
    render(<BlogPostClient header={header}>Post content</BlogPostClient>)
    await waitFor(() => expect(screen.getByTestId('views').textContent).toBe('73'))
    expect(fetchMock.mock.calls[0][1]).toEqual({ method: 'POST' })
    expect(fetchMock.mock.calls[1]).toEqual(['/api/pageviews?slug=autograder-architecture'])
    expect(sessionStorage.getItem('pv-seen-autograder-architecture')).toBeNull()
  })

  it('marks only a successful increment as counted', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200, 74))
    vi.stubGlobal('fetch', fetchMock)
    render(<BlogPostClient header={header}>Post content</BlogPostClient>)
    await waitFor(() => expect(screen.getByTestId('views').textContent).toBe('74'))
    expect(sessionStorage.getItem('pv-seen-autograder-architecture')).toBe('1')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

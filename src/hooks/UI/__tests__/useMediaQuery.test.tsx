import { useMediaQuery } from '../useMediaQuery'

import { act, cleanup, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('useMediaQuery', () => {
  it('reads current matches, follows changes and replaces subscriptions when the query changes', () => {
    const listeners = new Map<string, Set<() => void>>()
    const matches = new Map([
      ['(min-width: 768px)', true],
      ['(prefers-reduced-motion)', false]
    ])
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
      const subscribers = listeners.get(query) ?? new Set<() => void>()
      listeners.set(query, subscribers)
      return {
        get matches() {
          return matches.get(query) ?? false
        },
        media: query,
        addEventListener: (_event: string, listener: () => void) => subscribers.add(listener),
        removeEventListener: (_event: string, listener: () => void) => subscribers.delete(listener)
      } as unknown as MediaQueryList
    })
    const { result, rerender, unmount } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' }
    })
    expect(result.current).toBe(true)
    act(() => {
      matches.set('(min-width: 768px)', false)
      listeners.get('(min-width: 768px)')!.forEach((listener) => listener())
    })
    expect(result.current).toBe(false)
    rerender({ query: '(prefers-reduced-motion)' })
    expect(listeners.get('(min-width: 768px)')!.size).toBe(0)
    act(() => {
      matches.set('(prefers-reduced-motion)', true)
      listeners.get('(prefers-reduced-motion)')!.forEach((listener) => listener())
    })
    expect(result.current).toBe(true)
    unmount()
    expect(listeners.get('(prefers-reduced-motion)')!.size).toBe(0)
  })

  it('keeps the server snapshot false without reading a browser media query', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia')
    function ServerView() {
      return createElement('span', null, String(useMediaQuery('(min-width: 768px)')))
    }
    expect(renderToString(createElement(ServerView))).toBe('<span>false</span>')
    expect(matchMedia).not.toHaveBeenCalled()
  })
})

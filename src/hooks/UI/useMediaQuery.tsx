import { useCallback, useSyncExternalStore } from 'react'

/**
 *
 * @param query - a string of media query.
 * @example ```tsx
 * const isMedium = useMediaQuery('(min-width: 768px)')
 * ```
 * @returns `true` or `false`
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)
      return () => mediaQuery.removeEventListener('change', onChange)
    },
    [query]
  )
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

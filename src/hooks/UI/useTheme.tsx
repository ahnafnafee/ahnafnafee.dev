import { useTheme as useNextTheme } from 'next-themes'
import { useCallback, useState, useSyncExternalStore } from 'react'

// Standard hydration-detection escape hatch: the server snapshot is `false`,
// the client snapshot is `true`. After hydration, React swaps them and the
// component re-renders with `mounted = true` — without ever calling setState
// inside a useEffect (which the new react-hooks/set-state-in-effect rule flags).
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useNextTheme()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [dropdownIsOpen, setDropdown] = useState<boolean>(false)

  const toggleDropdown = useCallback(() => setDropdown((prev) => (prev ? false : true)), [])
  const closeDropdown = useCallback(() => setDropdown(false), [])

  const changeTheme = useCallback(
    (value: string) => {
      return () => {
        setTheme(value)
        closeDropdown()
      }
    },
    [setTheme, closeDropdown]
  )

  return {
    mounted,
    changeTheme,
    theme,
    systemTheme,
    dropdownIsOpen,
    toggleDropdown,
    closeDropdown
  }
}

'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { useTheme } from '@/hooks'

import { Moon, Sun } from 'lucide-react'

const tintClasses =
  'bg-primary-100 text-primary-700 hover:bg-primary-100/80 hover:text-primary-700 dark:bg-theme-700 dark:text-white dark:hover:bg-theme-700/80 dark:hover:text-white'

export const ThemeMenu: React.FunctionComponent = () => {
  const { theme, systemTheme, changeTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' aria-label='Switch theme' className={tintClasses} disabled>
        <Spinner />
      </Button>
    )
  }

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Toggle Dark Mode'
      className={tintClasses}
      onClick={changeTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}

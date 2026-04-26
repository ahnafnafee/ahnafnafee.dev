'use client'

import { UnstyledLink } from '@/UI/links'

import APP_ROUTE from '@/libs/constants/route'
import { twclsx } from '@/libs/twclsx'

import { usePathname } from 'next/navigation'

/**
 * A Nav componet that renders a list of links to the routes defined in the `src/libs/constant.ts`
 */
export const Nav: React.FunctionComponent = () => {
  const pathname = usePathname()

  return (
    <nav className={twclsx('flex items-center gap-1', '-ml-3 md:-ml-3.5')}>
      {APP_ROUTE.map((route) => (
        <UnstyledLink
          title={`route ${route.name}`}
          key={route.name}
          href={route.path}
          className={twclsx(
            'relative inline-flex items-center justify-center text-sm md:text-base',
            'border-2 border-transparent px-3 py-1 font-semibold transition md:px-3.5 md:py-1.5',
            'hover:border-primary-600 dark:hover:border-primary-500',
            route.path === pathname
              ? 'text-primary-700 dark:text-primary-400 border-primary-600 dark:border-primary-500'
              : 'text-theme-800 dark:text-theme-300'
          )}
        >
          {route.name}
        </UnstyledLink>
      ))}
    </nav>
  )
}

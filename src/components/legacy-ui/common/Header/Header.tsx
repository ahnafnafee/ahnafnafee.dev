'use client'

import { twclsx } from '@/libs'
import APP_ROUTE from '@/libs/constants/route'

import { useWindowScrollY } from '@/hooks'

import { MobileNav } from './MobileNav'
import { ThemeMenu } from './ThemeMenu'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

export const Header: React.FunctionComponent = () => {
  const y = useWindowScrollY()
  const pathname = usePathname()
  const exceptedPage = [
    // '/404',
    '/_error',
    // '/resume',
    '/_offline'
  ]

  if (exceptedPage.includes(pathname)) return null

  return (
    <header
      className={twclsx(
        'sticky inset-x-0 top-0 z-50',
        'border-b border-b-transparent',
        'bg-theme-50 dark:bg-theme-900',
        'supports-[backdrop-filter:blur(0px)]:bg-theme-50/60 dark:supports-[backdrop-filter:blur(0px)]:bg-theme-900/60',
        'supports-[backdrop-filter:blur(0px)]:backdrop-blur-xl',
        y > 34 && 'border-b-theme-300 dark:border-b-theme-600'
      )}
    >
      <nav className='layout flex h-16 items-center justify-between md:h-20'>
        <MobileNav />
        <div className='hidden space-x-3 md:flex md:items-center'>
          {APP_ROUTE.map((route) => {
            return (
              <div key={route.path}>
                <NavItem href={route.path} text={route.name} />
              </div>
            )
          })}
        </div>
        <div className='inline-flex items-center justify-end space-x-2.5 md:space-x-0'>
          <ThemeMenu />
        </div>
      </nav>
    </header>
  )
}

function NavItem({ href, text }: { href: string; text: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <NextLink
      href={href}
      className={twclsx(
        isActive
          ? 'font-semibold text-gray-800 dark:text-gray-200'
          : 'font-normal text-gray-600 dark:text-gray-400 hover:dark:text-gray-200',
        'hover:bg-primary-100 hover:dark:bg-theme-700 hidden rounded-lg p-1 transition-all sm:px-2 sm:py-1 md:inline-block'
      )}
    >
      <span className='capsize'>{text}</span>
    </NextLink>
  )
}

'use client'

import { FooterSocialHome } from '@/components/site/common/FooterSocialHome'
import { UnstyledLink } from '@/components/site/links'

import APP_ROUTE from '@/libs/constants/route'
import { twclsx } from '@/libs/twclsx'

import { usePathname } from 'next/navigation'

export const Footer: React.FunctionComponent = () => {
  const pathname = usePathname()
  const isError = pathname === '/_error' || pathname === '/_offline' || pathname === '/404'

  if (isError) {
    return null
  }

  return (
    <footer className={twclsx('layout', 'mt-5 py-4')}>
      <hr className='mb-8 w-full border-1 border-gray-200 dark:border-gray-800' />
      <div className='grid w-full max-w-2xl grid-cols-3 gap-4 pb-16'>
        <div className='flex flex-col space-y-4'>
          <p className={'text-sm font-bold'}>ME</p>
          {APP_ROUTE.map((route) => (
            <UnstyledLink
              href={route.path}
              key={`footer-${route.path}`}
              className='hover:border-b-theme-500 max-w-max border-b border-dashed border-transparent text-sm font-medium text-gray-400 hover:text-gray-600'
            >
              {route.name}
            </UnstyledLink>
          ))}
        </div>
        {/*Empty Column*/}
        <div></div>
        <FooterSocialHome />
      </div>
      <hr className='mb-4 w-full border-1 border-gray-200 dark:border-gray-800' />
      <p className={'my-8 text-center text-sm text-gray-600 dark:text-gray-500'}>
        {` © ${new Date().getFullYear()} - All Rights Reserved`}
      </p>
    </footer>
  )
}

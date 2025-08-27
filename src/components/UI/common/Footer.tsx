'use client'

import { FooterSocialHome } from '@/UI/common/FooterSocialHome'
import { UnstyledLink } from '@/UI/links'

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
    <footer className={twclsx('layout', 'py-4 mt-5')}>
      <hr className='w-full border-1 border-gray-200 dark:border-gray-800 mb-8' />
      <div className='w-full max-w-2xl grid grid-cols-3 gap-4 pb-16'>
        <div className='flex flex-col space-y-4'>
          <p className={'font-bold text-sm'}>ME</p>
          {APP_ROUTE.map((route) => (
            <UnstyledLink
              href={route.path}
              key={`footer-${route.path}`}
              className='text-sm font-medium max-w-max border-b border-dashed border-transparent hover:border-b-theme-500 text-gray-400 hover:text-gray-600'
            >
              {route.name}
            </UnstyledLink>
          ))}
        </div>
        {/*Empty Column*/}
        <div></div>
        <FooterSocialHome />
      </div>
      <hr className='w-full border-1 border-gray-200 dark:border-gray-800 mb-4' />
      <p className={'my-8 text-sm dark:text-gray-500 text-gray-600 text-center'}>
        {` © ${new Date().getFullYear()} - All Rights Reserved`}
      </p>
    </footer>
  )
}

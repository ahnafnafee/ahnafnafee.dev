'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import APP_ROUTE from '@/libs/constants/route'

import NextLink from 'next/link'
import { CgFileDocument } from 'react-icons/cg'
import { HiMenuAlt4, HiOutlineBeaker } from 'react-icons/hi'
import type { IconType } from 'react-icons/lib'
import { RiContactsBookLine, RiHome6Line, RiPenNibLine, RiReactjsLine } from 'react-icons/ri'

const icon: Record<string, IconType> = {
  home: RiHome6Line,
  portfolio: RiReactjsLine,
  blog: RiPenNibLine,
  research: HiOutlineBeaker,
  guestbook: RiContactsBookLine,
  resume: CgFileDocument
}

const route = APP_ROUTE.map((r) => ({ ...r, icon: icon[r.name.toLowerCase()] ?? RiReactjsLine }))

export const MobileNav: React.FunctionComponent = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Open navigation menu'
          className='bg-primary-100 text-primary-700 hover:bg-primary-100/80 hover:text-primary-700 dark:bg-theme-700 dark:hover:bg-theme-700/80 md:hidden dark:text-white dark:hover:text-white'
        >
          <HiMenuAlt4 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-40'>
        <DropdownMenuGroup>
          {route.map((r) => {
            const Icon = r.icon
            return (
              <DropdownMenuItem key={r.path} asChild>
                <NextLink href={r.path} className='flex items-center gap-2.5'>
                  <Icon />
                  <span className='text-sm'>{r.name}</span>
                </NextLink>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

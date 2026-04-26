'use client'

import { Button } from '@/components/ui/button'

import { useWindowScrollY } from '@/hooks'
import { cn } from '@/lib/utils'

import { useCallback } from 'react'
import { HiOutlineArrowUp } from 'react-icons/hi'

export const BackToTop: React.FunctionComponent = () => {
  const yAxis = useWindowScrollY()
  const handleClick = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])
  const visible = yAxis > 200

  return (
    <Button
      onClick={handleClick}
      aria-label='Back To Top'
      variant='ghost'
      size='icon'
      className={cn(
        'fixed right-[6vw] bottom-[6vh] z-[1] md:bottom-[12vh] lg:right-[8vw]',
        'rounded-xl shadow-md transition-all duration-200',
        'bg-primary-100 text-primary-700 hover:bg-primary-100/80 hover:text-primary-700',
        'dark:bg-theme-800 dark:text-primary-400 dark:hover:bg-theme-800/80 dark:hover:text-primary-400',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <HiOutlineArrowUp />
    </Button>
  )
}

import NextLink, { type LinkProps } from 'next/link'
import { forwardRef } from 'react'

export type UnstyledLinkProps = {
  href: string
  title?: string
  className?: string
  children?: React.ReactNode
} & LinkProps

export const UnstyledLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(({ href, children, ...props }, ref) => {
  if (href.startsWith('http')) {
    return (
      <a href={href} rel='noopener noreferrer' target='_blank' {...props} ref={ref}>
        {children}
      </a>
    )
  }

  // Default Next.js scroll behavior: scroll-to-top on a new path, hash-aware
  // for in-page anchors. The previous `scroll={false}` blocked both, leaving
  // readers stranded mid-page when navigating between posts.
  return (
    <NextLink href={href} {...props} ref={ref}>
      {children}
    </NextLink>
  )
})

UnstyledLink.displayName = 'UnstyledLink'

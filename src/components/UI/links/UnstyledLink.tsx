import NextLink from 'next/link'
import type { LinkProps } from 'next/link'
import { forwardRef } from 'react'

export type UnstyledLinkProps = {
  href: string
  title?: string
  className?: string
  children?: React.ReactNode
} & LinkProps

export const UnstyledLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ href, children, ...props }, ref) => {
    if (href.startsWith('http')) {
      return (
        <a href={href} rel='noopener noreferrer' target='_blank' {...props} ref={ref}>
          {children}
        </a>
      )
    }

    return (
      <NextLink href={href} scroll={false} {...props} ref={ref}>
        {children}
      </NextLink>
    )
  }
)

UnstyledLink.displayName = 'UnstyledLink'

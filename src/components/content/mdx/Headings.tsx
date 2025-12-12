'use client'

import { UnstyledLink } from '@/UI/links'

import { twclsx } from '@/libs'

import { useEffect, useState } from 'react'

type HeadingProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

const getHashURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.hash.slice(1)
  }
  return ''
}

export const HeadingTwo: React.FunctionComponent<HeadingProps> = ({ id, ...props }) => {
  const [hashPath, setHasPath] = useState(false)

  useEffect(() => {
    const checkHash = () => {
      const currentHash = getHashURL()
      setHasPath(currentHash === id)
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)

    return () => {
      window.removeEventListener('hashchange', checkHash)
    }
  }, [id])

  return (
    <h2 id={id} {...props}>
      <UnstyledLink
        title={id}
        href={`#${id}`}
        className={twclsx(
          'no-underline transition',
          'border-b border-dashed',
          'border-transparent hover:border-gray-500',
          'font-bold text-2xl tracking-tight mb-4 mt-16 text-black dark:text-white',
          hashPath && 'border-gray-500'
        )}
      >
        {props.children}
      </UnstyledLink>
    </h2>
  )
}

export const HeadingThree: React.FunctionComponent<HeadingProps> = ({ id, ...props }) => {
  const [hashPath, setHasPath] = useState(false)

  useEffect(() => {
    const checkHash = () => {
      const currentHash = getHashURL()
      setHasPath(currentHash === id)
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)

    return () => {
      window.removeEventListener('hashchange', checkHash)
    }
  }, [id])

  return (
    <h3 id={id} {...props}>
      <UnstyledLink
        title={id}
        href={`#${id}`}
        className={twclsx(
          'no-underline transition',
          'border-b border-dashed',
          'border-transparent hover:border-gray-500',
          'mt-8 mb-4 text-xl font-bold tracking-tight text-black md:text-2xl dark:text-white',
          hashPath && 'border-gray-500'
        )}
      >
        {props.children}
      </UnstyledLink>
    </h3>
  )
}

export const HeadingFour: React.FunctionComponent<HeadingProps> = ({ id, ...props }) => {
  const [hashPath, setHasPath] = useState(false)

  useEffect(() => {
    const checkHash = () => {
      const currentHash = getHashURL()
      setHasPath(currentHash === id)
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)

    return () => {
      window.removeEventListener('hashchange', checkHash)
    }
  }, [id])

  return (
    <h4 id={id} {...props}>
      <UnstyledLink
        title={id}
        href={`#${id}`}
        className={twclsx(
          'no-underline transition',
          'border-b border-dashed',
          'border-transparent hover:border-gray-500',
          hashPath && 'border-gray-500'
        )}
      >
        {props.children}
      </UnstyledLink>
    </h4>
  )
}

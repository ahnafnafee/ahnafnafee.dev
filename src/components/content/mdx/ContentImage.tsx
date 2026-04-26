'use client'

import { WrappedImage } from '@/UI/images'

import { twclsx } from '@/libs/twclsx'

import dynamic from 'next/dynamic'
import type { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

// Lightbox + its CSS (~30KB combined) only matter when a reader clicks an image.
// Dynamic import keeps it out of the initial blog-post bundle.
const LightboxLazy = dynamic(() => import('./LightboxLazy').then((m) => m.LightboxLazy), {
  ssr: false
})

interface ContentImageProps extends Omit<ImageProps, 'width' | 'height' | 'src'> {
  alt: string
  src: string
  title: string
  width?: number
  height?: number
}

export const ContentImage = ({ src, alt, width, height, sizes, ...props }: ContentImageProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement

      if (isOpen) {
        html.classList.add('overflow-hidden')
        html.classList.add('sm:pr-3.5')
      }

      if (html.classList.contains('overflow-hidden') && !isOpen) {
        html.classList.remove('overflow-hidden')
        html.classList.remove('sm:pr-3.5')
      }
    }
  }, [isOpen])

  return (
    <>
      <WrappedImage
        onClick={() => setIsOpen(true)}
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 675}
        sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 768px'}
        className={twclsx('rounded-lg', 'cursor-pointer object-cover')}
        {...props}
      />

      {isOpen && (
        <LightboxLazy
          mainSrc={src}
          imageTitle={props.title}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

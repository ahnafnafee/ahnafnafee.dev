'use client'

import { WrappedImage } from '@/components/site/images'

import { twclsx } from '@/libs/twclsx'

import { ImageLightbox } from './ImageLightbox'

import type { ImageProps } from 'next/image'
import { useState } from 'react'

interface ContentImageProps extends Omit<ImageProps, 'width' | 'height' | 'src'> {
  alt: string
  src: string
  title: string
  width?: number
  height?: number
}

export const ContentImage = ({ src, alt, width, height, sizes, ...props }: ContentImageProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <WrappedImage
        onClick={() => setIsOpen(true)}
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 675}
        sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 768px'}
        className={twclsx('rounded-lg', 'cursor-zoom-in object-cover')}
        {...props}
      />

      {isOpen && <ImageLightbox src={src} alt={alt} onClose={() => setIsOpen(false)} />}
    </>
  )
}

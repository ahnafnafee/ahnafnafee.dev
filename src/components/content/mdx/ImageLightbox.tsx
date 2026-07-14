/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HiX } from 'react-icons/hi'

type ImageLightboxProps = {
  src: string
  alt?: string
  onClose: () => void
}

// Minimal, dependency-free image lightbox. A plain <img> on a fixed backdrop
// renders any URL the page can already load — local /images, ImageKit, external
// — which react-image-lightbox could not (it relied on ReactDOM.findDOMNode,
// removed in React 19). Esc or a click on the backdrop closes it.
export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const html = document.documentElement
    html.classList.add('overflow-hidden')
    return () => {
      document.removeEventListener('keydown', onKey)
      html.classList.remove('overflow-hidden')
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      role='dialog'
      aria-modal='true'
      aria-label={alt || 'Expanded image'}
      onClick={onClose}
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-10'
    >
      <button
        type='button'
        onClick={onClose}
        aria-label='Close image'
        className='absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25'
      >
        <HiX className='h-6 w-6' />
      </button>

      <img
        src={src}
        alt={alt || ''}
        onClick={(e) => e.stopPropagation()}
        className='max-h-full max-w-full cursor-zoom-out rounded-lg object-contain shadow-2xl'
      />
    </div>,
    document.body
  )
}

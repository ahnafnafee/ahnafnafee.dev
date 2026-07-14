'use client'

import { ImageLightbox } from './ImageLightbox'

import { useEffect, useState } from 'react'

// Content images in MDX are literal <img> tags (and markdown ![]()), which MDX
// does not route through the components map. Mount this once per content page:
// it delegates clicks on any image inside a .prose / .not-prose block to a
// lightbox, so every gallery and inline figure is click-to-zoom. next/image
// images (<ContentImage>) carry data-nimg and keep their own handler, and images
// wrapped in a link are left alone.
export function ContentImageZoom() {
  const [current, setCurrent] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const inScope = (img: HTMLImageElement) =>
      Boolean(img.closest('.prose, .not-prose')) && !img.closest('a') && !img.hasAttribute('data-nimg')

    // Add a zoom cursor to every eligible content image as an affordance.
    document.querySelectorAll<HTMLImageElement>('.prose img, .not-prose img').forEach((img) => {
      if (inScope(img)) img.classList.add('cursor-zoom-in')
    })

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      if (!el || el.tagName !== 'IMG') return
      const img = el as HTMLImageElement
      if (!inScope(img)) return
      e.preventDefault()
      setCurrent({ src: img.currentSrc || img.src, alt: img.alt })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return current ? <ImageLightbox src={current.src} alt={current.alt} onClose={() => setCurrent(null)} /> : null
}

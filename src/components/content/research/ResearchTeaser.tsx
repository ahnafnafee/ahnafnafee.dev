import { twclsx } from '@/libs/twclsx'

import NextImage from 'next/image'

type ResearchTeaserProps = {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}

/**
 * Hero figure on the research detail page. Uses a 16:9 aspect-ratio box with
 * `object-contain` so the entire scientific figure is visible at every viewport
 * width — research teasers usually have important content (axes, labels,
 * sub-panels) edge-to-edge that can't be cropped by `object-cover`. The bg
 * tile shows behind the image only when the source aspect ratio mismatches.
 */
export const ResearchTeaser: React.FunctionComponent<ResearchTeaserProps> = ({ src, alt, caption, priority }) => {
  return (
    <figure className={twclsx('not-prose my-4')}>
      <div
        className={twclsx('relative aspect-video w-full overflow-hidden rounded-lg', 'bg-gray-100 dark:bg-gray-800/40')}
      >
        <NextImage
          src={src}
          alt={alt}
          fill
          priority={priority ?? true}
          sizes='(max-width: 768px) 100vw, 768px'
          className='object-contain'
        />
      </div>
      {caption && (
        <figcaption
          className={twclsx('text-center text-sm text-gray-500 dark:text-gray-400', 'mx-auto mt-3 max-w-2xl italic')}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

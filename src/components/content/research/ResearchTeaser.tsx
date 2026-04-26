import { WrappedImage } from '@/components/UI/images'

import { twclsx } from '@/libs/twclsx'

type ResearchTeaserProps = {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}

export const ResearchTeaser: React.FunctionComponent<ResearchTeaserProps> = ({ src, alt, caption, priority }) => {
  return (
    <figure className={twclsx('my-4 not-prose')}>
      <WrappedImage
        src={src}
        alt={alt}
        fill
        priority={priority ?? true}
        parentStyle='w-full h-72 sm:h-96 md:h-[28rem]'
        className={twclsx('object-cover rounded-lg')}
      />
      {caption && (
        <figcaption
          className={twclsx(
            'text-center text-sm text-gray-500 dark:text-gray-400',
            'mt-3 italic max-w-2xl mx-auto'
          )}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

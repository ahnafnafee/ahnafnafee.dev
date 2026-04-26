import { WrappedImage } from '@/components/legacy-ui/images'

import { twclsx } from '@/libs/twclsx'

type ResearchTeaserProps = {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}

export const ResearchTeaser: React.FunctionComponent<ResearchTeaserProps> = ({ src, alt, caption, priority }) => {
  return (
    <figure className={twclsx('not-prose my-4')}>
      <WrappedImage
        src={src}
        alt={alt}
        fill
        priority={priority ?? true}
        parentStyle='w-full h-72 sm:h-96 md:h-[28rem]'
        className={twclsx('rounded-lg object-cover')}
      />
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

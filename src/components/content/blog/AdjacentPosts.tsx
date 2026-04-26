import { UnstyledLink } from '@/components/site/links'

import type { AdjacentPosts as AdjacentPostsData } from '@/libs/sorters/getAdjacentPosts'

import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'

export const AdjacentPosts: React.FC<AdjacentPostsData> = ({ prev, next }) => {
  if (!prev && !next) return null

  return (
    <nav aria-label='Post navigation' className='mt-16 grid grid-cols-1 gap-4 md:grid-cols-2'>
      {prev ? (
        <UnstyledLink
          href={`/blog/${prev.slug}`}
          className='group rounded-lg border border-gray-200 p-5 transition-colors hover:border-purple-400 dark:border-gray-800 dark:hover:border-purple-500'
        >
          <span className='mb-2 flex items-center gap-1 text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400'>
            <HiArrowLeft className='h-3.5 w-3.5' />
            Previous
          </span>
          <span className='line-clamp-2 block text-base leading-snug font-semibold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-gray-100'>
            {prev.title}
          </span>
        </UnstyledLink>
      ) : (
        <span aria-hidden />
      )}
      {next ? (
        <UnstyledLink
          href={`/blog/${next.slug}`}
          className='group rounded-lg border border-gray-200 p-5 transition-colors hover:border-purple-400 md:text-right dark:border-gray-800 dark:hover:border-purple-500'
        >
          <span className='mb-2 flex items-center gap-1 text-xs font-bold tracking-wide text-gray-500 uppercase md:justify-end dark:text-gray-400'>
            Next
            <HiArrowRight className='h-3.5 w-3.5' />
          </span>
          <span className='line-clamp-2 block text-base leading-snug font-semibold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-gray-100'>
            {next.title}
          </span>
        </UnstyledLink>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  )
}

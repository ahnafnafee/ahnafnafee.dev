import { UnstyledLink } from '@/UI/links'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import type { AdjacentPosts as AdjacentPostsData } from '@/libs/sorters/getAdjacentPosts'

export const AdjacentPosts: React.FC<AdjacentPostsData> = ({ prev, next }) => {
  if (!prev && !next) return null

  return (
    <nav aria-label='Post navigation' className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-4'>
      {prev ? (
        <UnstyledLink
          href={`/blog/${prev.slug}`}
          className='group rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:border-purple-400 dark:hover:border-purple-500 transition-colors'
        >
          <span className='flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2'>
            <HiArrowLeft className='w-3.5 h-3.5' />
            Previous
          </span>
          <span className='block text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-purple-600 transition-colors line-clamp-2'>
            {prev.title}
          </span>
        </UnstyledLink>
      ) : (
        <span aria-hidden />
      )}
      {next ? (
        <UnstyledLink
          href={`/blog/${next.slug}`}
          className='group rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:border-purple-400 dark:hover:border-purple-500 transition-colors md:text-right'
        >
          <span className='flex items-center md:justify-end gap-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2'>
            Next
            <HiArrowRight className='w-3.5 h-3.5' />
          </span>
          <span className='block text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-purple-600 transition-colors line-clamp-2'>
            {next.title}
          </span>
        </UnstyledLink>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  )
}

import { UnstyledLink } from '@/components/site/links'

import { generateOgImage } from '@/libs/metapage'

import type { Blog } from 'me'
import NextImage from 'next/image'
import { HiOutlineClock } from 'react-icons/hi'

type BlogItemProps = Blog & { priority?: boolean }

export const BlogItem: React.FunctionComponent<BlogItemProps> = (props) => {
  const urlPost = `/blog/${props.slug}`

  // Use the thumbnail from props, or fallback to generated OG image
  const ogImageUrl = props.thumbnail || generateOgImage({ title: props.title, theme: 'dark' })

  return (
    <div className='group w-full border-b border-gray-100 py-8 last:border-0 dark:border-gray-800'>
      <div className='flex flex-col-reverse gap-6 md:flex-row md:items-start md:justify-between md:gap-8'>
        {/* Left Content */}
        <div className='flex min-w-0 flex-1 flex-col'>
          {/* Metadata Top */}
          <div className='mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-purple-600 uppercase dark:text-purple-400'>
            {new Date(props.published).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>

          <h3 className='mb-3 text-xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-purple-600 md:text-2xl dark:text-gray-100'>
            <UnstyledLink href={urlPost}>{props.title}</UnstyledLink>
          </h3>

          <p className='mb-4 line-clamp-2 leading-relaxed text-gray-600 md:line-clamp-3 dark:text-gray-400'>
            {props.summary}
          </p>

          <div className='mt-auto flex flex-wrap items-center gap-3'>
            {/* Labels */}
            {props.topics.length > 0 && (
              <div className='flex flex-wrap items-center gap-2'>
                {props.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className='rounded-sm bg-gray-200 px-2 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-300'
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            <div className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-500'>
              <HiOutlineClock className='h-3.5 w-3.5' />
              <span>{props.est_read ?? '0 min'}</span>
            </div>
          </div>
        </div>

        {/* Right Thumbnail */}
        <UnstyledLink
          href={urlPost}
          className='relative block aspect-[1.91/1] w-full flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 md:aspect-square md:w-48 dark:border-gray-700 dark:bg-gray-800'
        >
          <NextImage
            src={ogImageUrl}
            alt={props.title}
            fill
            sizes='(max-width: 768px) 100vw, 192px'
            className='cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105'
            priority={props.priority ?? false}
          />
        </UnstyledLink>
      </div>
    </div>
  )
}

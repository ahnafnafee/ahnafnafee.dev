import { UnstyledLink } from '@/UI/links'
import type { Research } from 'me'
import { generateOgImage } from '@/libs/metapage'
import { SITE_AUTHOR } from '@/libs/constants/site'
import { twclsx } from '@/libs/twclsx'
import { Fragment } from 'react'
import NextImage from 'next/image'

type ResearchItemProps = Research & { priority?: boolean }

export const ResearchItem: React.FunctionComponent<ResearchItemProps> = (props) => {
  const urlPost = `/research/${props.slug}`

  const ogImageUrl =
    props.thumbnail || props.teaser || generateOgImage({ title: props.title, theme: 'dark' })

  const formattedDate = new Date(props.published).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const venueLabel = props.venue?.short ?? props.venue?.name
  const venueYear = props.venue?.year
  const metaParts = [venueLabel, venueYear ? String(venueYear) : undefined, formattedDate].filter(
    (part): part is string => Boolean(part)
  )

  return (
    <div className='w-full py-8 border-b border-gray-100 dark:border-gray-800 last:border-0 group'>
      <div className='flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-6 md:gap-8'>
        <div className='flex flex-col flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-2 text-xs font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400'>
            {metaParts.join(' · ')}
          </div>

          <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3 group-hover:text-purple-600 transition-colors'>
            <UnstyledLink href={urlPost}>{props.title}</UnstyledLink>
          </h3>

          <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2 md:line-clamp-3'>
            {props.summary}
          </p>

          {props.authors.length > 0 && (
            <div className='text-sm text-gray-500 dark:text-gray-500 mb-3'>
              {props.authors.map((author, i) => {
                const isOwner = author.name === SITE_AUTHOR.name
                const isLast = i === props.authors.length - 1
                return (
                  <Fragment key={`${author.name}-${i}`}>
                    <span
                      className={twclsx(
                        isOwner && 'font-semibold text-purple-700 dark:text-purple-300'
                      )}
                    >
                      {author.name}
                    </span>
                    {!isLast && ', '}
                  </Fragment>
                )
              })}
            </div>
          )}

          <div className='flex flex-wrap items-center gap-3 mt-auto'>
            {props.topics.length > 0 && (
              <div className='flex flex-wrap items-center gap-2'>
                {props.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className='px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-sm whitespace-nowrap'
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <UnstyledLink
          href={urlPost}
          className='relative w-full md:w-48 aspect-[1.91/1] md:aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 block'
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

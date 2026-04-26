import { UnstyledLink } from '@/UI/links'
import type { Research } from 'me'
import { generateOgImage } from '@/libs/metapage'
import { SITE_AUTHOR } from '@/libs/constants/site'
import { twclsx } from '@/libs/twclsx'
import { Fragment } from 'react'
import NextImage from 'next/image'

type ResearchItemProps = Research & { priority?: boolean }

type ActionLink = { label: string; href: string }

const buildActionLinks = (props: ResearchItemProps): ActionLink[] => {
  const links: ActionLink[] = [{ label: 'Project', href: `/research/${props.slug}` }]
  if (props.links?.paper) links.push({ label: 'Paper', href: props.links.paper })
  if (props.links?.code) links.push({ label: 'Code', href: props.links.code })
  if (props.links?.supplementary) links.push({ label: 'Supp', href: props.links.supplementary })
  if (props.links?.video) links.push({ label: 'Video', href: props.links.video })
  if (props.links?.slides) links.push({ label: 'Slides', href: props.links.slides })
  return links
}

const buildVenueLine = (props: ResearchItemProps): string | null => {
  const v = props.venue
  if (!v) return null
  const name = v.name ?? v.short
  if (!name) return null
  return v.year ? `${name} ${v.year}` : name
}

export const ResearchItem: React.FunctionComponent<ResearchItemProps> = (props) => {
  const urlPost = `/research/${props.slug}`
  const ogImageUrl =
    props.thumbnail || props.teaser || generateOgImage({ title: props.title, theme: 'dark' })
  const venueLine = buildVenueLine(props)
  const actions = buildActionLinks(props)

  return (
    <div className='w-full py-5 group'>
      <div className='flex flex-row items-start gap-4 md:gap-6'>
        <UnstyledLink
          href={urlPost}
          className='relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 block'
        >
          <NextImage
            src={ogImageUrl}
            alt={props.title}
            fill
            sizes='(max-width: 640px) 96px, (max-width: 768px) 112px, 128px'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            priority={props.priority ?? false}
          />
        </UnstyledLink>

        <div className='flex flex-col flex-1 min-w-0'>
          <h3 className='text-base md:text-lg font-bold text-purple-700 dark:text-purple-300 leading-snug mb-1 hover:underline'>
            <UnstyledLink href={urlPost}>{props.title}</UnstyledLink>
            {props.new && (
              <span className='ml-2 align-middle text-[10px] font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400'>
                NEW
              </span>
            )}
          </h3>

          {props.authors.length > 0 && (
            <div className='text-sm text-gray-700 dark:text-gray-300 leading-snug mb-1'>
              {props.authors.map((author, i) => {
                const isOwner = author.name === SITE_AUTHOR.name
                const isLast = i === props.authors.length - 1
                return (
                  <Fragment key={`${author.name}-${i}`}>
                    <span
                      className={twclsx(isOwner && 'font-bold text-gray-900 dark:text-gray-100')}
                    >
                      {author.name}
                    </span>
                    {!isLast && ', '}
                  </Fragment>
                )
              })}
            </div>
          )}

          {venueLine && (
            <div className='text-sm font-bold text-gray-900 dark:text-gray-200 leading-snug mb-2'>
              [{venueLine}]
            </div>
          )}

          {actions.length > 0 && (
            <div className='flex flex-wrap items-center gap-x-1 text-xs md:text-sm text-purple-600 dark:text-purple-400'>
              {actions.map((action, i) => (
                <Fragment key={action.label}>
                  <UnstyledLink href={action.href} className='hover:underline'>
                    {action.label}
                  </UnstyledLink>
                  {i < actions.length - 1 && (
                    <span className='text-gray-400 dark:text-gray-600' aria-hidden='true'>
                      |
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { UnstyledLink } from '@/components/site/links'

import { SITE_AUTHOR } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'
import { twclsx } from '@/libs/twclsx'

import { ComingSoonImage } from './ComingSoonImage'

import type { Research } from 'me'
import NextImage from 'next/image'
import { Fragment } from 'react'

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

// Prefer the curated thumbnail. Fall back to the teaser figure, then to a
// generated OG image. ImageKit URLs get a width transform so we request the
// right size for the listing card (max ~176px @ 3x DPR ≈ 528px) instead of
// the unsized original. ImageKit caps at the source resolution, so requesting
// w-600 is safe even when the original is smaller.
const isImagekitUrl = (s: string): boolean => {
  try {
    return new URL(s).hostname === 'ik.imagekit.io'
  } catch {
    return false
  }
}
const resolveListingImage = (props: ResearchItemProps): string => {
  const withWidth = (s: string) => (isImagekitUrl(s) && !s.includes('?tr=') ? `${s}?tr=w-600` : s)
  if (props.thumbnail) return withWidth(props.thumbnail)
  if (props.teaser) return withWidth(props.teaser)
  return generateOgImage({ title: props.title, theme: 'dark' })
}

export const ResearchItem: React.FunctionComponent<ResearchItemProps> = (props) => {
  const urlPost = `/research/${props.slug}`
  const imageSrc = resolveListingImage(props)
  const venueLine = buildVenueLine(props)
  const actions = buildActionLinks(props)

  return (
    <article className='group w-full py-8'>
      <div className='flex flex-col gap-5 md:flex-row md:items-start md:gap-7'>
        <UnstyledLink
          href={urlPost}
          className='relative block aspect-[5/4] w-full flex-shrink-0 overflow-hidden rounded-md bg-gray-100 shadow-sm ring-1 ring-gray-200 md:w-44 dark:bg-gray-800 dark:ring-gray-800'
        >
          {props.comingSoon ? (
            <ComingSoonImage className='transition-transform duration-300 group-hover:scale-[1.03]' />
          ) : (
            <NextImage
              src={imageSrc}
              alt={props.title}
              fill
              sizes='(max-width: 768px) 100vw, 176px'
              quality={90}
              className='object-contain transition-transform duration-300 group-hover:scale-[1.03]'
              priority={props.priority ?? false}
            />
          )}
        </UnstyledLink>

        <div className='flex min-w-0 flex-1 flex-col pt-0.5'>
          <h3 className='mb-1.5 text-base leading-snug font-bold text-purple-700 decoration-purple-400 underline-offset-2 hover:underline md:text-lg dark:text-purple-300'>
            <UnstyledLink href={urlPost}>{props.title}</UnstyledLink>
            {props.new && (
              <span className='ml-2 inline-flex items-center rounded-sm bg-orange-100 px-1.5 py-0.5 align-middle text-[10px] font-bold tracking-wider text-orange-700 uppercase dark:bg-orange-500/15 dark:text-orange-300'>
                NEW
              </span>
            )}
          </h3>

          {props.authors.length > 0 && (
            <div className='mb-1 text-sm leading-snug text-gray-700 dark:text-gray-300'>
              {props.authors.map((author, i) => {
                const isOwner = author.name === SITE_AUTHOR.name
                const isLast = i === props.authors.length - 1
                return (
                  <Fragment key={`${author.name}-${i}`}>
                    <span className={twclsx(isOwner && 'font-bold text-gray-900 dark:text-gray-100')}>
                      {author.name}
                    </span>
                    {!isLast && ', '}
                  </Fragment>
                )
              })}
            </div>
          )}

          {venueLine && (
            <div className='mb-2.5 text-sm leading-snug text-gray-700 italic dark:text-gray-400'>{venueLine}</div>
          )}

          {actions.length > 0 && (
            <div className='flex flex-wrap items-center gap-x-2 text-xs text-purple-600 md:text-sm dark:text-purple-400'>
              {actions.map((action, i) => (
                <Fragment key={action.label}>
                  <UnstyledLink href={action.href} className='hover:underline'>
                    {action.label}
                  </UnstyledLink>
                  {i < actions.length - 1 && (
                    <span className='text-gray-300 dark:text-gray-700' aria-hidden='true'>
                      |
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

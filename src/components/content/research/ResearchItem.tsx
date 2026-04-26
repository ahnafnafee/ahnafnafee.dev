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
    <article className='w-full py-8 group'>
      <div className='flex flex-row items-start gap-5 md:gap-7'>
        <UnstyledLink
          href={urlPost}
          className='relative w-32 sm:w-36 md:w-44 aspect-[5/4] flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 block shadow-sm'
        >
          <NextImage
            src={imageSrc}
            alt={props.title}
            fill
            sizes='(max-width: 640px) 128px, (max-width: 768px) 144px, 176px'
            quality={90}
            className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
            priority={props.priority ?? false}
          />
        </UnstyledLink>

        <div className='flex flex-col flex-1 min-w-0 pt-0.5'>
          <h3 className='text-base md:text-lg font-bold text-purple-700 dark:text-purple-300 leading-snug mb-1.5 hover:underline decoration-purple-400 underline-offset-2'>
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
            <div className='text-sm font-bold text-gray-900 dark:text-gray-200 leading-snug mb-2.5'>
              [{venueLine}]
            </div>
          )}

          {actions.length > 0 && (
            <div className='flex flex-wrap items-center gap-x-2 text-xs md:text-sm text-purple-600 dark:text-purple-400'>
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

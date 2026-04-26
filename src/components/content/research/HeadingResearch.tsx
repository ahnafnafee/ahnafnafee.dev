import { UnstyledLink } from '@/components/UI/links'

import { SITE_AUTHOR } from '@/libs/constants/site'
import { twclsx } from '@/libs/twclsx'

import { Affiliation, Author, ResearchLinks, Venue } from 'me'
import {
  HiGlobeAlt,
  HiOutlineDatabase,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentText,
  HiOutlineHashtag,
  HiOutlinePlay,
  HiOutlinePresentationChartBar
} from 'react-icons/hi'
import { SiArxiv, SiGithub, SiResearchgate } from 'react-icons/si'

type HeadingResearchProps = {
  title: string
  topics: string[]
  authors: Author[]
  affiliations?: Affiliation[]
  venue?: Venue
  links?: ResearchLinks
  bibtex?: string
}

type ActionButtonProps = {
  href: string
  icon: React.ReactNode
  label: string
  isAnchor?: boolean
}

const ACTION_BUTTON_CLASS = twclsx(
  'inline-flex items-center gap-2',
  'px-3.5 py-2 rounded-lg',
  'bg-gray-100 dark:bg-gray-800',
  'border border-gray-200 dark:border-gray-700',
  'text-theme-800 dark:text-theme-100 font-medium text-sm md:text-[0.95rem]',
  'hover:bg-gray-200 dark:hover:bg-gray-700',
  'hover:border-gray-300 dark:hover:border-gray-600',
  'hover:text-black dark:hover:text-white',
  'transition-colors'
)

const ActionButton: React.FunctionComponent<ActionButtonProps> = ({ href, icon, label, isAnchor }) => {
  if (isAnchor) {
    return (
      <a href={href} className={ACTION_BUTTON_CLASS}>
        {icon}
        <span>{label}</span>
      </a>
    )
  }

  return (
    <UnstyledLink href={href} className={ACTION_BUTTON_CLASS}>
      {icon}
      <span>{label}</span>
    </UnstyledLink>
  )
}

const ICON_CLASS = twclsx('text-base md:text-lg', 'text-theme-700 dark:text-theme-200')

export const HeadingResearch: React.FunctionComponent<HeadingResearchProps> = (props) => {
  const venueParts: string[] = []
  if (props.venue?.short ?? props.venue?.name) venueParts.push((props.venue?.short ?? props.venue?.name) as string)
  if (props.venue?.year) venueParts.push(String(props.venue.year))

  return (
    <section className={twclsx('pb-2')}>
      <h1
        className={twclsx(
          'text-center text-3xl md:text-5xl font-bold tracking-tight',
          'text-black dark:text-white mb-4'
        )}
      >
        {props.title.split('').map((c, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <span key={i}>{c}</span>
        ))}
      </h1>

      {props.topics && props.topics.length > 0 && (
        <div className={twclsx('flex flex-wrap items-center gap-2 mb-6 w-full justify-center')}>
          {props.topics.map((topic) => (
            <span
              key={topic}
              className={twclsx(
                'px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
                'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                'rounded-sm whitespace-nowrap'
              )}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div
        className={twclsx(
          'flex flex-wrap items-center justify-center gap-x-2 gap-y-1',
          'text-base text-gray-700 dark:text-gray-300'
        )}
      >
        {props.authors.map((author, i) => {
          const indices = author.affiliations ?? []
          const supText = indices.join(',')
          const isLast = i === props.authors.length - 1
          const isOwner = author.name === SITE_AUTHOR.name
          const nameClass = isOwner
            ? twclsx('font-semibold text-purple-700 dark:text-purple-300')
            : undefined

          const nameNode = author.url ? (
            <UnstyledLink href={author.url} className={twclsx('hover:underline', nameClass)}>
              {author.name}
            </UnstyledLink>
          ) : (
            <span className={nameClass}>{author.name}</span>
          )

          return (
            <span key={`${author.name}-${i}`} className={twclsx('inline-flex items-baseline')}>
              {nameNode}
              {author.corresponding && <sup className={nameClass}>*</sup>}
              {supText && <sup className={nameClass}>{supText}</sup>}
              {!isLast && <span>,&nbsp;</span>}
            </span>
          )
        })}
      </div>

      {props.affiliations && props.affiliations.length > 0 && (
        <p
          className={twclsx(
            'text-center text-sm text-gray-500 dark:text-gray-400',
            'mt-2 max-w-2xl mx-auto'
          )}
        >
          {props.affiliations.map((aff, i) => {
            const idx = i + 1
            const text = aff.location ? `${aff.name}, ${aff.location}` : aff.name
            const isLast = i === (props.affiliations as Affiliation[]).length - 1
            return (
              <span key={`${aff.name}-${i}`}>
                <sup>{idx}</sup>
                {aff.url ? (
                  <UnstyledLink href={aff.url} className={twclsx('hover:underline')}>
                    {text}
                  </UnstyledLink>
                ) : (
                  text
                )}
                {!isLast && ', '}
              </span>
            )
          })}
        </p>
      )}

      {venueParts.length > 0 && (
        <p
          className={twclsx(
            'italic text-center mt-2 text-sm',
            'text-gray-500 dark:text-gray-400'
          )}
        >
          {venueParts.join(' \u00B7 ')}
        </p>
      )}

      <div className={twclsx('flex items-center justify-center gap-3 mt-6 flex-wrap')}>
        {props.links?.paper && (
          <ActionButton
            href={props.links.paper}
            icon={<HiOutlineDocumentText className={ICON_CLASS} />}
            label='Paper'
          />
        )}
        {props.links?.arxiv && (
          <ActionButton href={props.links.arxiv} icon={<SiArxiv className={ICON_CLASS} />} label='arXiv' />
        )}
        {props.links?.code && (
          <ActionButton href={props.links.code} icon={<SiGithub className={ICON_CLASS} />} label='Code' />
        )}
        {props.links?.video && (
          <ActionButton
            href={props.links.video}
            icon={<HiOutlinePlay className={ICON_CLASS} />}
            label='Video'
          />
        )}
        {props.links?.slides && (
          <ActionButton
            href={props.links.slides}
            icon={<HiOutlinePresentationChartBar className={ICON_CLASS} />}
            label='Slides'
          />
        )}
        {props.links?.dataset && (
          <ActionButton
            href={props.links.dataset}
            icon={<HiOutlineDatabase className={ICON_CLASS} />}
            label='Dataset'
          />
        )}
        {props.links?.researchGate && (
          <ActionButton
            href={props.links.researchGate}
            icon={<SiResearchgate className={ICON_CLASS} />}
            label='ResearchGate'
          />
        )}
        {props.links?.demo && (
          <ActionButton href={props.links.demo} icon={<HiGlobeAlt className={ICON_CLASS} />} label='Demo' />
        )}
        {props.links?.supplementary && (
          <ActionButton
            href={props.links.supplementary}
            icon={<HiOutlineDocumentDuplicate className={ICON_CLASS} />}
            label='Supplementary'
          />
        )}
        {props.bibtex && (
          <ActionButton
            href='#bibtex'
            icon={<HiOutlineHashtag className={ICON_CLASS} />}
            label='BibTeX'
            isAnchor
          />
        )}
      </div>

      <hr className={twclsx('w-full border-1 border-gray-200 dark:border-gray-800 mb-2 mt-8')} />
    </section>
  )
}

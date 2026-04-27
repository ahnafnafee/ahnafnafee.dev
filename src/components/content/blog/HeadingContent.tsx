'use client'

import { WrappedImage } from '@/components/site/images'
import { UnderlineLink } from '@/components/site/links'

import { twclsx } from '@/libs'
import { dateFormat, dateStringToISO } from '@/libs/intl'

import { useState } from 'react'
import { HiOutlineShare } from 'react-icons/hi'

type HeadingContentProps = {
  title: string
  summary: string
  published: string
  postViews: number
  est_read?: string
  topics: string[]
  author_name?: string
  github_username?: string
  thumbnail?: string
}

export const HeadingContent: React.FunctionComponent<HeadingContentProps> = (props) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  // Placeholder for author info if not provided in props (defaults from original AuthorSection logic)
  const authorName = props.author_name || 'Ahnaf An Nafee'
  const githubUsername = props.github_username || 'ahnafnafee'
  const authorPic = `https://github.com/${githubUsername}.png`
  const authorProfile = `https://github.com/${githubUsername}`

  return (
    <section className='mx-auto flex w-full max-w-2xl flex-col items-center'>
      {/* Title — the thumbnail in frontmatter feeds Open Graph + Twitter cards
          (social previews) and BlogItem listing thumbnails. Intentionally NOT
          rendered as an in-page hero: on narrow viewports it dominated the
          fold and pushed the headline below the scroll, and the post detail
          page already has a strong canonical claim via JSON-LD primaryImage. */}
      <h1
        className={twclsx(
          'mt-10 mb-4 text-center text-4xl leading-tight font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white'
        )}
      >
        {props.title}
      </h1>

      {/* Summary/Subtitle */}
      <p className='mb-8 max-w-prose text-center text-xl leading-relaxed text-gray-500 dark:text-gray-400'>
        {props.summary}
      </p>

      {props.topics && props.topics.length > 0 && (
        <div className='mb-8 flex w-full flex-wrap items-center justify-center gap-2'>
          {props.topics.map((topic) => (
            <span
              key={topic}
              className='rounded-sm bg-gray-200 px-2 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-300'
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Author Block */}
      {/* Author & Action Bar Combined */}
      <div className='mb-8 flex w-full items-center justify-between border-t border-b border-gray-200 py-4 dark:border-gray-800'>
        {/* Author Info */}
        <div className='flex items-center gap-3'>
          <WrappedImage
            className='rounded-full'
            alt={authorName}
            src={authorPic}
            width={44}
            height={44}
            quality={100}
            priority
          />
          <div className='flex flex-col'>
            <span className='text-sm font-bold tracking-wide text-purple-600 uppercase dark:text-purple-400'>
              <UnderlineLink href={authorProfile} title={authorName} className='text-purple-600 dark:text-purple-400'>
                {authorName}
              </UnderlineLink>
            </span>
            <div className='flex items-center gap-2 text-xs font-medium text-gray-500 uppercase'>
              <time dateTime={dateStringToISO(props.published)}>
                {dateFormat(props.published, undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className='flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
        >
          <HiOutlineShare className='text-lg' />
          <span className='text-sm font-medium'>{isCopied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>
    </section>
  )
}

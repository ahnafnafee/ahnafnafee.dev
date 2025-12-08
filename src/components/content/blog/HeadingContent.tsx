'use client'

import { twclsx } from '@/libs'
import { dateFormat, dateStringToISO } from '@/libs/intl'
import { WrappedImage } from '@/UI/images'
import { UnderlineLink } from '@/UI/links'
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
}

const config: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
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
    <section className='flex flex-col items-center max-w-2xl mx-auto w-full'>
      {/* Title */}
      <h1 className={twclsx('text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white leading-tight mt-10')}>
        {props.title}
      </h1>

      {/* Summary/Subtitle */}
      <p className='text-center text-xl text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-prose'>
        {props.summary}
      </p>

      {/* Author Block */}
      {/* Author & Action Bar Combined */}
      <div className='flex items-center justify-between w-full border-t border-b border-gray-200 dark:border-gray-800 py-4 mb-8'>
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
            <span className='font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide'>
              <UnderlineLink href={authorProfile} title={authorName}>
                {authorName}
              </UnderlineLink>
            </span>
            <div className='flex items-center gap-2 text-xs text-gray-500 uppercase font-medium'>
              <time dateTime={dateStringToISO(props.published)}>
                {dateFormat(props.published, undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400'
        >
          <HiOutlineShare className='text-lg' />
          <span className='text-sm font-medium'>{isCopied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>

    </section>
  )
}

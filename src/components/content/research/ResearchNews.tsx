import { UnstyledLink } from '@/components/site/links'

type NewsItem = {
  date: string
  emoji?: string
  body: React.ReactNode
}

const NEWS: NewsItem[] = [
  {
    date: 'Dec 2025',
    emoji: '🎉',
    body: (
      <>
        Joining the{' '}
        <UnstyledLink
          href='https://craigyuyu.github.io/home/group.html'
          className='text-primary-700 dark:text-primary-400 underline-offset-2 hover:underline'
        >
          DCXR Group
        </UnstyledLink>{' '}
        at George Mason University, starting Spring 2026.
      </>
    )
  }
]

export const ResearchNews: React.FunctionComponent = () => {
  return (
    <section className='mb-10 md:mb-12'>
      <h2 className='mb-3 border-b border-gray-200 pb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase md:text-base dark:border-gray-800 dark:text-gray-400'>
        News
      </h2>
      <ul className='flex flex-col gap-3'>
        {NEWS.map((item, i) => (
          <li
            key={i}
            className='grid grid-cols-[5.5rem_1fr] gap-3 text-sm leading-6 text-gray-700 md:gap-5 md:text-base md:leading-7 dark:text-gray-300'
          >
            <span className='shrink-0 pt-px text-xs font-medium tracking-wide text-gray-500 uppercase md:text-sm dark:text-gray-400'>
              {item.date}
            </span>
            <span>
              {item.emoji && <span className='mr-1.5'>{item.emoji}</span>}
              {item.body}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

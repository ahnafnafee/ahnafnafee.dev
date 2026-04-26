import { CategoryLabel } from '@/components/content/portfolio/CategoryLabel'
import { UnstyledLink } from '@/components/legacy-ui/links'

import { twclsx } from '@/libs'

import { format } from 'date-fns'
import { CategoryTypes } from 'me'
import NextImage from 'next/image'
import { HiGlobeAlt } from 'react-icons/hi'
import { SiApple, SiGithub, SiGoogleplay } from 'react-icons/si'

type HeadingPortfolioProps = {
  title: string
  summary: string
  link: { github?: string; live?: string; appStore?: string; playStore?: string }
  category?: CategoryTypes
  date: string
}

export const HeadingPortfolio: React.FunctionComponent<HeadingPortfolioProps> = (props) => {
  return (
    <section className={twclsx('pb-2')}>
      <CategoryLabel label={props.category} className={'my-2'} />
      <h1 className={twclsx('mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white')}>
        {props.title.split('').map((c, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <span key={i}>{c}</span>
        ))}
      </h1>
      {/*<p className={twclsx('w-full my-8 font-medium text-gray-600 dark:text-gray-400 italic')}>{props.summary}</p>*/}

      <div className={twclsx('mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center')}>
        <div className='flex items-center'>
          <NextImage
            src='https://ik.imagekit.io/8ieg70pvks/profile?tr=w-400,h-400'
            alt='Ahnaf An Nafee'
            height={24}
            width={24}
            sizes='20vw'
            className='rounded-full'
          />
          <p className='ml-2 text-sm text-gray-700 dark:text-gray-300'>
            {'Ahnaf An Nafee / '}
            {format(new Date(props.date), 'MMMM dd, yyyy')}
          </p>
        </div>

        <div className={'mt-4 flex flex-wrap items-center justify-end gap-2 md:mt-0'}>
          {props.link.appStore && (
            <UnstyledLink
              href={props.link.appStore}
              className={twclsx(
                'flex max-w-max items-center justify-start gap-1',
                'gap-2 py-1',
                'text-theme-700 dark:text-theme-200',
                'relative inline-flex items-center',
                'text-primary-700 dark:text-primary-400 font-semibold'
              )}
            >
              <SiApple className={twclsx('text-lg md:text-xl', 'text-theme-800 dark:text-theme-200')} />
              <span className={twclsx('text-sm md:text-base')}>App Store</span>
            </UnstyledLink>
          )}

          {props.link.playStore && (
            <UnstyledLink
              href={props.link.playStore}
              className={twclsx(
                'flex max-w-max items-center justify-start gap-1',
                'gap-2 py-1',
                'text-theme-700 dark:text-theme-200',
                'relative inline-flex items-center',
                'text-primary-700 dark:text-primary-400 font-semibold'
              )}
            >
              <SiGoogleplay className={twclsx('text-lg md:text-xl', 'text-theme-800 dark:text-theme-200')} />
              <span className={twclsx('text-sm md:text-base')}>Play Store</span>
            </UnstyledLink>
          )}

          {props.link.live && (
            <UnstyledLink
              href={props.link.live}
              className={twclsx(
                'flex max-w-max items-center justify-start gap-1',
                'gap-2 py-1',
                'text-theme-700 dark:text-theme-200',
                'relative inline-flex items-center',
                'text-primary-700 dark:text-primary-400 font-semibold'
              )}
            >
              <HiGlobeAlt className={twclsx('text-lg md:text-xl', 'text-theme-800 dark:text-theme-200')} />
              <span className={twclsx('text-sm md:text-base')}>Website</span>
            </UnstyledLink>
          )}

          {props.link.github && (
            <UnstyledLink
              href={props.link.github}
              className={twclsx(
                'flex max-w-max items-center justify-start gap-1',
                'gap-2 py-1',
                'text-theme-700 dark:text-theme-200',
                'relative inline-flex items-center',
                'text-primary-700 dark:text-primary-400 font-semibold'
              )}
            >
              <SiGithub className={twclsx('text-lg md:text-xl', 'text-theme-800 dark:text-theme-200')} />
              <span className={twclsx('text-sm md:text-base')}>Repository</span>
            </UnstyledLink>
          )}
        </div>
      </div>

      <hr className='mt-8 mb-2 w-full border-1 border-gray-200 dark:border-gray-800' />
    </section>
  )
}

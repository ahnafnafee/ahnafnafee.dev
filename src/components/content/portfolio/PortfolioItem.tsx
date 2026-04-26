import { WrappedImage } from '@/components/legacy-ui/images'

import { UnstyledLink } from '@/UI/links'

import { createUrl, twclsx } from '@/libs'

import { CategoryLabel } from './CategoryLabel'
import { IconStack } from './IconStack'

import type { Portfolio } from 'me'

export const PortfolioItem: React.FunctionComponent<Portfolio> = (props) => {
  const urlPortfolio = createUrl(`/portfolio/${props.slug}`)

  return (
    <div key={props.slug} className='group flex flex-col'>
      <a
        href={urlPortfolio}
        className={twclsx(
          'relative overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105 dark:bg-gray-800'
        )}
      >
        <WrappedImage
          src={props.image + '&tr=w-400'}
          alt={props.title}
          className='w-full rounded-lg object-cover'
          parentStyle='w-full h-44 rounded-lg'
          placeholder='blur'
          blurDataURL='/blur.svg'
          fill
        />
      </a>
      <div className='mt-3'>
        <CategoryLabel label={props.category} />
        <h3>
          <UnstyledLink
            href={urlPortfolio}
            className='dark:from-primary-500 dark:to-ternary-500 bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_6px] hover:bg-[length:100%_2px]'
          >
            {props.title}
          </UnstyledLink>
        </h3>

        {(props.stack.length ?? 0) > 0 && (
          <div className='mt-1.5 mb-3 flex flex-shrink flex-wrap items-center space-x-2.5'>
            {props.stack.map((stack) => (
              <IconStack type={stack} key={stack} />
            ))}
          </div>
        )}
        <p className='max-w-prose text-gray-600 dark:text-gray-300'>{props.summary}</p>
      </div>
    </div>
  )
}

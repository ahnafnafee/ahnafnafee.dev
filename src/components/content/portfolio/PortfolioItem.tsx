import { WrappedImage } from '@/components/UI/images'

import { UnstyledLink } from '@/UI/links'

import { twclsx } from '@/libs'

import { CategoryLabel } from './CategoryLabel'
import { IconStack } from './IconStack'

import type { Portfolio } from 'me'

export const PortfolioItem: React.FunctionComponent<Portfolio> = (props) => {
  const urlPortfolio = `/portfolio/${props.slug}`

  return (
    <div key={props.slug} className='group flex flex-col'>
      <a
        href={urlPortfolio}
        className={twclsx(
          'relative overflow-hidden transition-all bg-gray-100 rounded-md dark:bg-gray-800 hover:scale-105'
        )}
      >
        <WrappedImage
          src={props.image}
          alt={props.title}
          className='w-full object-cover rounded-lg'
          parentStyle='w-full h-44 rounded-lg'
          loading='lazy'
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
            className='bg-gradient-to-r from-green-200 to-green-100 dark:from-primary-500 dark:to-ternary-500
          bg-[length:0px_6px]
          bg-left-bottom
          bg-no-repeat
          transition-[background-size]
          duration-500
          hover:bg-[length:100%_2px] group-hover:bg-[length:100%_6px]'
          >
            {props.title}
          </UnstyledLink>
        </h3>

        {(props.stack.length ?? 0) > 0 && (
          <div className='flex items-center space-x-2.5 mt-1.5 mb-3 flex-wrap flex-shrink'>
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

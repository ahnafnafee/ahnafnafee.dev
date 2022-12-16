import { UnderlineLink } from '@/UI/links'

import { PortfolioItem } from './PortfolioItem'

import htmr from 'htmr'
import { Portfolio } from 'me'

type PortfolioListProps = {
  title: string
  portfolios: Portfolio[]
  description: string
}

export const PortfolioList: React.FunctionComponent<PortfolioListProps> = (props) => {
  return (
    <section className='pt-8 pb-4'>
      <h3 className='mb-1 md:mb-3 font-bold text-2xl tracking-tight text-black dark:text-white'>{props.title}</h3>
      <p className='mb-6 md:mb-8 text-gray-600 dark:text-gray-400'>
        {htmr(props.description, {
          transform: {
            a: (props) => (
              <UnderlineLink className={'border-0'} href={props.href ?? ''}>
                {props.children}
              </UnderlineLink>
            )
          }
        })}
      </p>

      {(props.portfolios.length ?? 0) > 0 && (
        <div className='grid md:grid-cols-2 gap-5'>
          {props.portfolios.map((item) => {
            return <PortfolioItem key={item.slug} {...item} />
          })}
        </div>
      )}
    </section>
  )
}

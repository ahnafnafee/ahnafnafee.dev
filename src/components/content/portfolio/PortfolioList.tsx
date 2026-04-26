import { UnderlineLink } from '@/UI/links'

import htmr from '@/libs/htmr-replacement'

import { PortfolioItem } from './PortfolioItem'

import { Portfolio } from 'me'

type PortfolioListProps = {
  title: string
  portfolios: Portfolio[]
  description: string
}

export const PortfolioList: React.FunctionComponent<PortfolioListProps> = (props) => {
  return (
    <section className='pt-8 pb-4'>
      <h3 className='mb-1 text-2xl font-bold tracking-tight text-black md:mb-3 dark:text-white'>{props.title}</h3>
      <p className='mb-6 text-gray-600 md:mb-8 dark:text-gray-400'>
        {htmr(props.description, {
          transform: {
            a: (linkProps: any) => (
              <UnderlineLink className={'border-0'} href={linkProps.href ?? ''}>
                {linkProps.children}
              </UnderlineLink>
            )
          }
        })}
      </p>

      {(props.portfolios.length ?? 0) > 0 && (
        <div className='grid gap-5 md:grid-cols-2'>
          {props.portfolios.map((item) => {
            return <PortfolioItem key={item.slug} {...item} />
          })}
        </div>
      )}
    </section>
  )
}

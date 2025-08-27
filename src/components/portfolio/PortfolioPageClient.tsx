'use client'

import { PortfolioList } from '@/components/content/portfolio/PortfolioList'
import { EmptyResult } from '@/UI/common'
import { Searchbar } from '@/UI/inputs'
import { Hero } from '@/UI/templates'
import { twclsx } from '@/libs/twclsx'
import { useSearchPortfolio } from '@/hooks'
import type { Portfolio } from 'me'

type PortfolioPageClientProps = {
  portfolios: Array<Portfolio>
  softwarePortfolios: Array<Portfolio>
  gamePortfolios: Array<Portfolio>
}

export function PortfolioPageClient({ portfolios, softwarePortfolios, gamePortfolios }: PortfolioPageClientProps) {
  const search = useSearchPortfolio(portfolios)

  return (
    <>
      <Hero
        title='Portfolio - Ahnaf An Nafee'
        description="Here is a selection of my personal works. I'm always open to feedback and opportunities to collaborate!"
      />
      <Searchbar onChange={search.handleChange} value={search.query} />

      <div className={twclsx('flex flex-col gap-8')}>
        {search.query === '' && portfolios.length > 0 && (
          <PortfolioList
            description="I've put together a portfolio of my personal work. You're welcome to take a look and explore. Some of the portfolios even have website demos that you can try out if you'd like."
            portfolios={softwarePortfolios}
            title='Software Portfolio'
          />
        )}

        {search.query === '' && portfolios.length > 0 && (
          <PortfolioList
            description="I've put together a portfolio of game projects over the years. Some of the portfolios even have website demos that you can try out if you'd like."
            portfolios={gamePortfolios}
            title='Game Portfolio'
          />
        )}

        {search.query !== '' && search.filteredPortfolio.length > 0 && (
          <PortfolioList
            description="I've found some possible results for your search."
            portfolios={search.filteredPortfolio}
            title='Search Portfolio'
          />
        )}

        {search.query !== '' && search.filteredPortfolio.length === 0 && <EmptyResult />}
      </div>
    </>
  )
}

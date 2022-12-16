import { PortfolioList } from '@/components/content/portfolio/PortfolioList'

import { EmptyResult } from '@/UI/common'
import { Searchbar } from '@/UI/inputs'
import { Hero, LayoutPage } from '@/UI/templates'
import type { LayoutPageProps } from '@/UI/templates'

import { getContents } from '@/services'

import { generateOgImage, getMetaPage } from '@/libs/metapage'
import { getNewestPortfolio } from '@/libs/sorters'
import { twclsx } from '@/libs/twclsx'

import { useSearchPortfolio } from '@/hooks'

import type { Portfolio } from 'me'
import type { GetStaticProps, NextPage } from 'next'

type PortfoliopageProps = {
  portfolios: Array<Portfolio>
  softwarePortfolios: Array<Portfolio>
  gamePortfolios: Array<Portfolio>
}

const meta = getMetaPage({
  title: 'Portfolio',
  description: `Here is a selection of my personal works. I'm always open to feedback and opportunities to collaborate!`,
  keywords: ['ahnafnafee portfolio', 'Ahnaf An Nafee portfolio', 'ahnafnafee.dev', 'resume'],
  og_image: generateOgImage({ title: 'Portfolio - ahnafnafee.dev', subTitle: 'Take a look at my personal portfolio' }),
  og_image_alt: 'Portfolio — ahnafnafee.dev',
  slug: '/portfolio',
  type: 'website'
})

const ProjectPage: NextPage<PortfoliopageProps> = ({ portfolios, softwarePortfolios, gamePortfolios }) => {
  const search = useSearchPortfolio(portfolios)

  return (
    <LayoutPage {...(meta as LayoutPageProps)}>
      <Hero title={meta.title as string} description={meta.description as string} />
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
    </LayoutPage>
  )
}

export const getStaticProps: GetStaticProps<PortfoliopageProps> = async () => {
  const response = await getContents<Portfolio>('/portfolio')

  const portfolios = response.map((d) => d.header).sort(getNewestPortfolio)

  const softwarePortfolios = response
    .map((p) => p.header)
    .filter((f) => f.category === 'software')
    .sort(getNewestPortfolio)

  const gamePortfolios = response
    .map((p) => p.header)
    .filter((f) => f.category !== 'software')
    .sort(getNewestPortfolio)

  return {
    props: {
      portfolios,
      softwarePortfolios,
      gamePortfolios
    }
  }
}

export default ProjectPage

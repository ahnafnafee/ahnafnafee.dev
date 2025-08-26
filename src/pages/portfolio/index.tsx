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

type PortfolioPageProps = {
  portfolios: Array<Portfolio>
  softwarePortfolios: Array<Portfolio>
  gamePortfolios: Array<Portfolio>
}

const meta = getMetaPage({
  title: 'Portfolio - Ahnaf An Nafee',
  description: `Here is a selection of my personal works. I'm always open to feedback and opportunities to collaborate!`,
  keywords: [
    'Ahnaf An Nafee portfolio',
    'ahnafnafee portfolio',
    'PhD AI 3D Graphics portfolio',
    'Computer Science PhD portfolio',
    'AI research projects',
    '3D Computer Graphics projects',
    'Machine Learning portfolio',
    'Computer Vision projects',
    'Generative AI projects',
    'Rendering Pipeline projects',
    'DevOps engineering portfolio',
    'Kubernetes projects',
    'OpenShift projects',
    'Cloud Infrastructure portfolio',
    'AWS cloud solutions',
    'Docker containerization',
    'CI/CD pipeline projects',
    'Infrastructure automation',
    'Game development portfolio',
    'Unity 3D projects',
    'Unreal Engine projects',
    '3D modeling projects',
    'Game engine development',
    'Interactive technology',
    'Software engineering portfolio',
    'Full stack development',
    'React Native apps',
    'Python projects',
    'Go programming projects',
    'Java applications',
    'Kotlin development',
    'Tech startup CTO experience',
    'Technical leadership portfolio',
    'George Mason University research',
    'GMU PhD projects',
    'Academic research portfolio',
    'Computer graphics research',
    'Human computer interaction',
    'Immersive technology projects',
    'Digital worlds development',
    'Research publications',
    'Open source contributions',
    'GitHub projects',
    'ahnafnafee.dev portfolio',
    'ahnafnafee GitHub'
  ],
  og_image: generateOgImage({
    title: 'Portfolio',
    subTitle: 'AI & 3D Graphics Projects | Machine Learning & Computer Vision'
  }),
  og_image_alt: 'Portfolio - Ahnaf An Nafee - AI & 3D Graphics Projects',
  slug: '/portfolio',
  type: 'website'
})

const ProjectPage: NextPage<PortfolioPageProps> = ({ portfolios, softwarePortfolios, gamePortfolios }) => {
  const search = useSearchPortfolio(portfolios)

  return (
    <LayoutPage {...meta}>
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

export const getStaticProps: GetStaticProps<PortfolioPageProps> = async () => {
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
    },
    revalidate: 10
  }
}

export default ProjectPage

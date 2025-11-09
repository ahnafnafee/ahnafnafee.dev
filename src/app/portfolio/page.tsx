import { PortfolioPageClient } from '@/components/portfolio/PortfolioPageClient'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { getContents } from '@/services'
import { generateOgImage } from '@/libs/metapage'
import { getNewestPortfolio } from '@/libs/sorters'
import type { Portfolio } from 'me'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio - Ahnaf An Nafee',
  description:
    "Here is a selection of my personal works. I'm always open to feedback and opportunities to collaborate!",
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
  openGraph: {
    title: 'Portfolio - Ahnaf An Nafee',
    description:
      "Here is a selection of my personal works. I'm always open to feedback and opportunities to collaborate!",
    url: 'https://www.ahnafnafee.dev/portfolio',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: generateOgImage({
          title: 'Portfolio',
          subTitle: 'AI & 3D Graphics Projects | Machine Learning & Computer Vision'
        }),
        width: 1200,
        height: 600,
        alt: 'Portfolio - Ahnaf An Nafee - AI & 3D Graphics Projects'
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
        title: 'Portfolio',
        subTitle: 'AI & 3D Graphics Projects | Machine Learning & Computer Vision'
      })
    ]
  }
}

async function getPortfolioData() {
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
    portfolios,
    softwarePortfolios,
    gamePortfolios
  }
}

export default async function PortfolioPage() {
  const { portfolios, softwarePortfolios, gamePortfolios } = await getPortfolioData()

  return (
    <AppLayoutPage>
      <PortfolioPageClient
        portfolios={portfolios}
        softwarePortfolios={softwarePortfolios}
        gamePortfolios={gamePortfolios}
      />
    </AppLayoutPage>
  )
}

import { PortfolioPageClient } from '@/components/portfolio/PortfolioPageClient'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { getContents } from '@/services'
import { getNewestPortfolio } from '@/libs/sorters'
import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import type { Portfolio } from 'me'
import type { Metadata } from 'next'

const PORTFOLIO_URL = `${SITE_URL}/portfolio`
const PORTFOLIO_OG_IMAGE = 'https://ik.imagekit.io/8ieg70pvks/ahnafnafee-portfolio.png?tr=w-1200,h-630'
const PORTFOLIO_OG_ALT = `Portfolio - ${SITE_NAME} - AI & 3D Graphics Projects`

export const metadata: Metadata = {
  title: `Portfolio - ${SITE_NAME}`,
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
  alternates: {
    canonical: PORTFOLIO_URL
  },
  openGraph: {
    title: `Portfolio - ${SITE_NAME}`,
    description:
      "Here is a selection of my personal works. I'm always open to feedback and opportunities to collaborate!",
    url: PORTFOLIO_URL,
    siteName: SITE_NAME,
    images: [
      { url: PORTFOLIO_OG_IMAGE, width: 1200, height: 630, alt: PORTFOLIO_OG_ALT, type: 'image/png' }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Portfolio - ${SITE_NAME}`,
    description:
      "Here is a selection of my personal works. I'm always open to feedback and opportunities to collaborate!",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [{ url: PORTFOLIO_OG_IMAGE, alt: PORTFOLIO_OG_ALT }]
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

  // Breadcrumb structured data for search engines
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: PORTFOLIO_URL }
    ]
  }

  return (
    <AppLayoutPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PortfolioPageClient
        portfolios={portfolios}
        softwarePortfolios={softwarePortfolios}
        gamePortfolios={gamePortfolios}
      />
    </AppLayoutPage>
  )
}

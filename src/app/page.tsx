import { ContentImage } from '@/components/content'
import { BlogItem } from '@/components/content/blog/BlogItem'
import { NewsTimeline } from '@/components/content/news'
import { PortfolioList } from '@/components/content/portfolio/PortfolioList'
import { ResearchItem } from '@/components/content/research/ResearchItem'
import { TeachingSection } from '@/components/content/teaching'
import { Footer, SocialHome } from '@/components/site/common'

import { getContents } from '@/services'
import { getContentHeaders } from '@/services/content'
import { getViewsBatch } from '@/services/pageviews'

import { SITE_AUTHOR, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'
import { getPersonNode } from '@/libs/seo/personSchema'
import { getNewestBlog, getNewestPortfolio, getNewestResearch } from '@/libs/sorters'

import { NEWS } from '@/data/news'

import type { Blog, Portfolio, Research } from 'me'
import type { Metadata } from 'next'
import Link from 'next/link'
import readingTime from 'reading-time'

const HOME_OG_IMAGE = generateOgImage({
  title: 'Ahnaf An Nafee',
  subTitle: 'PhD Student exploring AI for 3D content creation and immersive experiences',
  type: 'home'
})
const HOME_OG_ALT = `${SITE_NAME} - PhD Student in AI & 3D Graphics at George Mason University | DCXR Lab`
const HOME_TITLE = `${SITE_NAME} - PhD Student in AI & 3D Graphics | DCXR Lab @ GMU`

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: HOME_TITLE,
  inLanguage: 'en-US',
  dateCreated: '2022-12-08T00:00:00-05:00',
  dateModified: new Date().toISOString(),
  isPartOf: { '@type': 'WebSite', url: SITE_URL },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: HOME_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: HOME_OG_ALT
  },
  mainEntity: getPersonNode()
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description:
    'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics. DCXR Lab, advised by Dr. Craig Yu.',
  applicationName: `${SITE_NAME} Portfolio`,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-US': SITE_URL,
      'x-default': SITE_URL
    },
    types: {
      'application/rss+xml': [
        { url: `${SITE_URL}/rss.xml`, title: `${SITE_NAME} — Blog (RSS)` },
        { url: `${SITE_URL}/rss-full.xml`, title: `${SITE_NAME} — Blog (Full RSS)` }
      ]
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: '95f162fe4bdc4ae6a3d9a4acad910d6d',
    yandex: '4085f4892e0b1a1e'
  },
  other: {
    'application/ld+json': JSON.stringify(structuredData)
  },
  keywords: [
    'Ahnaf An Nafee',
    'ahnafnafee',
    'PhD AI 3D Graphics',
    'AI 3D Graphics Research',
    'Machine Learning Graphics',
    'Computer Science PhD GMU',
    'George Mason University PhD',
    'DCXR Lab',
    'Dr. Craig Yu',
    'AI-driven 3D content generation',
    'Machine learning for graphics pipelines',
    'UV mapping automation',
    'NPR techniques',
    'AI researcher',
    'Computer graphics researcher',
    '3D Computer Graphics',
    'Generative AI',
    'Deep Learning',
    'Computer Vision',
    'Neural Networks',
    'PyTorch',
    'TensorFlow',
    'Rendering Pipelines',
    'Real-time Rendering',
    'Parameterized Shaders',
    'GLSL',
    'WebGL',
    'Human Computer Interaction',
    'Immersive Technology',
    'Extended Reality',
    'XR Research',
    'Game Development',
    'Unity 3D',
    'Unreal Engine',
    'Game Engine Development',
    'Technical Artist',
    'Graphics Programming',
    'Shader Programming',
    'AI Graphics Intersection',
    'Creative AI',
    'Procedural Generation',
    'Academic Research',
    'PhD Researcher',
    'Research Portfolio',
    'Ex-CTO',
    'Tech Startup',
    'Software Engineering',
    'Python Developer',
    'C++ Developer',
    'Full Stack Developer'
  ],
  openGraph: {
    title: HOME_TITLE,
    description:
      'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: HOME_OG_IMAGE, width: 1200, height: 630, alt: HOME_OG_ALT, type: 'image/png' }],
    locale: 'en_US',
    type: 'profile',
    firstName: 'Ahnaf',
    lastName: 'Nafee',
    username: SITE_AUTHOR.githubUsername,
    emails: [SITE_AUTHOR.email]
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description:
      'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [{ url: HOME_OG_IMAGE, alt: HOME_OG_ALT }]
  }
}

async function getLatestBlog() {
  try {
    const blogs = await getContents<Blog>('/blog')
    const sorted = blogs.sort((a, b) => getNewestBlog(a.header, b.header))
    const latest = sorted[0]
    if (!latest) return null

    return {
      ...latest.header,
      est_read: readingTime(latest.content).text
    } as Blog
  } catch (error) {
    console.warn('Failed to load blog:', error)
    return null
  }
}

async function getPortfolios() {
  try {
    const portfolios = await getContents<Portfolio>('/portfolio')
    return portfolios
      .map((p) => p.header)
      .filter((f) => f.featured)
      .sort(getNewestPortfolio)
  } catch (error) {
    console.warn('Failed to load portfolios:', error)
    return []
  }
}

async function getFeaturedResearch(): Promise<Research[]> {
  try {
    const entries = await getContentHeaders<Research>('/research')
    return entries
      .map((r) => r.header)
      .filter((r) => r.featured)
      .sort(getNewestResearch)
  } catch (error) {
    console.warn('Failed to load research:', error)
    return []
  }
}

export default async function HomePage() {
  const [portfolios, latestBlog, featuredResearch] = await Promise.all([
    getPortfolios(),
    getLatestBlog(),
    getFeaturedResearch()
  ])

  // One batch DB read for every slug rendered on the home page. Direct
  // service call (no HTTP round-trip) so it works in dev without a public
  // SITE_URL and skips the JSON serialization overhead.
  const homeSlugs = [
    ...(latestBlog ? [latestBlog.slug] : []),
    ...featuredResearch.slice(0, 2).map((r) => r.slug),
    ...portfolios.map((p) => p.slug)
  ]
  const homeViews = await getViewsBatch(homeSlugs)
  const latestBlogWithViews = latestBlog ? { ...latestBlog, views: homeViews[latestBlog.slug] ?? 0 } : null
  const featuredResearchWithViews = featuredResearch.map((r) => ({ ...r, views: homeViews[r.slug] ?? 0 }))
  const portfoliosWithViews = portfolios.map((p) => ({ ...p, views: homeViews[p.slug] ?? 0 }))

  return (
    <>
      <main className='layout' itemScope itemType='https://schema.org/ProfilePage'>
        <section className='flex flex-col' itemScope itemType='https://schema.org/Person' itemProp='mainEntity'>
          <div className='mt-3 flex flex-col-reverse items-start sm:flex-row md:mt-6'>
            <div className='flex flex-1 flex-col sm:pr-8'>
              <div className='mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-semibold tracking-[0.22em] text-gray-500 uppercase md:text-xs dark:text-gray-400'>
                <span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-purple-500' />
                <span>PhD Student</span>
                <span aria-hidden='true' className='text-gray-300 dark:text-gray-600'>
                  ·
                </span>
                <span>AI &amp; 3D Graphics</span>
                <span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-purple-500' />
              </div>
              <h1
                className='name-aberration mb-3 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl dark:from-primary-300 dark:via-purple-300 dark:to-pink-300'
                itemProp='name'
              >
                Ahnaf <span className='whitespace-nowrap'>An Nafee</span>
              </h1>
              <h2 className='mb-4 text-base text-gray-700 md:text-lg dark:text-gray-200' itemProp='jobTitle'>
                PhD Student @{' '}
                <span
                  className='font-semibold'
                  itemProp='affiliation'
                  itemScope
                  itemType='https://schema.org/Organization'
                >
                  <span itemProp='name'>GMU DCXR Lab</span>
                </span>{' '}
                · Ex-CTO
              </h2>
            </div>
            <div className='mb-8 flex-shrink-0 sm:mb-0 sm:ml-8'>
              <ContentImage
                src='https://ik.imagekit.io/8ieg70pvks/profile?tr=w-400,h-400'
                alt='Ahnaf An Nafee - PhD Student in AI and 3D Graphics at George Mason University'
                width={176}
                height={176}
                className='border-theme-100 dark:border-theme-800 h-[100px] w-[100px] cursor-pointer rounded-full border-4 object-cover sm:h-[176px] sm:w-[176px]'
                title="Ahnaf An Nafee's Profile Picture"
                itemProp='image'
                quality={100}
                sizes='(max-width: 640px) 100px, 176px'
                priority
                placeholder='blur'
                blurDataURL='https://ik.imagekit.io/8ieg70pvks/profile?tr=bl-6'
              />
            </div>
          </div>

          <p className='mt-2 max-w-2xl text-base leading-7 text-gray-700 md:text-lg md:leading-8 dark:text-gray-300'>
            I work at the intersection of{' '}
            <strong className='text-gray-900 dark:text-gray-100'>AI and 3D computer graphics</strong> in the{' '}
            <a
              href='https://craigyuyu.github.io/home/group.html'
              target='_blank'
              rel='noopener noreferrer'
              className='font-semibold text-link'
            >
              DCXR Lab
            </a>{' '}
            with Dr. Craig Yu — building systems that change how we create and inhabit immersive digital worlds. Before
            grad school, I led engineering as CTO of a tech startup.
          </p>

          <SocialHome className='mt-6 mb-8 flex-shrink flex-wrap gap-3 self-start' />
        </section>

        {NEWS.length > 0 && (
          <section className='border-t border-gray-200 pt-8 pb-4 dark:border-gray-800'>
            <h3 className='mb-1 text-2xl font-bold tracking-tight text-black md:mb-3 dark:text-white'>News</h3>
            <p className='mb-6 text-gray-600 md:mb-8 dark:text-gray-400'>
              Recent updates from the lab and the rest of the trail.{' '}
              <Link href='/research#news' className='text-link'>
                See full timeline
              </Link>
            </p>
            <NewsTimeline items={NEWS} showHeading={false} className='mb-8' />
          </section>
        )}

        {latestBlogWithViews && (
          <section className='border-t border-gray-200 pt-8 pb-4 dark:border-gray-800'>
            <h3 className='mb-1 text-2xl font-bold tracking-tight text-black md:mb-3 dark:text-white'>Latest Blog</h3>
            <p className='mb-6 text-gray-600 md:mb-8 dark:text-gray-400'>
              Fresh thoughts on AI, graphics, and tech.{' '}
              <Link href='/blog' className='text-link'>
                Read all blogs
              </Link>
            </p>
            <BlogItem {...latestBlogWithViews} displayViews />
          </section>
        )}

        {featuredResearchWithViews.length > 0 && (
          <section className='border-t border-gray-200 pt-8 pb-4 dark:border-gray-800'>
            <h3 className='mb-1 text-2xl font-bold tracking-tight text-black md:mb-3 dark:text-white'>
              Featured Research
            </h3>
            <p className='mb-6 text-gray-600 md:mb-8 dark:text-gray-400'>
              Papers and projects at the intersection of AI and 3D computer graphics.{' '}
              <Link href='/research' className='text-link'>
                View all research
              </Link>
            </p>
            <div className='flex flex-col'>
              {featuredResearchWithViews.slice(0, 2).map((entry, i) => (
                <ResearchItem key={entry.slug} {...entry} priority={i === 0} />
              ))}
            </div>
          </section>
        )}

        <TeachingSection />

        <PortfolioList
          description={`Check out my featured portfolio. View all my works <a href="/portfolio">here</a>!`}
          title='Featured Portfolio'
          portfolios={portfoliosWithViews}
        />
      </main>

      <Footer />
    </>
  )
}

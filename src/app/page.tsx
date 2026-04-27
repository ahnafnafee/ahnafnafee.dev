import { ContentImage } from '@/components/content'
import { BlogItem } from '@/components/content/blog/BlogItem'
import { PortfolioList } from '@/components/content/portfolio/PortfolioList'
import { ResearchItem } from '@/components/content/research/ResearchItem'
import { Footer, SocialHome } from '@/components/site/common'

import { getContents } from '@/services'
import { getContentHeaders } from '@/services/content'

import { SITE_AUTHOR, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'
import { getPersonNode } from '@/libs/seo/personSchema'
import { getNewestBlog, getNewestPortfolio, getNewestResearch } from '@/libs/sorters'

import type { Blog, Portfolio, Research } from 'me'
import type { Metadata } from 'next'
import Link from 'next/link'
import readingTime from 'reading-time'

const HOME_OG_IMAGE = generateOgImage({ title: 'home' })
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

  return (
    <>
      <main className='layout' itemScope itemType='https://schema.org/ProfilePage'>
        <section className='flex flex-col' itemScope itemType='https://schema.org/Person' itemProp='mainEntity'>
          <div className='mt-3 flex flex-col-reverse items-start sm:flex-row md:mt-6'>
            <div className='flex flex-1 flex-col sm:pr-8'>
              <h1
                className='mb-1 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white'
                itemProp='name'
              >
                Ahnaf An Nafee
              </h1>
              <br />
              <h2 className='mb-4 text-base text-gray-700 dark:text-gray-200' itemProp='jobTitle'>
                PhD Student in AI & 3D Graphics @{' '}
                <span
                  className='font-semibold'
                  itemProp='affiliation'
                  itemScope
                  itemType='https://schema.org/Organization'
                >
                  <span itemProp='name'>GMU</span>
                </span>{' '}
                | DCXR Lab | Ex-CTO
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

          <div className='mt-4 space-y-4 text-gray-600 dark:text-gray-400'>
            <p className='text-lg text-gray-700 dark:text-gray-300'>
              I&apos;m a PhD student at George Mason University&apos;s{' '}
              <a
                href='https://craigyuyu.github.io/home/group.html'
                target='_blank'
                rel='noopener noreferrer'
                className='font-semibold text-purple-600 hover:underline dark:text-purple-400'
              >
                DCXR Lab
              </a>
              , advised by Dr. Craig Yu. My research sits at the intersection of{' '}
              <strong>AI and 3D computer graphics</strong> - exploring how machine learning can transform how we create,
              interact with, and experience immersive digital worlds.
            </p>

            <p>
              Before diving into research, I co-founded a tech startup as CTO, where I learned that the best ideas mean
              nothing without execution. That experience shapes how I approach research: I build systems that work, not
              just papers that publish.
            </p>

            <div className='rounded-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 p-4 dark:from-gray-800 dark:to-gray-800'>
              <p className='mb-2 font-semibold text-gray-800 dark:text-gray-200'>Research Focus:</p>
              <ul className='space-y-1 text-sm text-gray-700 dark:text-gray-300'>
                <li>
                  <strong>AI-driven creative workflows</strong> for 3D content generation
                </li>
                <li>
                  <strong>Machine learning for graphics pipelines</strong> - automating UV mapping, NPR techniques, and
                  modeling workflows
                </li>
                <li>
                  <strong>Human-computer interaction</strong> in immersive environments
                </li>
              </ul>
            </div>

            <p className='text-sm italic'>
              Always open to collaborations with researchers and industry partners pushing the boundaries of AI and
              graphics.
            </p>
          </div>

          <SocialHome className='mt-6 mb-8 flex-shrink flex-wrap gap-3 self-start' />
        </section>

        {latestBlog && (
          <section className='border-t border-gray-200 pt-8 pb-4 dark:border-gray-800'>
            <h3 className='mb-1 text-2xl font-bold tracking-tight text-black md:mb-3 dark:text-white'>Latest Blog</h3>
            <p className='mb-6 text-gray-600 md:mb-8 dark:text-gray-400'>
              Fresh thoughts on AI, graphics, and tech.{' '}
              <Link href='/blog' className='text-purple-600 hover:underline dark:text-purple-400'>
                Read all blogs
              </Link>
            </p>
            <BlogItem {...latestBlog} />
          </section>
        )}

        {featuredResearch.length > 0 && (
          <section className='border-t border-gray-200 pt-8 pb-4 dark:border-gray-800'>
            <h3 className='mb-1 text-2xl font-bold tracking-tight text-black md:mb-3 dark:text-white'>
              Featured Research
            </h3>
            <p className='mb-6 text-gray-600 md:mb-8 dark:text-gray-400'>
              Papers and projects at the intersection of AI and 3D computer graphics.{' '}
              <Link href='/research' className='text-purple-600 hover:underline dark:text-purple-400'>
                View all research
              </Link>
            </p>
            <div className='flex flex-col'>
              {featuredResearch.slice(0, 2).map((entry, i) => (
                <ResearchItem key={entry.slug} {...entry} priority={i === 0} />
              ))}
            </div>
          </section>
        )}

        <PortfolioList
          description={`Check out my featured portfolio. View all my works <a href="/portfolio">here</a>!`}
          title='Featured Portfolio'
          portfolios={portfolios}
        />
      </main>

      <Footer />
    </>
  )
}

import { CustomSeo } from '@/components'
import { Footer, SocialHome } from '@/components/UI/common'
import { ContentImage } from '@/components/content'
import { PortfolioList } from '@/components/content/portfolio/PortfolioList'

import { GetContents, getContents } from '@/services'

import { generateOgImage, getMetaPage } from '@/libs/metapage'
import { getNewestPortfolio } from '@/libs/sorters'
import { SpeedInsights } from '@vercel/speed-insights/next'

import Head from 'next/head'
import type { Portfolio } from 'me'
import type { GetStaticProps, NextPage } from 'next'

interface HomePageProps {
  portfolios: Array<Portfolio>
}

const HomePage: NextPage<HomePageProps> = ({ portfolios }) => {
  const meta = getMetaPage({
    title: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics | Scaling Immersive Worlds',
    template:
      'PhD Student in AI & 3D Graphics @ GMU | Scaling Immersive Worlds with Kubernetes & Cloud Infrastructure | Ex-CTO',
    description: `🚀 PhD Student in AI & 3D Graphics @ George Mason University. I operate at the intersection of AI 🧠, 3D Computer Graphics 🌐, and scalable Cloud Infrastructure ☁️. Building the next generation of intuitive and immersive ways for humans to interact with digital worlds. Ex-CTO with expertise in DevOps, Kubernetes, OpenShift, and AWS.`,
    keywords: [
      'Ahnaf An Nafee',
      'ahnafnafee',
      'PhD AI 3D Graphics',
      'Computer Science PhD',
      'George Mason University',
      'GMU PhD Student',
      'AI Research',
      '3D Computer Graphics',
      'Machine Learning',
      'DevOps Engineer',
      'Kubernetes Expert',
      'OpenShift',
      'Cloud Infrastructure',
      'AWS Certified',
      'Generative AI',
      'Rendering Pipelines',
      'Parameterized Shaders',
      'Game Development',
      'Unity Expert',
      'Unreal Engine',
      'Technical Leadership',
      'CTO Experience',
      'Startup Founder',
      'Software Engineering',
      'Python Developer',
      'Go Developer',
      'React Developer',
      'AI Researcher',
      'Computer Graphics Researcher',
      'Immersive Technology',
      'Human Computer Interaction',
      'Digital Worlds',
      'Interactive Technology',
      'Research Publications',
      'Academic Research',
      'PhD Researcher',
      'AI Graphics',
      'Computer Vision',
      'Deep Learning',
      'Neural Networks',
      'Cloud Computing',
      'Infrastructure Automation',
      'CI/CD',
      'Docker',
      'Terraform',
      'Jenkins'
    ],
    og_image: generateOgImage({
      title: 'Ahnaf An Nafee',
      subTitle: 'PhD Student in AI & 3D Graphics | Building Immersive Worlds'
    }),
    og_image_alt:
      'Ahnaf An Nafee - PhD Student in AI & 3D Graphics at George Mason University | Building Immersive Worlds',
    slug: '/',
    type: 'website'
  })

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Researcher'],
    name: 'Ahnaf An Nafee',
    url: 'https://www.ahnafnafee.dev',
    image: 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-400,h-400',
    sameAs: [
      'https://www.linkedin.com/in/ahnafnafee',
      'https://github.com/ahnafnafee',
      'https://scholar.google.com/citations?user=ahnafnafee',
      'https://orcid.org/0009-0000-9363-4536'
    ],
    jobTitle: 'PhD Student in Computer Science',
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Computer Science Researcher',
      occupationLocation: {
        '@type': 'Place',
        name: 'George Mason University, Fairfax, VA'
      },
      skills: [
        'Artificial Intelligence',
        '3D Computer Graphics',
        'Machine Learning',
        'DevOps Engineering',
        'Cloud Infrastructure',
        'Kubernetes',
        'Research & Development'
      ]
    },
    worksFor: {
      '@type': 'Organization',
      name: 'George Mason University',
      url: 'https://www.gmu.edu',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Fairfax',
        addressRegion: 'VA',
        addressCountry: 'US'
      }
    },
    alumniOf: [
      {
        '@type': 'Organization',
        name: 'George Mason University',
        url: 'https://www.gmu.edu'
      },
      {
        '@type': 'Organization',
        name: 'Drexel University',
        url: 'https://drexel.edu'
      }
    ],
    knowsAbout: [
      'Artificial Intelligence',
      '3D Computer Graphics',
      'Generative AI',
      'Rendering Pipelines',
      'Parameterized Shaders',
      'DevOps Engineering',
      'Cloud Infrastructure',
      'Kubernetes',
      'OpenShift',
      'Amazon Web Services',
      'Machine Learning',
      'Computer Vision',
      'Game Development',
      'Software Engineering',
      'Technical Leadership',
      'Human Computer Interaction',
      'Immersive Technology'
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'PhD in Computer Science',
        educationalLevel: 'Doctoral',
        credentialCategory: 'degree',
        recognizedBy: {
          '@type': 'Organization',
          name: 'George Mason University'
        }
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'BS in Computer Science',
        educationalLevel: 'Bachelor',
        credentialCategory: 'degree',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Drexel University'
        }
      }
    ],
    description:
      '🚀 PhD Student in AI & 3D Graphics at George Mason University. I operate at the intersection of AI 🧠, 3D Computer Graphics 🌐, and scalable Cloud Infrastructure ☁️. Building the next generation of intuitive and immersive ways for humans to interact with digital worlds.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.ahnafnafee.dev'
    }
  }

  return (
    <>
      <Head>
        <script
          type='application/ld+json'
          // eslint-disable-next-line react/no-danger
          // biome-ignore lint/security/noDangerouslySetInnerHtml: no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <CustomSeo {...meta} />

      <main className='layout'>
        <section className='flex flex-col'>
          <div className='flex flex-col-reverse sm:flex-row items-start mt-3 md:mt-6'>
            <div className='flex flex-col sm:pr-8 flex-1'>
              <h1 className='font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white'>
                Ahnaf An Nafee
              </h1>
              <br />
              <h2 className='text-base text-gray-700 dark:text-gray-200 mb-4'>
                PhD Student in AI & 3D Graphics @ <span className='font-semibold'>GMU</span> | Building Immersive Worlds
                through Machine Learning & Computer Graphics | Ex-CTO
              </h2>
            </div>
            <div className='flex-shrink-0 mb-8 sm:mb-0 sm:ml-8'>
              <ContentImage
                src='https://ik.imagekit.io/8ieg70pvks/profile?tr=w-400,h-400'
                alt='Ahnaf An Nafee'
                width={176}
                height={176}
                className='rounded-full border-4 cursor-pointer border-theme-100 dark:border-theme-800 w-[100px] h-[100px] sm:w-[176px] sm:h-[176px] object-cover'
                title="Ahnaf An Nafee's Profile Picture"
                quality={100}
                sizes='(max-width: 640px) 100px, 176px'
                priority
                placeholder='blur'
                blurDataURL='https://ik.imagekit.io/8ieg70pvks/profile?tr=bl-6'
              />
            </div>
          </div>

          <div className='text-gray-600 dark:text-gray-400 space-y-4 mt-4'>
            <p>I operate at the intersection of two fascinating domains:</p>
            <ul className='ml-4 space-y-2 text-gray-700 dark:text-gray-200'>
              <li>
                • <strong>AI 🧠</strong> (Machine Learning, Deep Learning, Computer Vision)
              </li>
              <li>
                • <strong>3D Computer Graphics 🌐</strong> (Rendering, Shaders, Real-time Graphics)
              </li>
            </ul>
            <p>
              As a Computer Science PhD student at George Mason University, my research is driven by a central ambition:
              to build the next generation of intuitive and immersive ways for humans to interact with digital worlds.
            </p>

            <p>
              But I&apos;m not just a theorist. My journey into deep research began after my time as a co-founder and
              CTO of a tech startup. There, I led teams in building, launching, and scaling complex products from the
              ground up. That experience taught me a critical lesson: the most brilliant AI models are only as good as
              the infrastructure they run on. It gave me a deep, practical expertise in creating robust,
              production-ready systems.
            </p>

            <p>
              This unique background allows me to{' '}
              <strong>bridge the critical gap 🔗 between theory and practice</strong>. I don&apos;t just design novel AI
              and graphics concepts; I understand how to deploy and scale them efficiently using modern DevOps
              principles.
            </p>

            <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-primary-500'>
              <p className='font-semibold text-gray-800 dark:text-gray-200 mb-2'>My core areas of expertise include:</p>
              <ul className='space-y-1 text-sm'>
                <li>
                  <strong>🧠 AI & Machine Learning:</strong> Deep Learning, Computer Vision, Generative AI, Neural
                  Networks
                </li>
                <li>
                  <strong>🌐 3D Computer Graphics:</strong> Real-time Rendering, Shaders, Graphics Pipelines, Game
                  Engines
                </li>
                <li>
                  <strong>📈 Leadership:</strong> Technical Product Leadership, Research & Development, Team Building
                </li>
              </ul>
            </div>

            <p className='text-sm italic'>
              I&apos;m always eager to connect with fellow researchers, industry pioneers, and anyone passionate about
              building the future of interactive technology. Let&apos;s explore what&apos;s next, together! 🤝
            </p>
          </div>

          <SocialHome className='flex-shrink flex-wrap self-start gap-3 mt-6 mb-8' />
        </section>

        <PortfolioList
          description={`Check out my featured portfolio. View all my works <a href="/portfolio">here</a>!`}
          title='Featured Portfolio'
          portfolios={portfolios}
        />
      </main>

      <Footer />
      <SpeedInsights />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [requestPortfolios] = await Promise.allSettled([getContents<Portfolio>('/portfolio')])

  const portfoliosData = [] as Array<GetContents<Portfolio>>

  if (requestPortfolios.status === 'fulfilled') {
    requestPortfolios.value.forEach((portfolio) => {
      portfoliosData.push(portfolio)
    })
  }

  const portfolios = portfoliosData
    .map((p) => p.header)
    .filter((f) => f.featured)
    .sort(getNewestPortfolio)

  return {
    props: {
      portfolios
    }
  }
}

export default HomePage

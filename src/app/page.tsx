import { Footer, SocialHome } from '@/components/UI/common'
import { ContentImage } from '@/components/content'
import { PortfolioList } from '@/components/content/portfolio/PortfolioList'

import { getContents } from '@/services'
import { getNewestPortfolio } from '@/libs/sorters'

import type { Portfolio } from 'me'
import type { Metadata } from 'next'

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
    'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.ahnafnafee.dev'
  }
}

export const metadata: Metadata = {
  title: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics | DCXR Lab @ GMU',
  description:
    'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics. DCXR Lab, advised by Dr. Craig Yu.',
  other: {
    'application/ld+json': JSON.stringify(structuredData)
  },
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
  openGraph: {
    title: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics | DCXR Lab @ GMU',
    description:
      'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.',
    url: 'https://www.ahnafnafee.dev',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: `https://ik.imagekit.io/8ieg70pvks/site_og?ik-sdk-version=javascript-1.4.3&updatedAt=1670978636747`,
        width: 1200,
        height: 600,
        alt: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics at George Mason University | Building Immersive Worlds'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics | DCXR Lab @ GMU',
    description:
      'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [`https://ik.imagekit.io/8ieg70pvks/site_og?ik-sdk-version=javascript-1.4.3&updatedAt=1670978636747`]
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

export default async function HomePage() {
  const portfolios = await getPortfolios()

  return (
    <>
      <main className='layout'>
        <section className='flex flex-col'>
          <div className='flex flex-col-reverse sm:flex-row items-start mt-3 md:mt-6'>
            <div className='flex flex-col sm:pr-8 flex-1'>
              <h1 className='font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white'>
                Ahnaf An Nafee
              </h1>
              <br />
              <h2 className='text-base text-gray-700 dark:text-gray-200 mb-4'>
                PhD Student in AI & 3D Graphics @ <span className='font-semibold'>GMU</span> | DCXR Lab | Ex-CTO
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
            <p className='text-lg text-gray-700 dark:text-gray-300'>
              I&apos;m a PhD student at George Mason University&apos;s{' '}
              <a
                href='https://craigyuyu.github.io/home/group.html'
                target='_blank'
                rel='noopener noreferrer'
                className='text-purple-600 dark:text-purple-400 hover:underline font-semibold'
              >
                DCXR Lab
              </a>
              , advised by Dr. Craig Yu. My research sits at the intersection of{' '}
              <strong>AI and 3D computer graphics</strong>—exploring how machine learning can transform how we create,
              interact with, and experience immersive digital worlds.
            </p>

            <p>
              Before diving into research, I co-founded a tech startup as CTO, where I learned that the best ideas mean
              nothing without execution. That experience shapes how I approach research: I build systems that work, not
              just papers that publish.
            </p>

            <div className='bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 p-4 rounded-lg border-l-4 border-purple-500'>
              <p className='font-semibold text-gray-800 dark:text-gray-200 mb-2'>Research Focus:</p>
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

          <SocialHome className='flex-shrink flex-wrap self-start gap-3 mt-6 mb-8' />
        </section>

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

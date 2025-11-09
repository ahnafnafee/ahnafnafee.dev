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
  alternateName: 'ahnafnafee',
  url: 'https://www.ahnafnafee.dev',
  image: 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-400,h-400',
  sameAs: [
    'https://www.linkedin.com/in/ahnafnafee',
    'https://github.com/ahnafnafee',
    'https://scholar.google.com/citations?user=u15DO0cAAAAJ&hl=en',
    'https://orcid.org/0009-0000-9363-4536',
    'https://ahnafnafee.itch.io',
    'https://www.artstation.com/ahnafnafee',
    'https://www.behance.net/ahnafannafee'
  ],
  email: 'ahnafnafee@gmail.com',
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
    'Machine Learning for Graphics',
    'AI-driven 3D Content Generation',
    'Generative AI',
    'Computer Vision',
    'Deep Learning',
    'Neural Networks',
    'Rendering Pipelines',
    'Real-time Rendering',
    'Parameterized Shaders',
    'UV Mapping Automation',
    'NPR Techniques',
    'Human Computer Interaction',
    'Immersive Technology',
    'Extended Reality',
    'Game Development',
    'Unity Engine',
    'Unreal Engine',
    'WebGL',
    'GLSL',
    'Python Programming',
    'PyTorch',
    'TensorFlow',
    'Computer Graphics Research',
    'AI Research'
  ],
  researchInterests: [
    'AI-driven creative workflows for 3D content generation',
    'Machine learning for graphics pipelines',
    'Automating UV mapping and NPR techniques',
    'Human-computer interaction in immersive environments'
  ],
  affiliation: {
    '@type': 'Organization',
    name: 'DCXR Lab, George Mason University',
    url: 'https://craigyuyu.github.io/home/group.html'
  },
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
  metadataBase: new URL('https://www.ahnafnafee.dev'),
  title: {
    default: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics | DCXR Lab @ GMU',
    template: '%s | Ahnaf An Nafee'
  },
  description:
    'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics. DCXR Lab, advised by Dr. Craig Yu.',
  applicationName: 'Ahnaf An Nafee Portfolio',
  authors: [{ name: 'Ahnaf An Nafee', url: 'https://www.ahnafnafee.dev' }],
  creator: 'Ahnaf An Nafee',
  publisher: 'Ahnaf An Nafee',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: 'https://www.ahnafnafee.dev'
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code'
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
    title: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics | DCXR Lab @ GMU',
    description:
      'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.',
    url: 'https://www.ahnafnafee.dev',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: 'https://ik.imagekit.io/8ieg70pvks/site_og?ik-sdk-version=javascript-1.4.3&updatedAt=1670978636747',
        width: 1200,
        height: 600,
        alt: 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics at George Mason University | DCXR Lab',
        type: 'image/png'
      }
    ],
    locale: 'en_US',
    type: 'profile',
    firstName: 'Ahnaf',
    lastName: 'An Nafee',
    username: 'ahnafnafee',
    emails: ['ahnafnafee@gmail.com']
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
      <main className='layout' itemScope itemType='https://schema.org/ProfilePage'>
        <section className='flex flex-col' itemScope itemType='https://schema.org/Person'>
          <div className='flex flex-col-reverse sm:flex-row items-start mt-3 md:mt-6'>
            <div className='flex flex-col sm:pr-8 flex-1'>
              <h1
                className='font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white'
                itemProp='name'
              >
                Ahnaf An Nafee
              </h1>
              <br />
              <h2 className='text-base text-gray-700 dark:text-gray-200 mb-4' itemProp='jobTitle'>
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
            <div className='flex-shrink-0 mb-8 sm:mb-0 sm:ml-8'>
              <ContentImage
                src='https://ik.imagekit.io/8ieg70pvks/profile?tr=w-400,h-400'
                alt='Ahnaf An Nafee - PhD Student in AI and 3D Graphics at George Mason University'
                width={176}
                height={176}
                className='rounded-full border-4 cursor-pointer border-theme-100 dark:border-theme-800 w-[100px] h-[100px] sm:w-[176px] sm:h-[176px] object-cover'
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

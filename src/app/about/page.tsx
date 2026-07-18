import { generateOgImage } from '@/libs/metapage'

import type { Metadata } from 'next'
import Link from 'next/link'

const ABOUT_OG_IMAGE = generateOgImage({
  title: 'About',
  subTitle: 'Ahnaf An Nafee — PhD Student in AI & 3D Graphics',
  type: 'page'
})

export const metadata: Metadata = {
  title: 'About - Ahnaf An Nafee',
  description:
    'About Ahnaf An Nafee — PhD student in AI and 3D computer graphics at George Mason University, former startup CTO, and the person behind ahnafnafee.dev.',
  keywords: ['about ahnaf an nafee', 'ai researcher', '3d graphics', 'gmu phd', 'dcxr lab'],
  alternates: {
    canonical: 'https://www.ahnafnafee.dev/about'
  },
  openGraph: {
    title: 'About - Ahnaf An Nafee',
    description: 'PhD student in AI and 3D computer graphics, former startup CTO, and the person behind this site.',
    url: 'https://www.ahnafnafee.dev/about',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: ABOUT_OG_IMAGE,
        width: 1200,
        height: 600,
        alt: 'About - Ahnaf An Nafee'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Ahnaf An Nafee',
    description: 'PhD student in AI and 3D computer graphics, former startup CTO, and the person behind this site.',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [ABOUT_OG_IMAGE]
  }
}

export default function AboutPage() {
  return (
    <main className='layout'>
      <div className='mx-auto max-w-4xl py-8'>
        <h1 className='mb-8 text-3xl font-bold tracking-tight text-black md:text-4xl dark:text-white'>About</h1>

        <div className='prose prose-gray dark:prose-invert max-w-none'>
          <section className='mb-8'>
            <p className='mb-4'>
              I&rsquo;m Ahnaf An Nafee, a PhD student working at the intersection of{' '}
              <strong>artificial intelligence and 3D computer graphics</strong> in the DCXR Lab at George Mason
              University, advised by Dr. Craig Yu. My research looks at how machine learning can change the way we
              create and inhabit immersive digital worlds — from AI-driven 3D content generation to rendering pipelines
              and immersive XR.
            </p>
            <p className='mb-4'>
              Before graduate school I led engineering as the CTO of a technology startup, where I shipped production
              software across the full stack and managed a small team. That mix of research and real-world engineering
              shapes how I write and build: I care about ideas that actually run.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>What This Site Is</h2>
            <p className='mb-4'>This site is my portfolio and personal blog. It brings together three things:</p>
            <ul className='mb-4 list-disc pl-6'>
              <li>
                <Link href='/blog' className='text-primary-600 hover:text-primary-700'>
                  The blog
                </Link>{' '}
                — long-form, first-person write-ups on AI, 3D graphics, and software engineering: things I&rsquo;ve
                built, tools I&rsquo;ve shipped, and problems I&rsquo;ve worked through in detail.
              </li>
              <li>
                <Link href='/portfolio' className='text-primary-600 hover:text-primary-700'>
                  The portfolio
                </Link>{' '}
                — selected projects spanning games, developer tooling, mobile apps, and research prototypes.
              </li>
              <li>
                <Link href='/research' className='text-primary-600 hover:text-primary-700'>
                  Research
                </Link>{' '}
                — papers and projects in AI and 3D computer graphics.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>What I Write About</h2>
            <p className='mb-4'>
              Most posts here start from something I actually built and needed to understand well. Recurring themes
              include applied machine learning and local LLM workflows, 3D graphics and rendering, developer tools and
              automation, and the engineering trade-offs behind shipping software as a small team or a solo developer.
              Every post is original and written from firsthand experience.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Get in Touch</h2>
            <p className='mb-4'>
              You can read more about my background on my{' '}
              <Link href='/resume' className='text-primary-600 hover:text-primary-700'>
                resume
              </Link>
              , or reach me directly through the{' '}
              <Link href='/contact' className='text-primary-600 hover:text-primary-700'>
                contact page
              </Link>
              . I&rsquo;m always happy to talk about research, collaborations, or anything I&rsquo;ve written here.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

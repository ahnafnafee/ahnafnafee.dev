import { SnippetPageClient } from '@/components/snippet/SnippetPageClient'
import { Footer } from '@/UI/common'
import { getContents } from '@/services'
import { generateOgImage } from '@/libs/metapage'
import { getNewestSnippet } from '@/libs/sorters'
import type { Snippet } from 'me'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Snippets - Ahnaf An Nafee',
  description:
    'A collection of helpful snippets to help you, including myself to spin up the development. Remember, Do Not Repeat Yourself.',
  keywords: [
    'ahnafnafee snippets',
    'Ahnaf An Nafee snippets',
    'ahnafnafee.dev',
    'snippets',
    'code snippets',
    'development tools'
  ],
  openGraph: {
    title: 'Code Snippets - Ahnaf An Nafee',
    description: 'A collection of helpful snippets to help you, including myself to spin up the development.',
    url: 'https://www.ahnafnafee.dev/snippet',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: generateOgImage({
          title: 'Code Snippets',
          subTitle: 'Helpful Development Snippets & Tools'
        }),
        width: 1200,
        height: 600,
        alt: 'Code Snippets - Ahnaf An Nafee - Helpful Development Snippets & Tools'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Snippets - Ahnaf An Nafee',
    description: 'A collection of helpful snippets to help you, including myself to spin up the development.',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [
      generateOgImage({
        title: 'Code Snippets',
        subTitle: 'Helpful Development Snippets & Tools'
      })
    ]
  }
}

async function getSnippetData() {
  try {
    const res = await getContents<Snippet>('/snippet')
    return res.map((s) => s.header).sort(getNewestSnippet)
  } catch (error) {
    console.warn('Failed to load snippets:', error)
    return []
  }
}

export default async function SnippetPage() {
  const snippets = await getSnippetData()

  return (
    <>
      <main className='layout'>
        <SnippetPageClient snippets={snippets} />
      </main>
      <Footer />
    </>
  )
}

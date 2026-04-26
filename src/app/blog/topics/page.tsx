import { Breadcrumbs } from '@/components/SEO/Breadcrumbs'
import { UnstyledLink } from '@/components/site/links'
import { AppLayoutPage } from '@/components/site/templates/AppLayoutPage'
import { Hero } from '@/components/site/templates/Hero'

import { getContents } from '@/services'

import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'

import type { Blog } from 'me'
import type { Metadata } from 'next'

const TOPICS_URL = `${SITE_URL}/blog/topics`
const TOPICS_OG_ALT = `Blog Topics — ${SITE_NAME}`
const topicsOgImage = generateOgImage({
  title: 'Blog Topics',
  subTitle: 'Browse posts by topic',
  theme: 'dark'
})

const slugifyTopic = (topic: string) =>
  topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const metadata: Metadata = {
  title: `Topics — Blog | ${SITE_NAME}`,
  description: 'Browse blog posts by topic: AI, 3D graphics, machine learning, software engineering, and more.',
  alternates: { canonical: TOPICS_URL },
  openGraph: {
    title: `Topics — Blog | ${SITE_NAME}`,
    description: 'Browse blog posts by topic.',
    url: TOPICS_URL,
    siteName: SITE_NAME,
    images: [{ url: topicsOgImage, width: 1200, height: 630, alt: TOPICS_OG_ALT, type: 'image/png' }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Topics — Blog | ${SITE_NAME}`,
    description: 'Browse blog posts by topic.',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [{ url: topicsOgImage, alt: TOPICS_OG_ALT }]
  }
}

async function getTopicCounts() {
  const posts = await getContents<Blog>('/blog')
  const counts = new Map<string, { label: string; count: number }>()
  for (const post of posts) {
    for (const t of post.header.topics ?? []) {
      const slug = slugifyTopic(t)
      if (!slug) continue
      const existing = counts.get(slug)
      if (existing) {
        existing.count += 1
      } else {
        counts.set(slug, { label: t, count: 1 })
      }
    }
  }
  return Array.from(counts.entries())
    .map(([slug, info]) => ({ slug, ...info }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export default async function TopicsIndexPage() {
  const topics = await getTopicCounts()

  return (
    <AppLayoutPage>
      <Breadcrumbs
        items={[
          { name: 'Blog', href: `${SITE_URL}/blog` },
          { name: 'Topics', href: TOPICS_URL }
        ]}
      />
      <Hero title='Topics' description='Browse blog posts by topic.' />
      {topics.length === 0 ? (
        <p className='text-gray-600 dark:text-gray-400'>No topics yet.</p>
      ) : (
        <ul className='flex flex-wrap gap-3 pb-16'>
          {topics.map((t) => (
            <li key={t.slug}>
              <UnstyledLink
                href={`/blog/topics/${t.slug}`}
                className='inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 transition-colors hover:border-purple-400 dark:border-gray-800 dark:hover:border-purple-500'
              >
                <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>{t.label}</span>
                <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>{t.count}</span>
              </UnstyledLink>
            </li>
          ))}
        </ul>
      )}
    </AppLayoutPage>
  )
}

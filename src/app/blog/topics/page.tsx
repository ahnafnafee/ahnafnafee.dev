import { Breadcrumbs } from '@/components/SEO/Breadcrumbs'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { Hero } from '@/components/UI/templates/Hero'
import { UnstyledLink } from '@/UI/links'
import { generateOgImage } from '@/libs/metapage'
import { getContents } from '@/services'
import type { Blog } from 'me'
import type { Metadata } from 'next'

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
  title: 'Topics — Blog | Ahnaf An Nafee',
  description: 'Browse blog posts by topic: AI, 3D graphics, machine learning, software engineering, and more.',
  alternates: { canonical: 'https://www.ahnafnafee.dev/blog/topics' },
  openGraph: {
    title: 'Topics — Blog | Ahnaf An Nafee',
    description: 'Browse blog posts by topic.',
    url: 'https://www.ahnafnafee.dev/blog/topics',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: topicsOgImage,
        width: 1200,
        height: 630,
        alt: 'Blog Topics — Ahnaf An Nafee',
        type: 'image/png'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Topics — Blog | Ahnaf An Nafee',
    description: 'Browse blog posts by topic.',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [{ url: topicsOgImage, alt: 'Blog Topics — Ahnaf An Nafee' }]
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
          { name: 'Blog', href: 'https://www.ahnafnafee.dev/blog' },
          { name: 'Topics', href: 'https://www.ahnafnafee.dev/blog/topics' }
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
                className='inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2 hover:border-purple-400 dark:hover:border-purple-500 transition-colors'
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

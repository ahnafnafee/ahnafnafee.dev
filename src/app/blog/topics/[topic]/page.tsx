import { Breadcrumbs } from '@/components/SEO/Breadcrumbs'
import { BlogList } from '@/components/content/blog/BlogList'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { Hero } from '@/components/UI/templates/Hero'
import { generateOgImage } from '@/libs/metapage'
import { getContents } from '@/services'
import { getNewestBlog } from '@/libs/sorters'
import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import type { Blog } from 'me'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'

type Props = {
  params: { topic: string }
}

const slugifyTopic = (topic: string) =>
  topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const titleCase = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

async function getAllTopics() {
  const posts = await getContents<Blog>('/blog')
  const topicMap = new Map<string, string>()
  for (const post of posts) {
    for (const t of post.header.topics ?? []) {
      const slug = slugifyTopic(t)
      if (slug && !topicMap.has(slug)) topicMap.set(slug, t)
    }
  }
  return topicMap
}

async function getPostsForTopic(topicSlug: string) {
  const posts = await getContents<Blog>('/blog')
  return posts
    .filter((p) => (p.header.topics ?? []).some((t) => slugifyTopic(t) === topicSlug))
    .map((p) => ({ ...p.header, est_read: readingTime(p.content).text }))
    .sort(getNewestBlog)
}

export async function generateStaticParams() {
  try {
    const topics = await getAllTopics()
    return Array.from(topics.keys()).map((topic) => ({ topic }))
  } catch (error) {
    console.warn('Failed to generate topic params:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params
  const topics = await getAllTopics()
  const label = topics.get(topic) ?? titleCase(topic)
  const url = `${SITE_URL}/blog/topics/${topic}`
  const ogImage = generateOgImage({
    title: `${label} — Blog`,
    subTitle: `Posts tagged ${label}`,
    theme: 'dark'
  })
  const description = `Posts tagged ${label} from ${SITE_NAME}'s blog: AI, 3D graphics, software engineering, and research.`
  const ogTitle = `${label} — Blog Topics | ${SITE_NAME}`

  return {
    title: `${label} — Blog Topics`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle, type: 'image/png' }],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${label} — Blog Topics`,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [{ url: ogImage, alt: `${label} — Blog Topics` }]
    }
  }
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params
  const topics = await getAllTopics()
  const label = topics.get(topic)
  if (!label) notFound()

  const posts = await getPostsForTopic(topic)
  const url = `${SITE_URL}/blog/topics/${topic}`

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: `${label} — Blog Topics`,
    url,
    description: `Posts tagged ${label} from ${SITE_NAME}'s blog.`,
    isPartOf: {
      '@type': 'WebSite',
      url: SITE_URL
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title
      }))
    }
  }

  return (
    <AppLayoutPage>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <Breadcrumbs
        items={[
          { name: 'Blog', href: `${SITE_URL}/blog` },
          { name: 'Topics', href: `${SITE_URL}/blog/topics` },
          { name: label, href: url }
        ]}
      />
      <Hero title={label} description={`${posts.length} post${posts.length === 1 ? '' : 's'} tagged ${label}.`} />
      <BlogList posts={posts} displayViews={false} />
    </AppLayoutPage>
  )
}

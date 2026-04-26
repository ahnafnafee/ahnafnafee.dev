import { Breadcrumbs } from '@/components/SEO/Breadcrumbs'
import { BlogList } from '@/components/content/blog/BlogList'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { Hero } from '@/components/UI/templates/Hero'
import { getContents } from '@/services'
import { getNewestBlog } from '@/libs/sorters'
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
  const url = `https://www.ahnafnafee.dev/blog/topics/${topic}`

  return {
    title: `${label} — Blog Topics`,
    description: `Posts tagged ${label} from Ahnaf An Nafee's blog: AI, 3D graphics, software engineering, and research.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${label} — Blog Topics | Ahnaf An Nafee`,
      description: `Posts tagged ${label}.`,
      url,
      siteName: 'Ahnaf An Nafee',
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: `${label} — Blog Topics`,
      description: `Posts tagged ${label}.`,
      site: '@ahnaf_nafee',
      creator: '@ahnaf_nafee'
    }
  }
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params
  const topics = await getAllTopics()
  const label = topics.get(topic)
  if (!label) notFound()

  const posts = await getPostsForTopic(topic)
  const url = `https://www.ahnafnafee.dev/blog/topics/${topic}`

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: `${label} — Blog Topics`,
    url,
    description: `Posts tagged ${label} from Ahnaf An Nafee's blog.`,
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://www.ahnafnafee.dev'
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://www.ahnafnafee.dev/blog/${p.slug}`,
        name: p.title
      }))
    }
  }

  return (
    <AppLayoutPage>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <Breadcrumbs
        items={[
          { name: 'Blog', href: 'https://www.ahnafnafee.dev/blog' },
          { name: 'Topics', href: 'https://www.ahnafnafee.dev/blog/topics' },
          { name: label, href: url }
        ]}
      />
      <Hero title={label} description={`${posts.length} post${posts.length === 1 ? '' : 's'} tagged ${label}.`} />
      <BlogList posts={posts} displayViews={false} />
    </AppLayoutPage>
  )
}

import { BlogPostClient } from '@/components/blog/BlogPostClient'
import { notFound } from 'next/navigation'
import { MDXComponents } from '@/components/content/mdx'
import { AdjacentPosts } from '@/components/content/blog/AdjacentPosts'
import { RelatedPosts } from '@/components/content/blog/RelatedPosts'
import { Footer } from '@/UI/common'
import { getContentBySlug, getContents } from '@/services/content'
import { generateOgImage } from '@/libs/metapage'
import { getAdjacentPosts } from '@/libs/sorters/getAdjacentPosts'
import type { Blog } from 'me'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import readingTime from 'reading-time'
import { commonMDXOptions } from '@/libs/mdxConfig'


type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const res = await getContents<Blog>('/blog')
    return res.map((r) => ({
      slug: r.header.slug
    }))
  } catch (error) {
    console.warn('Failed to generate static params for blog:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await getContentBySlug<Blog>('/blog', slug)
    const header = res.header
    const ogImage = header.thumbnail || generateOgImage({ title: header.title, theme: 'dark' })
    const modifiedTime = header.updated || header.published

    return {
      title: header.title,
      description: header.summary,
      keywords: header.keywords,
      authors: [{ name: header.author_name }],
      alternates: {
        canonical: `https://www.ahnafnafee.dev/blog/${header.slug}`
      },
      openGraph: {
        title: header.title,
        description: header.summary,
        url: `https://www.ahnafnafee.dev/blog/${header.slug}`,
        siteName: 'Ahnaf An Nafee',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 600,
            alt: header.title
          }
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: header.published,
        modifiedTime,
        authors: [header.author_name],
        tags: header.topics
      },
      twitter: {
        card: 'summary_large_image',
        title: header.title,
        description: header.summary,
        site: '@ahnaf_nafee',
        creator: '@ahnaf_nafee',
        images: [ogImage]
      }
    }
  } catch {
    return {}
  }
}

export default async function BlogPost({ params }: Props) {
  try {
    const { slug } = await params
    const [res, allPosts] = await Promise.all([
      getContentBySlug<Blog>('/blog', slug),
      getContents<Blog>('/blog')
    ])
    const stats = readingTime(res.content)
    const est_read = stats.text
    const header = { est_read, ...res.header }
    const ogImage = header.thumbnail || generateOgImage({ title: header.title, theme: 'dark' })
    const dateModified = header.updated || header.published
    const keywordsList = header.keywords?.filter(Boolean) ?? []
    const adjacent = getAdjacentPosts(slug, allPosts)

    // JSON-LD structured data for Google rich results
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `https://www.ahnafnafee.dev/blog/${header.slug}#article`,
      headline: header.title,
      description: header.summary,
      image: ogImage,
      datePublished: header.published,
      dateModified,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      wordCount: stats.words,
      timeRequired: `PT${Math.max(1, Math.round(stats.minutes))}M`,
      author: {
        '@type': 'Person',
        '@id': 'https://www.ahnafnafee.dev/#person',
        name: header.author_name,
        url: 'https://www.ahnafnafee.dev'
      },
      publisher: {
        '@type': 'Person',
        '@id': 'https://www.ahnafnafee.dev/#person',
        name: 'Ahnaf An Nafee',
        url: 'https://www.ahnafnafee.dev'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.ahnafnafee.dev/blog/${header.slug}`
      },
      ...(keywordsList.length && { keywords: keywordsList.join(', ') }),
      articleSection: header.topics?.[0] || 'Technology'
    }

    // Breadcrumb structured data for navigation trails in search results
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.ahnafnafee.dev'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://www.ahnafnafee.dev/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: header.title,
          item: `https://www.ahnafnafee.dev/blog/${header.slug}`
        }
      ]
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <main className='layout pb-4'>
          <BlogPostClient header={header}>
            <MDXRemote
              source={res.content}
              components={MDXComponents}
              options={commonMDXOptions}
            />
          </BlogPostClient>
          <AdjacentPosts {...adjacent} />
          {header.related && header.related.length > 0 && (
            <RelatedPosts slugs={header.related} />
          )}
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Failed to load blog post:', error)
    return notFound()
  }
}

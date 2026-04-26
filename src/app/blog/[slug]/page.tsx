import { BlogPostClient } from '@/components/blog/BlogPostClient'
import { notFound } from 'next/navigation'
import { MDXComponents } from '@/components/content/mdx'
import { AdjacentPosts } from '@/components/content/blog/AdjacentPosts'
import { RelatedPosts } from '@/components/content/blog/RelatedPosts'
import { Footer } from '@/UI/common'
import { getContentBySlug, getContentHeaders } from '@/services/content'
import { generateOgImage } from '@/libs/metapage'
import { getAdjacentPosts } from '@/libs/sorters/getAdjacentPosts'
import { PERSON_ID } from '@/libs/seo/personSchema'
import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
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
    const res = await getContentHeaders<Blog>('/blog')
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
    const canonical = `${SITE_URL}/blog/${header.slug}`
    const seeAlso = (header.related ?? []).map((s) => `${SITE_URL}/blog/${s}`)

    return {
      title: header.title,
      description: header.summary,
      keywords: header.keywords,
      authors: [{ name: header.author_name, url: `${SITE_URL}/resume` }],
      alternates: {
        canonical,
        languages: {
          'en-US': canonical,
          'x-default': canonical
        }
      },
      openGraph: {
        title: header.title,
        description: header.summary,
        url: canonical,
        siteName: SITE_NAME,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: header.title,
            type: 'image/png'
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
        site: TWITTER_HANDLE,
        creator: TWITTER_HANDLE,
        images: [{ url: ogImage, alt: header.title }]
      },
      ...(seeAlso.length > 0 && {
        other: {
          'og:see_also': seeAlso
        }
      })
    }
  } catch {
    return {}
  }
}

export default async function BlogPost({ params }: Props) {
  try {
    const { slug } = await params
    // Adjacent-post nav only needs frontmatter (slug, title, published) — use
    // getContentHeaders to skip parsing every MDX body.
    const [res, allPosts] = await Promise.all([
      getContentBySlug<Blog>('/blog', slug),
      getContentHeaders<Blog>('/blog')
    ])
    const stats = readingTime(res.content)
    const est_read = stats.text
    const header = { est_read, ...res.header }
    const ogImage = header.thumbnail || generateOgImage({ title: header.title, theme: 'dark' })
    const dateModified = header.updated || header.published
    const keywordsList = header.keywords?.filter(Boolean) ?? []
    const adjacent = getAdjacentPosts(slug, allPosts)

    const pageUrl = `${SITE_URL}/blog/${header.slug}`
    const articleId = `${pageUrl}#article`
    const webpageId = `${pageUrl}#webpage`
    const breadcrumbId = `${pageUrl}#breadcrumb`

    // Single @graph emits BlogPosting + WebPage + BreadcrumbList as an
    // interconnected entity graph (all referenced by @id). This is the pattern
    // Google AI Mode + Perplexity prefer for source attribution.
    const graphJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': articleId,
          headline: header.title,
          description: header.summary,
          image: ogImage,
          datePublished: header.published,
          dateModified,
          inLanguage: 'en-US',
          isAccessibleForFree: true,
          wordCount: stats.words,
          timeRequired: `PT${Math.max(1, Math.round(stats.minutes))}M`,
          author: { '@id': PERSON_ID },
          publisher: { '@id': PERSON_ID },
          mainEntityOfPage: { '@id': webpageId },
          ...(keywordsList.length && { keywords: keywordsList.join(', ') }),
          articleSection: header.topics?.[0] || 'Technology'
        },
        {
          '@type': 'WebPage',
          '@id': webpageId,
          url: pageUrl,
          name: header.title,
          description: header.summary,
          inLanguage: 'en-US',
          datePublished: header.published,
          dateModified,
          isPartOf: { '@type': 'WebSite', url: SITE_URL },
          primaryImageOfPage: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
          breadcrumb: { '@id': breadcrumbId }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: header.title, item: pageUrl }
          ]
        }
      ]
    }

    return (
      <>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
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

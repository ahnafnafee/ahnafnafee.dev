import { BlogPostClient } from '@/components/blog/BlogPostClient'
import { MDXComponents } from '@/components/content/mdx'
import { Footer } from '@/UI/common'
import { getContentBySlug, getContents } from '@/services/content'
import { generateOgImage } from '@/libs/metapage'
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
  const res = await getContentBySlug<Blog>('/blog', slug)
  const header = res.header
  const ogImage = header.thumbnail || generateOgImage({ title: header.title, theme: 'dark' })

  return {
    title: header.title,
    description: header.summary,
    keywords: header.keywords,
    authors: [{ name: header.author_name }],
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
}

export default async function BlogPost({ params }: Props) {
  try {
    const { slug } = await params
    const res = await getContentBySlug<Blog>('/blog', slug)
    const est_read = readingTime(res.content).text
    const header = { est_read, ...res.header }

    return (
      <>
        <main className='layout pb-4'>
          <BlogPostClient header={header}>
            <MDXRemote
              source={res.content}
              components={MDXComponents}
              options={commonMDXOptions}
            />
          </BlogPostClient>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Failed to load blog post:', error)
    return (
      <>
        <main className='layout pb-4'>
          <div className='text-center py-8'>
            <h1>Blog post not found</h1>
            <p>The requested blog post could not be loaded.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }
}

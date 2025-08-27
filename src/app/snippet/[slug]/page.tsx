import { CustomImage } from '@/components/UI/images'
import { UnderlineLink } from '@/components/UI/links'
import { IconStack, MDXComponents, PRButton } from '@/components/content'
import { Footer } from '@/UI/common'
import { getContentBySlug, getContents } from '@/services'
import { generateOgImage } from '@/libs/metapage'
import type { Snippet } from 'me'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import readingTime from 'reading-time'
import rehypeSlug from 'rehype-slug'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const res = await getContents<Snippet>('/snippet')
    return res.map((r) => ({
      slug: r.header.slug
    }))
  } catch (error) {
    console.warn('Failed to generate static params for snippets:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await getContentBySlug<Snippet>('/snippet', params.slug)
  const header = res.header

  return {
    title: header.title,
    description: header.summary,
    openGraph: {
      title: header.title,
      description: header.summary,
      url: `https://www.ahnafnafee.dev/snippet/${header.slug}`,
      siteName: 'Ahnaf An Nafee',
      images: [
        {
          url: generateOgImage({ title: header.title, subTitle: 'Snippet - ahnafnafee.dev' }),
          width: 1200,
          height: 600,
          alt: header.title
        }
      ],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: header.title,
      description: header.summary,
      site: '@ahnaf_nafee',
      creator: '@ahnaf_nafee',
      images: [generateOgImage({ title: header.title, subTitle: 'Snippet - ahnafnafee.dev' })]
    }
  }
}

export default async function SnippetPostPage({ params }: Props) {
  try {
    const res = await getContentBySlug<Snippet>('/snippet', params.slug)
    const est_read = readingTime(res.content).text
    const header = { est_read, ...res.header }

    const githubAPI = {
      profile: `https://github.com/${header.github_username}`,
      picture: `https://github.com/${header.github_username}.png`
    }

    return (
      <>
        <main className='layout'>
          <section className='pb-8'>
            <div className='flex items-center justify-between'>
              <h1 className='max-w-prose text-3xl md:text-5xl'>{header.title}</h1>
              <IconStack type={header.topic} className='w-8 h-8 md:w-12 md:h-12' />
            </div>
            <p className='w-full my-4'>{header.summary}</p>

            <div className='flex items-center gap-4'>
              <CustomImage
                display='intrinsic'
                className='rounded-full'
                src={githubAPI.picture}
                width={32}
                height={32}
                alt={header.author}
              />
              <p>
                Created by /{' '}
                <UnderlineLink href={githubAPI.profile} title={header.author}>
                  {header.author}
                </UnderlineLink>
              </p>
            </div>
          </section>

          <section className='prose dark:prose-invert md:prose-lg'>
            <MDXRemote
              source={res.content}
              components={MDXComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeSlug]
                }
              }}
            />
          </section>

          <div className='mt-8 mb-2'>
            <PRButton path={`/snippet/${header.slug}.mdx`} />
          </div>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Failed to load snippet:', error)
    return (
      <>
        <main className='layout'>
          <div className='text-center py-8'>
            <h1>Snippet not found</h1>
            <p>The requested snippet could not be loaded.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }
}

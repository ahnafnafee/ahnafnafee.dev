import { notFound } from 'next/navigation'
import { MDXComponents } from '@/components/content/mdx'
import {
  HeadingResearch,
  ResearchAbstract,
  ResearchBibTeX,
  ResearchTeaser
} from '@/components/content/research'
import { PRButton } from '@/components/content/PRButton'
import { BackToTop } from '@/UI/buttons'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { getContentBySlug, getContentHeaders } from '@/services/content'
import { generateOgImage } from '@/libs/metapage'
import { commonMDXOptions } from '@/libs/mdxConfig'
import { twclsx } from '@/libs/twclsx'
import { PERSON_ID } from '@/libs/seo/personSchema'
import { SITE_AUTHOR, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import type { Affiliation, Author, Research } from 'me'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'

type Props = {
  params: { slug: string }
}

const toIso = (value?: string) => {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export async function generateStaticParams() {
  try {
    const res = await getContentHeaders<Research>('/research')
    return res.map((r) => ({ slug: r.header.slug }))
  } catch (error) {
    console.warn('Failed to generate static params for research:', error)
    return []
  }
}

const resolveOgImage = (header: Research): string => {
  if (header.ogImage) return header.ogImage
  if (header.teaser) return header.teaser
  if (header.thumbnail) return header.thumbnail
  return generateOgImage({ title: header.title, subTitle: header.summary, theme: 'dark' })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await getContentBySlug<Research>('/research', slug)
    const header = res.header
    const ogImage = resolveOgImage(header)
    const canonical = `${SITE_URL}/research/${header.slug}`
    const seeAlso = (header.related ?? []).map((s) => `${SITE_URL}/research/${s}`)
    const modifiedTime = toIso(header.updated || header.published)
    const publishedTime = toIso(header.published)
    const authorList = header.authors.map((a) => a.name)

    return {
      title: header.title,
      description: header.summary,
      keywords: header.keywords,
      authors: header.authors.map((a) => ({ name: a.name, url: a.url ?? `${SITE_URL}/resume` })),
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
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
        authors: authorList,
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

const buildAuthorNodes = (authors: Author[], affiliations: Affiliation[] | undefined) => {
  return authors.map((author) => {
    if (author.name === SITE_AUTHOR.name) {
      return { '@id': PERSON_ID }
    }
    const affNodes =
      affiliations && author.affiliations && author.affiliations.length > 0
        ? author.affiliations
            .map((idx) => affiliations[idx - 1])
            .filter((a): a is Affiliation => Boolean(a))
            .map((a) => ({
              '@type': 'Organization',
              name: a.name,
              ...(a.url && { url: a.url })
            }))
        : []
    return {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
      ...(author.orcid && { identifier: author.orcid }),
      ...(author.email && { email: author.email }),
      ...(affNodes.length > 0 && { affiliation: affNodes.length === 1 ? affNodes[0] : affNodes })
    }
  })
}

const buildIdentifierNodes = (header: Research) => {
  const ids = header.identifiers
  if (!ids) return []
  const nodes: Array<{ '@type': 'PropertyValue'; propertyID: string; value: string }> = []
  if (ids.doi) nodes.push({ '@type': 'PropertyValue', propertyID: 'doi', value: ids.doi })
  if (ids.arxivId) nodes.push({ '@type': 'PropertyValue', propertyID: 'arxiv', value: ids.arxivId })
  if (ids.researchGateId)
    nodes.push({ '@type': 'PropertyValue', propertyID: 'researchgate', value: ids.researchGateId })
  return nodes
}

export default async function ResearchEntryPage({ params }: Props) {
  try {
    const { slug } = await params
    const res = await getContentBySlug<Research>('/research', slug)
    const header = res.header
    const ogImage = resolveOgImage(header)
    const pageUrl = `${SITE_URL}/research/${header.slug}`
    const articleId = `${pageUrl}#article`
    const webpageId = `${pageUrl}#webpage`
    const breadcrumbId = `${pageUrl}#breadcrumb`
    const datePublished = toIso(header.published)
    const dateModified = toIso(header.updated || header.published)
    const authorNodes = buildAuthorNodes(header.authors, header.affiliations)
    const identifierNodes = buildIdentifierNodes(header)

    const graphJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ScholarlyArticle',
          '@id': articleId,
          headline: header.title,
          name: header.title,
          description: header.summary,
          abstract: header.abstract,
          image: ogImage,
          ...(datePublished && { datePublished }),
          ...(dateModified && { dateModified }),
          inLanguage: 'en-US',
          isAccessibleForFree: true,
          author: authorNodes,
          publisher: { '@id': PERSON_ID },
          mainEntityOfPage: { '@id': webpageId },
          ...(header.keywords?.length && { keywords: header.keywords.join(', ') }),
          ...(identifierNodes.length > 0 && { identifier: identifierNodes }),
          ...(header.identifiers?.arxivId && {
            sameAs: `https://arxiv.org/abs/${header.identifiers.arxivId}`
          }),
          ...(header.venue && {
            isPartOf: {
              '@type':
                header.venue.status === 'published' ||
                header.venue.status === 'accepted' ||
                header.venue.status === 'workshop'
                  ? 'Periodical'
                  : 'CreativeWork',
              name: header.venue.name ?? header.venue.short,
              ...(header.venue.url && { url: header.venue.url }),
              ...(header.venue.year && { datePublished: String(header.venue.year) })
            }
          }),
          ...(header.links?.code && { codeRepository: header.links.code }),
          ...(header.links?.paper && { url: header.links.paper })
        },
        {
          '@type': 'WebPage',
          '@id': webpageId,
          url: pageUrl,
          name: header.title,
          description: header.summary,
          inLanguage: 'en-US',
          ...(datePublished && { datePublished }),
          ...(dateModified && { dateModified }),
          isPartOf: { '@type': 'WebSite', url: SITE_URL },
          primaryImageOfPage: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
          breadcrumb: { '@id': breadcrumbId }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Research', item: `${SITE_URL}/research` },
            { '@type': 'ListItem', position: 3, name: header.title, item: pageUrl }
          ]
        }
      ]
    }

    return (
      <AppLayoutPage>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
        />
        <BackToTop />

        <article className={twclsx('flex flex-col', 'gap-8')}>
          <HeadingResearch
            title={header.title}
            topics={header.topics}
            authors={header.authors}
            affiliations={header.affiliations}
            venue={header.venue}
            links={header.links}
            bibtex={header.bibtex}
          />

          {header.teaser && (
            <ResearchTeaser
              src={header.teaser}
              alt={header.teaserCaption ?? header.title}
              caption={header.teaserCaption}
              priority
            />
          )}

          <ResearchAbstract abstract={header.abstract} />

          <section className={twclsx('prose', 'dark:prose-invert', 'md:prose-lg')}>
            <MDXRemote source={res.content} components={MDXComponents} options={commonMDXOptions} />
          </section>

          {header.bibtex && <ResearchBibTeX bibtex={header.bibtex} />}

          <div className='mt-5 mb-2'>
            <PRButton path={`/research/${header.slug}.mdx`} />
          </div>
        </article>
      </AppLayoutPage>
    )
  } catch (error) {
    console.error('Failed to load research entry:', error)
    return notFound()
  }
}

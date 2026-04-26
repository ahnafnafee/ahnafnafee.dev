declare module 'me' {
  /** Type used for blog post or metadata for blog */
  export type Blog = {
    title: string
    slug: string
    summary: string
    featured: boolean
    author_name: string
    github_username: string
    published: string
    updated?: string
    topics: Array<string>
    keywords: Array<string>
    related: Array<string>
    views?: number
    est_read?: string
    displayViews?: boolean
    thumbnail?: string
  }

  type CategoryTypes = 'software' | 'game'

  /** Type used for portfolio or meta data for portfolio */
  export type Portfolio = {
    title: string
    date: string
    updated?: string
    featured: boolean
    summary: string
    slug: string
    stack: Array<string>
    image: string
    link: {
      github?: string
      live?: string
      appStore?: string
      playStore?: string
    }
    category?: CategoryTypes
  }
  /** Author of a research entry. `affiliations` indices are 1-based and reference the entry's top-level `affiliations` array. */
  export type Author = {
    name: string
    url?: string
    affiliations?: Array<number>
    corresponding?: boolean
    email?: string
    orcid?: string
  }

  export type Affiliation = {
    name: string
    location?: string
    url?: string
  }

  export type Venue = {
    name?: string
    short?: string
    year?: number
    status?: 'preprint' | 'under-review' | 'accepted' | 'published' | 'workshop' | 'tech-report'
    url?: string
  }

  export type ResearchLinks = {
    paper?: string
    code?: string
    video?: string
    slides?: string
    dataset?: string
    arxiv?: string
    researchGate?: string
    supplementary?: string
    demo?: string
    project?: string
  }

  export type ResearchIdentifiers = {
    doi?: string
    arxivId?: string
    researchGateId?: string
  }

  /** Type used for a research entry — academic project pages with abstract + structured authors. */
  export type Research = {
    title: string
    slug: string
    summary: string
    abstract: string
    authors: Array<Author>
    affiliations?: Array<Affiliation>
    venue?: Venue
    published: string
    updated?: string
    featured?: boolean
    topics: Array<string>
    keywords: Array<string>
    thumbnail?: string
    teaser?: string
    teaserCaption?: string
    ogImage?: string
    links?: ResearchLinks
    identifiers?: ResearchIdentifiers
    bibtex?: string
    category?: 'graphics' | 'ai' | 'hci' | 'systems' | 'theory'
    related?: Array<string>
  }

  /** Type used for snippet or meta data for snippet */
  export type Snippet = {
    title: string
    summary: string
    topic: string
    created_at: string
    slug: string
    author: string
    github_username: string
  }
  /** Payload for utils to generate og image, return value will be a string from https://og-image.vercel.app */
  export type genOgImagePayload = {
    title: string
    subTitle?: string
    theme?: 'light' | 'dark'
  }

  // a section for resume - start
  /** An education type used for list of education data later on displayed on resume page */
  export type Education = {
    school: string
    period: { start: string; end: string }
    paragraphs: string[]
    list?: {
      title: string
      listItem: string[]
    }
  }

  /** a type used for list of experiences data later on displayed on resume page */
  export type Experience = {
    companyName: string
    role: string
    period: {
      start: string
      end: string
    }
    lists: string[]
  }
  // a section for resume - end

  /** a type used for social like facebook, provide text to displayed to view and an for the URL*/
  export type Social = {
    title: string
    href: string
  }

  /** a type used for list of certificate later on certificate page */
  export type Certificate = { title: string; src: string }

  /** a type for pageView from umami */
  export type PageView = {
    bounces: { value: number; change: number }
    pageviews: { value: number; change: number }
    totaltime: { value: number; change: number }
    unique: { value: number; change: number }
  }

  export type Timeline = {
    title: string
    description: string
    place: string
    start_date: Date
    end_date: Date | null
    type: 'edu' | 'work'
  }

  export type PageViewResponse = {
    message: string
    view: number | null
  }

  export type Category = {
    label?: CategoryTypes
    className?: string | undefined
  }
}

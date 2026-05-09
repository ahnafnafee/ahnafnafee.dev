// Types shared between the OG route handler, the URL helper, and the card
// components. Server-only.

// server-only

export type OgPageType =
  | 'home'
  | 'blog'
  | 'blog-post'
  | 'portfolio'
  | 'portfolio-post'
  | 'research'
  | 'research-post'
  | 'resume'
  | 'page'

export type OgAccent = {
  /** Solid stroke color for the wireframe mesh. */
  mesh: string
  /** Gradient stops applied to the title via background-clip. */
  titleStops: ReadonlyArray<string>
  /** Hairline rule color underneath the title. */
  rule: string
  /** Page-type chip background. */
  chipBg: string
  /** Page-type chip foreground (hand-tuned for contrast). */
  chipFg: string
  /** Topic chip background (subtle on dark). */
  topicBg: string
  /** Topic chip foreground. */
  topicFg: string
}

export type OgCardProps = {
  type: OgPageType
  title: string
  subtitle?: string
  topics?: ReadonlyArray<string>
  category?: string
  section?: string
  venue?: string
  /** Pre-fetched profile photo as a data URL, or empty string for the initials fallback. */
  profileSrc: string
}

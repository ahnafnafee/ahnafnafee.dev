import { AppDownloadCTA } from './AppDownloadCTA'
import { Blockquote } from './Blockquote'
import { Code } from './Code'
import { ContentImage } from './ContentImage'
import { ContentImageZoom } from './ContentImageZoom'
import { FAQ } from './FAQ'
import { HeadingFour, HeadingThree, HeadingTwo } from './Headings'
import { HowTo } from './HowTo'
import { KeyPoints } from './KeyPoints'
import { MDXLink } from './MDXLink'
import { MermaidLazy } from './MermaidLazy'
import { Pre } from './Pre'
import { ProjectLinks } from './ProjectLinks'
import { Table } from './Table'
import { TLDR } from './TLDR'

import { MDXRemoteProps } from 'next-mdx-remote'

const MDXComponents = {
  pre: Pre,
  // No `img` mapping: MDX only routes markdown ![]() through components, not the
  // literal <img> tags authors use, and next/image breaks external images/SVGs.
  // Content images are made click-to-zoom by <ContentImageZoom> (delegated).
  code: Code,
  blockquote: Blockquote,
  a: MDXLink,
  table: Table,
  ContentImage,
  Mermaid: MermaidLazy,
  FAQ,
  HowTo,
  TLDR,
  KeyPoints,
  ProjectLinks,
  AppDownloadCTA,
  h2: HeadingTwo,
  h3: HeadingThree,
  h4: HeadingFour
} as MDXRemoteProps['components']

export {
  MDXComponents,
  ContentImageZoom,
  Pre,
  Code,
  Blockquote,
  ContentImage,
  MermaidLazy as Mermaid,
  Table,
  FAQ,
  HowTo,
  TLDR,
  KeyPoints,
  ProjectLinks,
  AppDownloadCTA
}

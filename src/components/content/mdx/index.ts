import { Blockquote } from './Blockquote'
import { Code } from './Code'
import { ContentImage } from './ContentImage'
import { FAQ } from './FAQ'
import { HeadingFour, HeadingThree, HeadingTwo } from './Headings'
import { HowTo } from './HowTo'
import { KeyPoints } from './KeyPoints'
import { MDXLink } from './MDXLink'
import { MermaidLazy } from './MermaidLazy'
import { Pre } from './Pre'
import { Table } from './Table'
import { TLDR } from './TLDR'

import { MDXRemoteProps } from 'next-mdx-remote'

const MDXComponents = {
  pre: Pre,
  // Note: img mapping removed to support external images/SVGs
  // Use <ContentImage> explicitly for ImageKit-hosted images
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
  h2: HeadingTwo,
  h3: HeadingThree,
  h4: HeadingFour
} as MDXRemoteProps['components']

export {
  MDXComponents,
  Pre,
  Code,
  Blockquote,
  ContentImage,
  MermaidLazy as Mermaid,
  Table,
  FAQ,
  HowTo,
  TLDR,
  KeyPoints
}

import { Blockquote } from './Blockquote'
import { Code } from './Code'
import { ContentImage } from './ContentImage'
import { HeadingFour, HeadingThree, HeadingTwo } from './Headings'
import { MDXLink } from './MDXLink'
import { Mermaid } from './Mermaid'
import { Pre } from './Pre'
import { Table } from './Table'

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
  Mermaid,
  h2: HeadingTwo,
  h3: HeadingThree,
  h4: HeadingFour
} as MDXRemoteProps['components']

export { MDXComponents, Pre, Code, Blockquote, ContentImage, Mermaid, Table }

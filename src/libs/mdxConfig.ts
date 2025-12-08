import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import mdxPrism from 'mdx-prism'

export const commonMDXOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [mdxPrism, rehypeSlug, rehypeKatex]
  }
}

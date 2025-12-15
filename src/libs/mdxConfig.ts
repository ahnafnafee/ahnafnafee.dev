import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import rehypePrismPlus from 'rehype-prism-plus'

export const commonMDXOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [[rehypePrismPlus, { ignoreMissing: true }], rehypeSlug, rehypeKatex]
  }
}

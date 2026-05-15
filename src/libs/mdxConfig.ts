import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
// `rehype-prism-plus` (default) wraps `refractor/lib/all.js`. Importing the
// same entry path gives us the exact singleton it highlights against — so
// registering our custom Modelfile grammar here makes it available to every
// ```modelfile fenced block without forking the plugin chain.
import { refractor } from 'refractor/lib/all.js'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import modelfile from './prism/modelfile'

refractor.register(modelfile as unknown as Parameters<typeof refractor.register>[0])

export const commonMDXOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [[rehypePrismPlus, { ignoreMissing: true }], rehypeSlug, rehypeKatex] as any[]
  }
}

'use client'

import dynamic from 'next/dynamic'

// Lazy boundary for Mermaid: the actual implementation (~100KB CDN script + react wrapper)
// only loads when a post renders a ```mermaid block, keeping it out of the main blog bundle.
export const MermaidLazy = dynamic(() => import('./Mermaid').then((m) => m.Mermaid), {
  ssr: false,
  loading: () => <div className='my-8 h-32 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800' />
})

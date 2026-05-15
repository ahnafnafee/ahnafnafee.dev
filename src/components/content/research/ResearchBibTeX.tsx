'use client'

import { CodeBlockShell } from '@/components/content/mdx/CodeBlockShell'

import { twclsx } from '@/libs/twclsx'

type ResearchBibTeXProps = {
  bibtex: string
}

export const ResearchBibTeX: React.FC<ResearchBibTeXProps> = ({ bibtex }) => {
  return (
    <section id='bibtex' className={twclsx('not-prose mt-2 scroll-mt-24')}>
      <h2
        className={twclsx('text-xs font-bold tracking-wider uppercase', 'text-purple-600 dark:text-purple-400', 'mb-3')}
      >
        Citation
      </h2>
      <CodeBlockShell language='bibtex'>
        <pre
          className={twclsx(
            'language-bibtex overflow-x-auto text-sm leading-relaxed',
            '[margin:0!important] [border-radius:0!important] [padding:0.75rem_1rem!important]',
            '[&>code]:border-none [&>code]:[background:transparent!important]'
          )}
        >
          <code className='language-bibtex'>{bibtex.trim()}</code>
        </pre>
      </CodeBlockShell>
    </section>
  )
}

'use client'

import { Button } from '@/components/ui/button'

import { twclsx } from '@/libs/twclsx'

import { useEffect, useRef, useState } from 'react'
import { HiCheck, HiClipboardCopy } from 'react-icons/hi'

type ResearchBibTeXProps = {
  bibtex: string
}

export const ResearchBibTeX: React.FC<ResearchBibTeXProps> = ({ bibtex }) => {
  const [isCopied, setIsCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (!isCopied) return
    const t = setTimeout(() => setIsCopied(false), 1500)
    return () => clearTimeout(t)
  }, [isCopied])

  const copy = async () => {
    if (preRef.current && !isCopied) {
      await navigator.clipboard.writeText(preRef.current.textContent ?? '')
      setIsCopied(true)
    }
  }

  return (
    <section id='bibtex' className={twclsx('not-prose mt-2 scroll-mt-24')}>
      <h2
        className={twclsx('text-xs font-bold tracking-wider uppercase', 'text-purple-600 dark:text-purple-400', 'mb-3')}
      >
        Citation
      </h2>
      <div className={twclsx('relative')}>
        <div
          className={twclsx(
            'absolute right-12 left-0 h-11 rounded-tl rounded-br',
            'text-sm font-semibold',
            'text-main-1.5 bg-slate-700'
          )}
        >
          <div
            className={twclsx(
              'inline-flex h-full items-center justify-start rounded-tl px-4 md:px-8',
              'text-theme-100 bg-primary-600'
            )}
          >
            BIBTEX
          </div>
        </div>
        <div
          className={twclsx(
            'absolute top-0 right-0',
            'flex items-center justify-center',
            'h-11 w-11 rounded-tr rounded-bl',
            'bg-slate-700'
          )}
        >
          <Button
            variant='ghost'
            size='icon-sm'
            onClick={copy}
            aria-label='Copy citation'
            className='hover:bg-slate-600'
          >
            {isCopied ? <HiCheck className='text-emerald-500' /> : <HiClipboardCopy className='text-theme-100' />}
          </Button>
        </div>
        <pre ref={preRef} className={twclsx('language-bibtex', '[&>code]:border-none', 'pt-[3.5rem!important]')}>
          <code className='language-bibtex'>{bibtex.trim()}</code>
        </pre>
      </div>
    </section>
  )
}

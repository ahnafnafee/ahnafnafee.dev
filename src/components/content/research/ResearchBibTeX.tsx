'use client'

import { UnstyledButton } from '@/components/UI/buttons'

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
        className={twclsx(
          'text-xs font-bold uppercase tracking-wider',
          'text-purple-600 dark:text-purple-400',
          'mb-3'
        )}
      >
        Citation
      </h2>
      <div className={twclsx('relative')}>
        <div
          className={twclsx(
            'absolute left-0 right-12 h-11 rounded-tl rounded-br',
            'font-semibold text-sm',
            'bg-slate-700 text-main-1.5'
          )}
        >
          <div
            className={twclsx(
              'inline-flex items-center justify-start px-4 md:px-8 h-full rounded-tl',
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
            'w-11 h-11 rounded-tr rounded-bl',
            'bg-slate-700'
          )}
        >
          <UnstyledButton
            onClick={copy}
            className={twclsx(
              'group relative',
              'w-8 h-8 rounded-lg transition-all duration-200',
              'ring-primary-400 ring-offset-primary-400 hover:ring'
            )}
          >
            {isCopied ? (
              <HiCheck className={twclsx('w-4 h-4', 'text-emerald-500')} />
            ) : (
              <HiClipboardCopy className={twclsx('w-4 h-4', 'text-theme-100')} />
            )}
            <span className='sr-only'>Copy citation</span>
          </UnstyledButton>
        </div>
        <pre
          ref={preRef}
          className={twclsx('language-bibtex', '[&>code]:border-none', 'pt-[3.5rem!important]')}
        >
          <code className='language-bibtex'>{bibtex.trim()}</code>
        </pre>
      </div>
    </section>
  )
}

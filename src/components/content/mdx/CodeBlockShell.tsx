'use client'

import { Button } from '@/components/ui/button'

import { twclsx } from '@/libs/twclsx'

import { useEffect, useRef, useState } from 'react'
import { HiCheck, HiClipboardCopy } from 'react-icons/hi'

interface CodeBlockShellProps {
  /** Lowercase language label shown in the top-left chip (e.g. "modelfile", "bibtex"). */
  language: string
  /** Children rendered inside the body, typically a single `<pre>`. */
  children: React.ReactNode
  /** Optional className passed through to the outer wrapper. */
  className?: string
}

/**
 * Single-surface code-block chrome shared by the MDX `Pre` renderer and the
 * standalone `ResearchBibTeX` citation card. Thin neutral border, quiet
 * monospace language chip, ghost copy button — sits on `var(--prism-bg)` so
 * the body inherits the same theme-aware surface as the rest of the prism
 * palette.
 */
export const CodeBlockShell = ({ language, children, className }: CodeBlockShellProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCopied) return
    const timer = setTimeout(() => setIsCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [isCopied])

  const copyToClipboard = async () => {
    if (bodyRef.current && !isCopied) {
      await navigator.clipboard.writeText(bodyRef.current.textContent ?? '')
      setIsCopied(true)
    }
  }

  return (
    <div
      className={twclsx(
        'not-prose group relative my-6',
        'overflow-hidden rounded-lg',
        'border border-neutral-200 dark:border-neutral-800',
        'bg-[var(--prism-bg)]',
        className
      )}
    >
      <div
        className={twclsx(
          'flex items-center justify-between gap-3',
          'border-b border-neutral-200/70 dark:border-neutral-800',
          'bg-neutral-100 dark:bg-neutral-900/60',
          'px-3 py-2'
        )}
      >
        <div className='flex items-center gap-2'>
          {/* macOS-style window controls — purely decorative; the canonical
            * close/minimize/zoom palette signals "this is a terminal-style
            * surface" without taking the visual weight of an interactive UI. */}
          <div className='flex items-center gap-1.5' aria-hidden='true'>
            <span className='block size-3 rounded-full bg-[#ff5f57] ring-1 ring-black/10 dark:ring-white/5' />
            <span className='block size-3 rounded-full bg-[#febc2e] ring-1 ring-black/10 dark:ring-white/5' />
            <span className='block size-3 rounded-full bg-[#28c840] ring-1 ring-black/10 dark:ring-white/5' />
          </div>
          <span
            className={twclsx(
              'ml-1 font-mono text-[0.7rem] tracking-[0.08em] lowercase',
              'text-neutral-500 dark:text-neutral-400',
              'select-none'
            )}
          >
            {language || 'text'}
          </span>
        </div>
        <Button
          variant='ghost'
          size='icon-sm'
          onClick={copyToClipboard}
          aria-label='Copy code to clipboard'
          className={twclsx(
            'h-7 w-7',
            'text-neutral-500 hover:text-neutral-900',
            'dark:text-neutral-400 dark:hover:text-neutral-100',
            'hover:bg-neutral-200/60 dark:hover:bg-neutral-700/40'
          )}
        >
          {isCopied ? (
            <HiCheck className='h-3.5 w-3.5 text-emerald-500' />
          ) : (
            <HiClipboardCopy className='h-3.5 w-3.5' />
          )}
        </Button>
      </div>

      <div ref={bodyRef}>{children}</div>
    </div>
  )
}

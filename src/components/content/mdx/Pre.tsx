'use client'

import { Button } from '@/components/ui/button'

import { twclsx } from '@/libs/twclsx'

import { Mermaid } from './Mermaid'

import { Children, isValidElement, Suspense, useEffect, useRef, useState } from 'react'
import { HiCheck, HiClipboardCopy } from 'react-icons/hi'

interface PreProps {
  children: React.ReactNode
  className?: string
}

// Wrapper component that extracts mermaid content from DOM after render
function MermaidCodeBlock({ children }: { children: React.ReactNode }) {
  const codeRef = useRef<HTMLDivElement>(null)
  const [mermaidContent, setMermaidContent] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(true)

  useEffect(() => {
    // Use MutationObserver to wait for all lazy content to load
    if (!codeRef.current) return

    const extractContent = () => {
      if (codeRef.current) {
        const text = codeRef.current.textContent || ''
        if (text.trim()) {
          setMermaidContent(text.trim())
          setIsExtracting(false)
        }
      }
    }

    // Try extraction immediately
    extractContent()

    // If content is still incomplete, set up observer
    if (isExtracting) {
      const observer = new MutationObserver(() => {
        extractContent()
      })

      observer.observe(codeRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      })

      // Also try after a delay for safety
      const timer = setTimeout(extractContent, 500)

      return () => {
        observer.disconnect()
        clearTimeout(timer)
      }
    }
  }, [isExtracting])

  // If we have extracted content, render Mermaid
  if (mermaidContent && !isExtracting) {
    return <Mermaid content={mermaidContent} />
  }

  // While extracting, render hidden code block to extract from
  return (
    <div className='mermaid-wrapper not-prose my-8'>
      <div className='flex items-center justify-center py-8 text-gray-400'>
        <div className='border-primary-500 h-8 w-8 animate-spin rounded-full border-b-2'></div>
        <span className='ml-2'>Loading diagram...</span>
      </div>
      {/* Hidden div to extract content from */}
      <div ref={codeRef} className='sr-only' aria-hidden='true'>
        <Suspense fallback={null}>{children}</Suspense>
      </div>
    </div>
  )
}

// rehype-prism-plus emits something like `language-modelfile code-highlight`.
// Naive `.replace('language-', '')` leaks the second class into the label
// (yielding "MODELFILE CODE-HIGHLIGHT"); match the `language-*` token instead.
function extractLanguage(...candidates: (string | undefined | null)[]): string {
  for (const cn of candidates) {
    if (!cn) continue
    const match = cn.match(/(?:^|\s)language-([\w-]+)/)
    if (match) return match[1]
  }
  return ''
}

function getLanguageFromChildren(children: React.ReactNode): string {
  try {
    const child = Children.only(children)
    if (isValidElement(child) && child.props) {
      const childProps = child.props as { className?: string }
      return extractLanguage(childProps.className)
    }
  } catch {
    // Multiple children or no children
  }
  return ''
}

export const Pre = ({ children, className }: PreProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const preRef = useRef<HTMLPreElement>(null)

  const language = getLanguageFromChildren(children) || extractLanguage(className)

  // Hooks must always run in the same order — keep useEffect above any early
  // return (rules-of-hooks). The effect is a no-op when isCopied stays false.
  useEffect(() => {
    if (!isCopied) return
    const timer = setTimeout(() => setIsCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [isCopied])

  // If it's a mermaid block, use the MermaidCodeBlock wrapper
  if (language.startsWith('mermaid')) {
    return <MermaidCodeBlock>{children}</MermaidCodeBlock>
  }

  const copyToClipboard = async () => {
    if (preRef.current && !isCopied) {
      await navigator.clipboard.writeText(preRef.current.textContent as string)
      setIsCopied(true)
    }
  }

  const displayLanguage = language || 'text'

  return (
    <div
      className={twclsx(
        'not-prose group relative my-6',
        'overflow-hidden rounded-lg',
        'border border-neutral-200 dark:border-neutral-800',
        'bg-[var(--prism-bg)]'
      )}
    >
      <div
        className={twclsx(
          'flex items-center justify-between',
          'border-b border-neutral-200/70 dark:border-neutral-800',
          'bg-neutral-50/60 dark:bg-neutral-900/40',
          'px-4 py-1.5'
        )}
      >
        <span
          className={twclsx(
            'font-mono text-[0.7rem] tracking-[0.08em] lowercase',
            'text-neutral-500 dark:text-neutral-400',
            'select-none'
          )}
        >
          {displayLanguage}
        </span>
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

      <pre
        ref={preRef}
        className={twclsx(
          'overflow-x-auto',
          // Override prism-themes.css baseline so the inner <pre> defers to
          // the wrapper's surface, radius, and outer spacing.
          '[margin:0!important] [border-radius:0!important]',
          '[&>code]:border-none [&>code]:[background:transparent!important]',
          className
        )}
      >
        {children}
      </pre>
    </div>
  )
}

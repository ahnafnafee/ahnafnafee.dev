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

// Helper to detect language from children
function getLanguageFromChildren(children: React.ReactNode): string {
  try {
    const child = Children.only(children)
    if (isValidElement(child) && child.props) {
      const childProps = child.props as { className?: string }
      const childClassName = childProps.className || ''
      return childClassName.replace('language-', '').toLowerCase()
    }
  } catch {
    // Multiple children or no children
  }
  return ''
}

export const Pre = ({ children, className }: PreProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const preRef = useRef<HTMLPreElement>(null)

  // Get language from children
  const language = getLanguageFromChildren(children)

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

  const displayLanguage = className?.replace('language-', '').toUpperCase() || language?.toUpperCase() || ''

  return (
    <div className={twclsx('relative')}>
      <div
        className={twclsx(
          'absolute right-12 left-0',
          'h-11 rounded-tl rounded-br',
          'text-sm font-semibold',
          'text-main-1.5 bg-slate-700'
        )}
      >
        <div
          className={twclsx(
            'inline-flex items-center justify-start',
            'h-full rounded-tl px-4 md:px-8',
            'text-theme-100 bg-primary-600'
          )}
        >
          {displayLanguage}
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
          onClick={copyToClipboard}
          aria-label='Copy to clipboard'
          className='hover:bg-slate-600'
        >
          {isCopied ? <HiCheck className='text-emerald-500' /> : <HiClipboardCopy className='text-theme-100' />}
        </Button>
      </div>

      <pre ref={preRef} className={twclsx('pt-[3.5rem!important] [&>code]:border-none', className)}>
        {children}
      </pre>
    </div>
  )
}

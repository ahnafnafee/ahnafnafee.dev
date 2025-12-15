'use client'

import { UnstyledButton } from '@/UI/buttons'
import { Mermaid } from './Mermaid'
import { twclsx } from '@/libs/twclsx'

import { useEffect, useRef, useState, isValidElement, Children, ReactNode, Suspense } from 'react'
import { HiCheck, HiClipboardCopy } from 'react-icons/hi'

interface PreProps {
  children: React.ReactNode
  className?: string
}

// Wrapper component that extracts mermaid content from DOM after render
function MermaidCodeBlock({ children, language }: { children: React.ReactNode; language: string }) {
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
        characterData: true,
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
    <div className="mermaid-wrapper my-8 not-prose">
      <div className="flex items-center justify-center py-8 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-2">Loading diagram...</span>
      </div>
      {/* Hidden div to extract content from */}
      <div ref={codeRef} className="sr-only" aria-hidden="true">
        <Suspense fallback={null}>
          {children}
        </Suspense>
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

  // If it's a mermaid block, use the MermaidCodeBlock wrapper
  if (language.startsWith('mermaid')) {
    return <MermaidCodeBlock language={language}>{children}</MermaidCodeBlock>
  }

  const copyToClipboard = async () => {
    if (preRef.current && !isCopied) {
      await navigator.clipboard.writeText(preRef.current.textContent as string)
      setIsCopied(true)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsCopied(false), 1500)

    return () => clearTimeout(timer)
  }, [isCopied])

  const displayLanguage = className?.replace('language-', '').toUpperCase() || language?.toUpperCase() || ''

  return (
    <div className={twclsx('relative')}>
      <div
        className={twclsx(
          'absolute left-0 right-12',
          'h-11 rounded-tl rounded-br',
          'font-semibold text-sm',
          'bg-slate-700 text-main-1.5'
        )}
      >
        <div
          className={twclsx(
            'inline-flex items-center justify-start',
            'px-4 md:px-8 h-full rounded-tl',
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
          'w-11 h-11 rounded-tr rounded-bl',
          'bg-slate-700'
        )}
      >
        <UnstyledButton
          onClick={copyToClipboard}
          className={twclsx(
            'group relative',
            'w-8 h-8 rounded-lg transition-all duration-200',
            'ring-primary-400',
            'ring-offset-primary-400',
            'hover:ring'
          )}
        >
          {isCopied ? (
            <HiCheck className={twclsx('w-4 h-4', 'text-emerald-500')} />
          ) : (
            <HiClipboardCopy className={twclsx('w-4 h-4', 'text-theme-100')} />
          )}
          <span className='sr-only'>Copy to clipboard</span>
        </UnstyledButton>
      </div>

      <pre ref={preRef} className={twclsx('[&>code]:border-none pt-[3.5rem!important] text-sm', className)}>
        {children}
      </pre>
    </div>
  )
}

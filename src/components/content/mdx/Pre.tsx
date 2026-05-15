'use client'

import { twclsx } from '@/libs/twclsx'

import { CodeBlockShell } from './CodeBlockShell'
import { Mermaid } from './Mermaid'

import { Children, isValidElement, Suspense, useEffect, useRef, useState } from 'react'

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
  const language = getLanguageFromChildren(children) || extractLanguage(className)

  // If it's a mermaid block, defer to the dedicated wrapper.
  if (language.startsWith('mermaid')) {
    return <MermaidCodeBlock>{children}</MermaidCodeBlock>
  }

  return (
    <CodeBlockShell language={language}>
      <pre
        className={twclsx(
          'overflow-x-auto px-4 py-3 text-sm leading-relaxed',
          // Override prism-themes.css baseline so the inner <pre> defers to
          // the shell's surface and outer spacing.
          '[margin:0!important] [border-radius:0!important] [padding:0.75rem_1rem!important]',
          '[&>code]:border-none [&>code]:[background:transparent!important]',
          className
        )}
      >
        {children}
      </pre>
    </CodeBlockShell>
  )
}

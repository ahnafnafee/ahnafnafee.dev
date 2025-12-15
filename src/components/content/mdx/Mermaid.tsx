'use client'

import { twclsx } from '@/libs/twclsx'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { HiArrowsExpand, HiX } from 'react-icons/hi'

interface MermaidProps {
  content: string
}

// Declare global mermaid type
declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void
      render: (id: string, content: string) => Promise<{ svg: string }>
    }
  }
}

// Load mermaid from CDN
function loadMermaidFromCDN(): Promise<Window['mermaid']> {
  return new Promise((resolve, reject) => {
    // If already loaded, return it
    if (window.mermaid) {
      resolve(window.mermaid)
      return
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="mermaid"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.mermaid))
      existingScript.addEventListener('error', reject)
      return
    }

    // Load the script
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
    script.async = true
    script.onload = () => resolve(window.mermaid)
    script.onerror = () => reject(new Error('Failed to load mermaid from CDN'))
    document.head.appendChild(script)
  })
}

export function Mermaid({ content }: MermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (typeof window === 'undefined') return

    let mounted = true

    const renderMermaid = async () => {
      try {
        const mermaid = await loadMermaidFromCDN()
        
        if (!mounted || !mermaidRef.current || !mermaid) {
          return
        }

        const isDark = resolvedTheme === 'dark'

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
        })

        // Normalize line endings
        const processedContent = content
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .trim()

        // Create a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(7)}`

        try {
          const { svg } = await mermaid.render(id, processedContent)

          if (mounted && mermaidRef.current) {
            mermaidRef.current.innerHTML = svg
            setSvgContent(svg)
            setIsLoaded(true)
          }
        } catch (renderError) {
          console.error('Mermaid render error:', renderError)
          if (mounted) {
            const errorMessage = renderError instanceof Error ? renderError.message : 'Failed to render diagram'
            setError(errorMessage)
          }
        }
      } catch (err) {
        console.error('Mermaid CDN load error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load mermaid from CDN')
        }
      }
    }

    // Delay rendering to ensure DOM is ready
    const timer = setTimeout(renderMermaid, 100)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [content, resolvedTheme])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isFullscreen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  if (error) {
    return (
      <div className="mermaid-wrapper my-8">
        <div
          className={twclsx(
            'flex flex-col items-center justify-center py-12 px-6 text-center',
            'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
            'border-2 border-dashed border-red-300 dark:border-red-700 rounded-lg'
          )}
        >
          <div
            className={twclsx(
              'w-16 h-16 mb-4 flex items-center justify-center',
              'bg-red-100 dark:bg-red-900/30 rounded-full'
            )}
          >
            <HiExclamationTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
            Diagram Syntax Error
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4 max-w-md">
            The Mermaid diagram contains invalid syntax and cannot be rendered.
          </p>
          <div
            className={twclsx(
              'bg-red-50 dark:bg-red-900/30',
              'border border-red-200 dark:border-red-800 rounded-md p-3 max-w-md'
            )}
          >
            <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Fullscreen modal overlay - using React Portal to render at body level */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] overflow-auto backdrop-blur-sm bg-white/90 dark:bg-black/90"
          onClick={closeFullscreen}
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className="fixed top-6 right-6 z-[10000] p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors border border-black/20 dark:border-white/20"
            aria-label="Close fullscreen (Esc)"
          >
            <HiX className="w-5 h-5 text-black dark:text-white " />
          </button>

          {/* Modal content - vertically centered with table approach */}
          <div style={{ 
            display: 'table', 
            width: '100%', 
            height: '100vh',
            tableLayout: 'fixed'
          }}>
            <div style={{ 
              display: 'table-cell', 
              verticalAlign: 'middle',
              padding: '48px 16px',
            }}>
              <div
                style={{
                  display: 'block',
                  maxWidth: '95vw',
                  maxHeight: 'calc(100vh - 96px)',
                  margin: '0 auto',
                  borderRadius: '16px',
                  padding: '24px',
                  overflow: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Inline diagram with hover effects */}
      <figure className="mermaid my-8 not-prose">
        <div
          className={twclsx(
            'group relative cursor-pointer overflow-x-auto rounded-lg p-4 transition-colors select-none',
            'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800'
          )}
          onClick={openFullscreen}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={isFullscreen}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openFullscreen()
            }
          }}
        >
          {/* Loading state */}
          {!isLoaded && (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2">Loading diagram...</span>
            </div>
          )}

          {/* Diagram container */}
          <div
            ref={mermaidRef}
            className={twclsx(
              'flex w-full items-center justify-center [&>svg]:max-h-[50vh]',
              !isLoaded && 'opacity-0 h-0',
              isLoaded && 'opacity-100'
            )}
          />

          {/* Expand icon - appears on hover */}
          {isLoaded && (
            <div
              className={twclsx(
                'absolute top-2 right-2 p-1.5 rounded-md',
                'bg-gray-200/80 dark:bg-gray-700/80',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
            >
              <HiArrowsExpand className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>
      </figure>
    </>
  )
}

'use client'

import Link from 'next/link'

export interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

/**
 * Breadcrumbs component with JSON-LD structured data for SEO
 * Renders both visual breadcrumbs and schema.org BreadcrumbList
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always include Home as the first item
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', href: 'https://www.ahnafnafee.dev' },
    ...items
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-gray-500 dark:text-gray-400">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                )}
                {isLast ? (
                  <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[200px] sm:max-w-none">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

/**
 * Generate breadcrumb JSON-LD for server components
 * Use this when you only need the structured data without visual breadcrumbs
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', href: 'https://www.ahnafnafee.dev' },
    ...items
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href
    }))
  }
}

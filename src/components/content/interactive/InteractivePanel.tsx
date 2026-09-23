'use client'

import { useState } from 'react'

type InteractiveView = {
  id: string
  label: string
  content: React.ReactNode
}

type InteractivePanelProps = {
  ariaLabel: string
  eyebrow: string
  title: string
  description: string
  views: readonly InteractiveView[]
  preserveInactiveViews?: boolean
}

export const InteractivePanel: React.FunctionComponent<InteractivePanelProps> = ({
  ariaLabel,
  eyebrow,
  title,
  description,
  views,
  preserveInactiveViews = false
}) => {
  const [selectedView, setSelectedView] = useState(views[0]?.id)
  const activeView = views.find((view) => view.id === selectedView) ?? views[0]

  if (!activeView) return null

  return (
    <section
      aria-label={ariaLabel}
      className='not-prose border-border bg-card text-card-foreground my-9 overflow-hidden rounded-2xl border shadow-sm'
    >
      <div className='border-border border-b px-5 py-5 sm:px-7'>
        <p className='m-0 text-xs font-bold tracking-[0.16em] text-purple-700 uppercase dark:text-purple-300'>
          {eyebrow}
        </p>
        <h3 className='text-card-foreground mt-1 mb-2 text-xl font-bold sm:text-2xl'>{title}</h3>
        <p className='text-muted-foreground m-0 max-w-2xl text-sm leading-6'>{description}</p>
        {views.length > 1 && (
          <div className='mt-5 grid grid-cols-2 gap-2 sm:flex' role='group' aria-label={`${title} views`}>
            {views.map((view) => (
              <button
                key={view.id}
                type='button'
                aria-pressed={activeView.id === view.id}
                onClick={() => setSelectedView(view.id)}
                className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:px-3 sm:text-sm ${activeView.id === view.id ? 'border-purple-600 bg-purple-600 text-white' : 'border-border bg-background text-foreground hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-300'}`}
              >
                {view.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {preserveInactiveViews ? (
        views.map((view) => (
          <div key={view.id} hidden={view.id !== activeView.id} className='bg-muted/20 p-5 sm:p-7'>
            {view.content}
          </div>
        ))
      ) : (
        <div className='bg-muted/20 p-5 sm:p-7'>{activeView.content}</div>
      )}
    </section>
  )
}

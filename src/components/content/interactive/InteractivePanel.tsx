'use client'

import { useId, useRef, useState } from 'react'

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
  const instanceId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [selectedView, setSelectedView] = useState(views[0]?.id)
  const activeView = views.find((view) => view.id === selectedView) ?? views[0]
  const hasTabs = views.length > 1

  if (!activeView) return null

  const selectWithKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = views.findIndex((view) => view.id === activeView.id)
    const nextIndex =
      event.key === 'ArrowRight'
        ? (currentIndex + 1) % views.length
        : event.key === 'ArrowLeft'
          ? (currentIndex - 1 + views.length) % views.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? views.length - 1
              : -1

    if (nextIndex < 0) return
    event.preventDefault()
    setSelectedView(views[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  const renderView = (view: InteractiveView) => (
    <div
      key={view.id}
      id={`${instanceId}-panel-${view.id}`}
      role={hasTabs ? 'tabpanel' : undefined}
      aria-labelledby={hasTabs ? `${instanceId}-tab-${view.id}` : undefined}
      tabIndex={hasTabs ? 0 : undefined}
      hidden={hasTabs && view.id !== activeView.id}
      className='bg-muted/20 p-5 sm:p-7'
    >
      {preserveInactiveViews || view.id === activeView.id ? view.content : null}
    </div>
  )

  return (
    <section
      aria-label={ariaLabel}
      className='not-prose border-border bg-card text-card-foreground my-9 overflow-hidden rounded-2xl border shadow-sm'
    >
      <div className='border-border border-b px-5 sm:px-7' style={{ paddingBlock: 20 }}>
        <p className='m-0 text-xs font-bold tracking-[0.16em] text-purple-700 uppercase dark:text-purple-300'>
          {eyebrow}
        </p>
        <h3 className='text-card-foreground mt-1 mb-2 text-xl font-bold sm:text-2xl'>{title}</h3>
        <p className='text-muted-foreground m-0 max-w-2xl text-sm leading-6'>{description}</p>
        {hasTabs && (
          <div
            className='mt-5 gap-2'
            style={{ display: 'flex' }}
            role='tablist'
            aria-label={`${title} views`}
            onKeyDown={selectWithKeyboard}
          >
            {views.map((view, index) => (
              <button
                key={view.id}
                ref={(element) => {
                  tabRefs.current[index] = element
                }}
                id={`${instanceId}-tab-${view.id}`}
                type='button'
                role='tab'
                aria-selected={activeView.id === view.id}
                aria-controls={`${instanceId}-panel-${view.id}`}
                tabIndex={activeView.id === view.id ? 0 : -1}
                onClick={() => setSelectedView(view.id)}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  ...(activeView.id === view.id
                    ? { backgroundColor: '#7C3AED', borderColor: '#7C3AED', color: '#FFFFFF' }
                    : {})
                }}
                className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:px-3 sm:text-sm ${activeView.id === view.id ? 'border-purple-600 bg-purple-600 text-white' : 'border-border bg-background text-foreground hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-300'}`}
              >
                {view.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {views.map(renderView)}
    </section>
  )
}

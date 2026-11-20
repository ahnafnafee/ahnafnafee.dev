'use client'

import NextImage from 'next/image'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const noSubscription = () => () => {}

export type Slide = {
  src: string
  alt: string
  title: string
  /** Optional spoken narration for the slide, one string per paragraph. */
  notes?: readonly string[]
  /** Optional time range in the talk, e.g. '0:30' to '1:15'. */
  start?: string
  end?: string
}

type SlideDeckProps = {
  ariaLabel: string
  eyebrow: string
  title: string
  description: string
  slides: readonly Slide[]
  /** Intrinsic slide size; slides are shown at this aspect ratio. */
  width?: number
  height?: number
  notesLabel?: string
}

export const SlideDeck: React.FunctionComponent<SlideDeckProps> = ({
  ariaLabel,
  eyebrow,
  title,
  description,
  slides,
  width = 1600,
  height = 900,
  notesLabel = 'What I said'
}) => {
  const [index, setIndex] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // False on the server, so the button appears only after hydration where the API exists.
  const canFullscreen = useSyncExternalStore(
    noSubscription,
    () => Boolean(document.fullscreenEnabled),
    () => false
  )
  const stageRef = useRef<HTMLDivElement>(null)
  const slide = slides[index]
  const hasNotes = slides.some((candidate) => candidate.notes?.length)

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  if (!slide) return null

  const clamp = (value: number) => Math.min(slides.length - 1, Math.max(0, value))
  const goTo = (target: number) => setIndex(clamp(target))
  // Relative moves read the latest index so quick repeated presses each advance one slide.
  const step = (delta: number) => setIndex((current) => clamp(current + delta))

  const navigateWithKeyboard = (event: React.KeyboardEvent<HTMLElement>) => {
    const action = {
      ArrowRight: () => step(1),
      ArrowLeft: () => step(-1),
      Home: () => goTo(0),
      End: () => goTo(slides.length - 1)
    }[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void stageRef.current?.requestFullscreen()
  }

  const buttonClass =
    'border-border bg-background text-foreground rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:border-purple-500 hover:text-purple-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground dark:hover:text-purple-300'

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription='slide deck'
      onKeyDown={navigateWithKeyboard}
      className='not-prose border-border bg-card text-card-foreground my-9 overflow-hidden rounded-2xl border shadow-sm'
    >
      <div className='border-border border-b px-5 sm:px-7' style={{ paddingBlock: 20 }}>
        <p className='m-0 text-xs font-bold tracking-[0.16em] text-purple-700 uppercase dark:text-purple-300'>
          {eyebrow}
        </p>
        <h3 className='text-card-foreground mt-1 mb-2 text-xl font-bold sm:text-2xl'>{title}</h3>
        <p className='text-muted-foreground m-0 max-w-2xl text-sm leading-6'>{description}</p>
      </div>

      <div className='bg-muted/20 space-y-4 p-4 sm:p-6'>
        <div
          ref={stageRef}
          tabIndex={0}
          aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.title}. Use the arrow keys to change slides.`}
          className={`border-border relative overflow-hidden rounded-xl border bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${isFullscreen ? 'flex items-center justify-center bg-black' : ''}`}
        >
          <NextImage
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={width}
            height={height}
            sizes='(max-width: 768px) 100vw, 768px'
            priority={index === 0}
            className={isFullscreen ? 'max-h-screen w-auto object-contain' : 'block h-auto w-full'}
          />
          {isFullscreen && (
            <div className='absolute right-4 bottom-4 flex gap-2'>
              <button type='button' onClick={() => step(-1)} disabled={index === 0} className={buttonClass}>
                Previous
              </button>
              <button
                type='button'
                onClick={() => step(1)}
                disabled={index === slides.length - 1}
                className={buttonClass}
              >
                Next
              </button>
              <button type='button' onClick={toggleFullscreen} className={buttonClass}>
                Exit full screen
              </button>
            </div>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() => step(-1)}
            disabled={index === 0}
            aria-label='Previous slide'
            className={buttonClass}
          >
            ← Prev
          </button>
          <button
            type='button'
            onClick={() => step(1)}
            disabled={index === slides.length - 1}
            aria-label='Next slide'
            className={buttonClass}
          >
            Next →
          </button>
          <p aria-live='polite' className='text-card-foreground m-0 min-w-0 flex-1 px-1 text-sm'>
            <span className='font-mono tabular-nums'>
              {index + 1} / {slides.length}
            </span>{' '}
            <span className='text-muted-foreground'>· {slide.title}</span>
          </p>
          {hasNotes && (
            <button
              type='button'
              aria-pressed={showNotes}
              onClick={() => setShowNotes((value) => !value)}
              className={`${buttonClass} ${showNotes ? 'border-purple-600 bg-purple-600 text-white hover:text-white dark:hover:text-white' : ''}`}
            >
              {notesLabel}
            </button>
          )}
          {canFullscreen && (
            <button type='button' onClick={toggleFullscreen} className={buttonClass}>
              Full screen
            </button>
          )}
        </div>

        <div className='flex gap-2 overflow-x-auto pb-1' role='group' aria-label='Choose a slide'>
          {slides.map((candidate, candidateIndex) => (
            <button
              key={candidate.src}
              type='button'
              onClick={() => goTo(candidateIndex)}
              aria-label={`Go to slide ${candidateIndex + 1}: ${candidate.title}`}
              aria-current={candidateIndex === index ? 'true' : undefined}
              className={`relative w-24 flex-shrink-0 overflow-hidden rounded-md border-2 bg-white transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:w-28 ${candidateIndex === index ? 'border-purple-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <NextImage
                src={candidate.src}
                alt=''
                width={width}
                height={height}
                sizes='112px'
                className='block h-auto w-full'
              />
            </button>
          ))}
        </div>

        {showNotes && slide.notes?.length ? (
          <div className='border-border bg-card rounded-xl border p-4 sm:p-5'>
            <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
              {notesLabel}
              {slide.start && slide.end ? ` · ${slide.start} to ${slide.end}` : ''}
            </p>
            {slide.notes.map((paragraph) => (
              <p key={paragraph} className='text-card-foreground mt-2 mb-0 text-sm leading-6'>
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

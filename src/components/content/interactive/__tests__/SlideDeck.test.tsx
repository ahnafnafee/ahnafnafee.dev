import { SlideDeck } from '../SlideDeck'

import { fireEvent, render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

const slides = [
  { src: '/a.webp', alt: 'First slide', title: 'Intro', start: '0:00', end: '0:30', notes: ['Opening line.'] },
  { src: '/b.webp', alt: 'Second slide', title: 'Method', notes: ['Method line.'] },
  { src: '/c.webp', alt: 'Third slide', title: 'Close' }
]

const renderDeck = () =>
  render(
    <SlideDeck ariaLabel='Example deck' eyebrow='Talk' title='Example' description='Three slides' slides={slides} />
  )

describe('SlideDeck', () => {
  it('moves with buttons, arrow keys and thumbnails within bounds', () => {
    renderDeck()
    const prev = screen.getByRole('button', { name: 'Previous slide' })
    const next = screen.getByRole('button', { name: 'Next slide' })
    expect(prev).toBeDisabled()
    expect(screen.getByRole('img', { name: 'First slide' })).toBeInTheDocument()

    fireEvent.click(next)
    expect(screen.getByRole('img', { name: 'Second slide' })).toBeInTheDocument()

    fireEvent.keyDown(screen.getByLabelText(/^Slide 2 of 3/), { key: 'End' })
    expect(screen.getByRole('img', { name: 'Third slide' })).toBeInTheDocument()
    expect(next).toBeDisabled()

    fireEvent.keyDown(screen.getByLabelText(/^Slide 3 of 3/), { key: 'ArrowLeft' })
    expect(screen.getByRole('img', { name: 'Second slide' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 1: Intro' }))
    expect(screen.getByRole('button', { name: 'Go to slide 1: Intro' })).toHaveAttribute('aria-current', 'true')
  })

  it('advances one slide per click even when clicks arrive in the same tick', () => {
    renderDeck()
    const next = screen.getByRole('button', { name: 'Next slide' })
    fireEvent.click(next)
    fireEvent.click(next)
    expect(screen.getByRole('img', { name: 'Third slide' })).toBeInTheDocument()
  })

  it('shows the current slide narration with its time range when toggled', () => {
    renderDeck()
    const toggle = screen.getByRole('button', { name: 'What I said' })
    expect(screen.queryByText('Opening line.')).not.toBeInTheDocument()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Opening line.')).toBeInTheDocument()
    expect(screen.getByText(/0:00 to 0:30/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByText('Method line.')).toBeInTheDocument()
    expect(screen.queryByText('Opening line.')).not.toBeInTheDocument()
  })
})

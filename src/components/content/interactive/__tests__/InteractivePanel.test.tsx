import { InteractivePanel } from '../InteractivePanel'

import { fireEvent, render, screen, within } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { useState } from 'react'
import { describe, expect, it } from 'vitest'

function CounterView() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((value) => value + 1)}>Count: {count}</button>
}

const views = [
  { id: 'first', label: 'First', content: <CounterView /> },
  { id: 'second', label: 'Second', content: <p>Another feature view</p> }
]

describe('InteractivePanel', () => {
  it('composes independent views with an accessible tab interface and retains hidden state when requested', () => {
    render(
      <InteractivePanel
        ariaLabel='Example interactive'
        eyebrow='Example'
        title='A reusable panel'
        description='Two independent views'
        views={views}
        preserveInactiveViews
      />
    )

    const tabs = screen.getByRole('tablist', { name: 'A reusable panel views' })
    const first = within(tabs).getByRole('tab', { name: 'First' })
    const second = within(tabs).getByRole('tab', { name: 'Second' })
    expect(first).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Count: 0' }))
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(second).toHaveFocus()
    expect(second).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Second' })).toBeVisible()
    expect(document.getElementById(first.getAttribute('aria-controls')!)).not.toBeVisible()

    fireEvent.keyDown(second, { key: 'Home' })
    expect(first).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Count: 1' })).toBeVisible()
  })

  it('supports a standalone view without a tab strip', () => {
    render(
      <InteractivePanel
        ariaLabel='Single-view interactive'
        eyebrow='Example'
        title='One view'
        description='A compact feature'
        views={[{ id: 'only', label: 'Only', content: <p>Single feature</p> }]}
      />
    )

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.getByText('Single feature')).toBeVisible()
  })
})

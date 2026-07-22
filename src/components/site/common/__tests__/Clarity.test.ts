import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const init = vi.fn()
const consentV2 = vi.fn()

vi.mock('@microsoft/clarity', () => ({ default: { init, consentV2 } }))
vi.mock('@/libs/constants/environmentState', () => ({ isProd: true }))

type TcData = {
  gdprApplies?: boolean
  eventStatus?: string
  purpose?: { consents?: Record<number, boolean> }
}
type TcCallback = (data: TcData, success: boolean) => void

const grantedPurposes = { consents: { 1: true, 8: true } }

let unmount: (() => void) | undefined

/** Mounts <Clarity /> and returns the CMP callback it registered, if any. */
async function mountClarity() {
  let listener: TcCallback | undefined
  const tcfWindow = window as Window & { __tcfapi?: unknown }

  if (tcfWindow.__tcfapi === 'stub') {
    tcfWindow.__tcfapi = (cmd: string, _version: number, cb: TcCallback) => {
      if (cmd === 'addEventListener') listener = cb
    }
  }

  const { Clarity } = await import('../Clarity')
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(createElement(Clarity))
  })
  unmount = () => act(() => root.unmount())

  // The component polls for __tcfapi every 100ms before registering.
  await act(async () => {
    vi.advanceTimersByTime(100)
  })

  return (data: TcData, success = true) => listener?.(data, success)
}

/** Marks __tcfapi as present so mountClarity installs a capturing stub. */
function withCmp() {
  ;(window as Window & { __tcfapi?: unknown }).__tcfapi = 'stub'
}

describe('Clarity consent gate', () => {
  beforeEach(() => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    vi.resetModules()
    vi.useFakeTimers()
    init.mockClear()
    consentV2.mockClear()
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = 'test-project'
    delete (window as Window & { __tcfapi?: unknown }).__tcfapi
  })

  afterEach(() => {
    unmount?.()
    unmount = undefined
    vi.useRealTimers()
  })

  it('starts once no CMP appears within the timeout', async () => {
    await mountClarity()
    expect(init).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(init).toHaveBeenCalledWith('test-project')
    expect(consentV2).toHaveBeenCalledWith({ ad_Storage: 'denied', analytics_Storage: 'granted' })
  })

  it('starts immediately when GDPR does not apply to the visitor', async () => {
    withCmp()
    const emit = await mountClarity()

    emit({ gdprApplies: false, eventStatus: 'tcloaded' })

    expect(init).toHaveBeenCalledWith('test-project')
  })

  it('waits for the visitor to answer the banner, then starts once', async () => {
    withCmp()
    const emit = await mountClarity()

    emit({ gdprApplies: true, eventStatus: 'cmpuishown' })
    expect(init).not.toHaveBeenCalled()

    emit({ gdprApplies: true, eventStatus: 'useractioncomplete', purpose: grantedPurposes })
    emit({ gdprApplies: true, eventStatus: 'useractioncomplete', purpose: grantedPurposes })

    expect(init).toHaveBeenCalledTimes(1)
  })

  it('never starts when the visitor withholds a required purpose', async () => {
    withCmp()
    const emit = await mountClarity()

    emit({ gdprApplies: true, eventStatus: 'useractioncomplete', purpose: { consents: { 1: true } } })
    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })

    expect(init).not.toHaveBeenCalled()
  })

  it('ignores unsuccessful CMP callbacks', async () => {
    withCmp()
    const emit = await mountClarity()

    emit({ gdprApplies: false, eventStatus: 'tcloaded' }, false)

    expect(init).not.toHaveBeenCalled()
  })

  it('does nothing without a project id', async () => {
    delete process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    await mountClarity()

    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })

    expect(init).not.toHaveBeenCalled()
  })
})

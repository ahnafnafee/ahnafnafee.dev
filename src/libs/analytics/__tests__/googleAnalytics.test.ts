import { runInNewContext } from 'node:vm'

import { googleAnalyticsScript } from '../googleAnalytics'

import { describe, expect, it, vi } from 'vitest'

function runTag(url: string) {
  const window = {
    location: new URL(url),
    dataLayer: undefined as IArguments[] | undefined,
    gtag: undefined as ((...args: unknown[]) => void) | undefined
  }
  const scripts: { async?: boolean; src?: string }[] = []
  const document = {
    createElement: vi.fn(() => ({})),
    head: {
      appendChild: vi.fn((script: (typeof scripts)[number]) => {
        // Consent and configuration must be ready when the external tag loads.
        expect(window.dataLayer?.map((entry) => entry[0])).toEqual(['consent', 'set', 'js', 'config'])
        scripts.push(script)
      })
    }
  }

  runInNewContext(googleAnalyticsScript, { window, document })
  return { window, document, scripts }
}

describe('Google Analytics host restrictions', () => {
  it.each([
    'https://ahnafnafee.dev/',
    'https://www.ahnafnafee.dev/blog/example',
    'https://mason.gmu.edu/~aannafee',
    'https://mason.gmu.edu/~aannafee/',
    'https://mason.gmu.edu/~aannafee/blog/example'
  ])('loads the tag on an approved site: %s', (url) => {
    const { window, scripts } = runTag(url)

    expect(scripts).toEqual([{ async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-7S76865HNX' }])
    expect(Array.from(window.dataLayer![0])).toEqual([
      'consent',
      'default',
      expect.objectContaining({ analytics_storage: 'denied', ad_storage: 'denied', wait_for_update: 500 })
    ])
    expect(Array.from(window.dataLayer![3])).toEqual(['config', 'G-7S76865HNX'])
  })

  it('keeps the global consent API available for later CMP updates', () => {
    const { window } = runTag('https://www.ahnafnafee.dev/')

    window.gtag!('consent', 'update', { analytics_storage: 'granted' })

    expect(Array.from(window.dataLayer![4])).toEqual(['consent', 'update', { analytics_storage: 'granted' }])
  })

  it.each([
    'https://copied-portfolio.vercel.app/',
    'https://preview.ahnafnafee.dev/',
    'https://ahnafnafee.dev.example.com/',
    'https://www.ahnafnafee.dev.example.com/',
    'https://example.com/?host=www.ahnafnafee.dev',
    'http://localhost:3000/',
    'https://mason.gmu.edu/',
    'https://mason.gmu.edu/~anotheruser/',
    'https://mason.gmu.edu/~aannafee-copy/'
  ])('does not initialize or request the tag elsewhere: %s', (url) => {
    const { window, document, scripts } = runTag(url)

    expect(window.dataLayer).toBeUndefined()
    expect(window.gtag).toBeUndefined()
    expect(document.createElement).not.toHaveBeenCalled()
    expect(scripts).toEqual([])
  })
})

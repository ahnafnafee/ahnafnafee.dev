// @vitest-environment node
import { createRequire } from 'node:module'

import { afterEach, describe, expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const { push } = require('../scripts/baidu-push.js')

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('Baidu credential transport', () => {
  it('sends the encoded token only to the fixed HTTPS endpoint and rejects redirects', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: 1 }) })
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    await expect(push(['https://example.test/post'], { token: 'test+&token', host: 'example.test' })).resolves.toEqual({
      ok: true,
      submitted: 1
    })
    const [url, options] = fetchMock.mock.calls[0]
    expect(new URL(url).origin).toBe('https://data.zz.baidu.com')
    expect(new URL(url).searchParams.get('token')).toBe('test+&token')
    expect(options.redirect).toBe('error')
    expect(options.signal).toBeInstanceOf(AbortSignal)
  })

  it('does not retry or downgrade after a certificate or redirect failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('TLS or redirect failure'))
    vi.stubGlobal('fetch', fetchMock)
    await expect(push(['https://example.test/post'], { token: 'test-token' })).rejects.toThrow(
      'TLS or redirect failure'
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toMatch(/^https:/)
  })

  it('skips without contacting the provider when no token is configured', async () => {
    vi.stubEnv('BAIDU_PUSH_TOKEN', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    expect(await push(['https://example.test/post'])).toEqual({ ok: true, skipped: true })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

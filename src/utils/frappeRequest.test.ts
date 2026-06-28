// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { frappeRequest } from './frappeRequest'
import { setConfig } from './config'

function mockFetch() {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: async () => ({ message: 'ok' }),
  }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('frappeRequest configurable base url and auth headers', () => {
  beforeEach(() => {
    setConfig('requestBaseUrl', undefined)
    setConfig('requestHeaders', undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    setConfig('requestBaseUrl', undefined)
    setConfig('requestHeaders', undefined)
  })

  it('keeps default behavior when nothing is configured', async () => {
    const fetchMock = mockFetch()
    await frappeRequest({ url: 'ping' })

    const [url, opts] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/method/ping')
    expect(opts.credentials).toBeUndefined()
    expect(opts.headers.Authorization).toBeUndefined()
  })

  it('prepends the configured base url and includes credentials', async () => {
    setConfig('requestBaseUrl', 'https://remote.frappe.test/')
    const fetchMock = mockFetch()
    await frappeRequest({ url: 'ping' })

    const [url, opts] = fetchMock.mock.calls[0]
    expect(url).toBe('https://remote.frappe.test/api/method/ping')
    expect(opts.credentials).toBe('include')
  })

  it('injects static headers from config', async () => {
    setConfig('requestHeaders', { Authorization: 'token key:secret' })
    const fetchMock = mockFetch()
    await frappeRequest({ url: 'ping' })

    const [, opts] = fetchMock.mock.calls[0]
    expect(opts.headers.Authorization).toBe('token key:secret')
  })

  it('injects headers from a function returning headers', async () => {
    setConfig('requestHeaders', () => ({ Authorization: 'token dynamic:value' }))
    const fetchMock = mockFetch()
    await frappeRequest({ url: 'ping' })

    const [, opts] = fetchMock.mock.calls[0]
    expect(opts.headers.Authorization).toBe('token dynamic:value')
  })
})

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { frappeRequest } from './frappeRequest'
import { setConfig } from './config'

function mockFetch() {
  const fetchMock = vi.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit) =>
      ({
        ok: true,
        json: async () => ({ message: 'ok' }),
      }) as Response,
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function getFetchCall(fetchMock: ReturnType<typeof mockFetch>) {
  const [url, opts] = fetchMock.mock.calls[0]!
  return {
    url,
    opts: opts as RequestInit & {
      headers: Record<string, string | undefined>
    },
  }
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

    const { url, opts } = getFetchCall(fetchMock)
    expect(url).toBe('/api/method/ping')
    expect(opts.credentials).toBeUndefined()
    expect(opts.headers.Authorization).toBeUndefined()
  })

  it('prepends the configured base url and includes credentials', async () => {
    setConfig('requestBaseUrl', 'https://remote.frappe.test/')
    const fetchMock = mockFetch()
    await frappeRequest({ url: 'ping' })

    const { url, opts } = getFetchCall(fetchMock)
    expect(url).toBe('https://remote.frappe.test/api/method/ping')
    expect(opts.credentials).toBe('include')
  })

  it('injects static headers from config', async () => {
    setConfig('requestHeaders', { Authorization: 'token key:secret' })
    const fetchMock = mockFetch()
    await frappeRequest({ url: 'ping' })

    const { opts } = getFetchCall(fetchMock)
    expect(opts.headers.Authorization).toBe('token key:secret')
  })

  it('injects headers from a function returning headers', async () => {
    setConfig('requestHeaders', () => ({
      Authorization: 'token dynamic:value',
    }))
    const fetchMock = mockFetch()
    await frappeRequest({ url: 'ping' })

    const { opts } = getFetchCall(fetchMock)
    expect(opts.headers.Authorization).toBe('token dynamic:value')
  })
})

describe('frappeRequest error handling', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports a failed response to onError exactly once', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          ({
            ok: false,
            status: 417,
            text: async () =>
              JSON.stringify({
                exc_type: 'ValidationError',
                _server_messages: JSON.stringify(['Name is required']),
              }),
          }) as unknown as Response,
      ),
    )
    const onError = vi.fn()

    await expect(frappeRequest({ url: 'ping', onError })).rejects.toThrow()

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0]![0]).toMatchObject({
      exc_type: 'ValidationError',
      status: 417,
      messages: ['Name is required'],
    })
  })

  it('reports a transport failure to onError exactly once', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const onError = vi.fn()

    await expect(frappeRequest({ url: 'ping', onError })).rejects.toThrow(
      'Failed to fetch',
    )

    expect(onError).toHaveBeenCalledTimes(1)
  })
})

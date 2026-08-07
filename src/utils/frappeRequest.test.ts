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

// `login` is the one endpoint that resolves to the whole body rather than
// `data.message`. The check used to compare the whole URL against
// `/api/method/login`, which stopped matching the moment `requestBaseUrl` made
// the URL absolute — `login` then quietly returned just `data.message`.
describe('frappeRequest login special case', () => {
  const body = { message: 'Logged In', full_name: 'Ada', home_page: '/app' }

  beforeEach(() => {
    setConfig('requestBaseUrl', undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    setConfig('requestBaseUrl', undefined)
  })

  function mockLogin() {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => body }) as Response),
    )
  }

  it('returns the whole payload for a relative login url', async () => {
    mockLogin()

    await expect(frappeRequest({ url: 'login' })).resolves.toEqual(body)
  })

  it('returns the whole payload when requestBaseUrl makes the url absolute', async () => {
    setConfig('requestBaseUrl', 'https://remote.frappe.test/')
    mockLogin()

    await expect(frappeRequest({ url: 'login' })).resolves.toEqual(body)
  })

  it('does not treat a method merely ending in login as the login endpoint', async () => {
    setConfig('requestBaseUrl', 'https://remote.frappe.test/')
    mockLogin()

    await expect(frappeRequest({ url: 'myapp.auth.login' })).resolves.toBe(
      'Logged In',
    )
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

  // The failure only `transformError` sees. Frappe answers an expired session
  // with 200 and its login page, so the response is ok and `response.json()`
  // throws. Fixing the double-report by narrowing what the rejection handler
  // could see would have dropped this one entirely.
  it('reports an ok response that fails to parse, exactly once', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          ({
            ok: true,
            status: 200,
            json: async () => {
              throw new SyntaxError('Unexpected token < in JSON at position 0')
            },
          }) as unknown as Response,
      ),
    )
    const onError = vi.fn()

    await expect(frappeRequest({ url: 'ping', onError })).rejects.toThrow(
      SyntaxError,
    )

    expect(onError).toHaveBeenCalledTimes(1)
  })
})

describe('frappeRequest method-to-url mapping', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    setConfig('requestBaseUrl', undefined)
  })

  function mockFetchOk() {
    const fetchMock = vi.fn(
      async () => ({ ok: true, json: async () => ({ message: 'ok' }) }) as Response,
    )
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
  }

  it('leaves an absolute url alone', async () => {
    const fetchMock = mockFetchOk()
    await frappeRequest({ url: 'https://other.test/api/method/ping' })

    expect(getFetchCall(fetchMock).url).toBe(
      'https://other.test/api/method/ping',
    )
  })

  // `startsWith('http')` matched the four letters, not a scheme, so a dotted
  // method in an app whose name begins with them skipped the prefix and was
  // fetched as a relative path.
  it('prefixes a dotted method whose app name starts with http', async () => {
    const fetchMock = mockFetchOk()
    await frappeRequest({ url: 'http_utils.api.run' })

    expect(getFetchCall(fetchMock).url).toBe('/api/method/http_utils.api.run')
  })

  it('applies requestBaseUrl to that method too', async () => {
    setConfig('requestBaseUrl', 'https://remote.frappe.test')
    const fetchMock = mockFetchOk()
    await frappeRequest({ url: 'http_utils.api.run' })

    expect(getFetchCall(fetchMock).url).toBe(
      'https://remote.frappe.test/api/method/http_utils.api.run',
    )
  })
})

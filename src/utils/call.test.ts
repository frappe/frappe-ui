// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import call from './call'
import { setConfig } from './config'

type FetchMock = ReturnType<typeof vi.fn>

function mockFetch(response: Record<string, unknown> = {}) {
  const fetchMock = vi.fn(
    async () =>
      ({
        ok: true,
        status: 200,
        json: async () => ({ message: 'ok' }),
        ...response,
      }) as unknown as Response,
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function getFetchCall(fetchMock: FetchMock) {
  const [url, opts] = fetchMock.mock.calls[0]!
  return {
    url: url as string,
    opts: opts as RequestInit & { headers: Record<string, string | undefined> },
  }
}

describe('call', () => {
  beforeEach(() => {
    setConfig('requestBaseUrl', undefined)
    setConfig('requestHeaders', undefined)
    setConfig('serverMessagesHandler', undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    setConfig('requestBaseUrl', undefined)
    setConfig('requestHeaders', undefined)
    setConfig('serverMessagesHandler', undefined)
  })

  it('POSTs a dotted method path and unwraps `message`', async () => {
    const fetchMock = mockFetch()

    const result = await call('frappe.client.get_count', { doctype: 'ToDo' })

    const { url, opts } = getFetchCall(fetchMock)
    expect(url).toBe('/api/method/frappe.client.get_count')
    expect(opts.method).toBe('POST')
    expect(opts.body).toBe(JSON.stringify({ doctype: 'ToDo' }))
    expect(opts.headers['Content-Type']).toBe('application/json; charset=utf-8')
    expect(result).toBe('ok')
  })

  it('sends an empty body when no args are passed', async () => {
    const fetchMock = mockFetch()

    await call('ping')

    expect(getFetchCall(fetchMock).opts.body).toBe('{}')
  })

  it('uses an absolute path as-is', async () => {
    const fetchMock = mockFetch()

    await call('/api/method/ping')

    expect(getFetchCall(fetchMock).url).toBe('/api/method/ping')
  })

  it('returns the whole payload for login', async () => {
    mockFetch({
      json: async () => ({ message: 'Logged In', full_name: 'Ada' }),
    })

    const result = await call('login', { usr: 'ada', pwd: 'x' })

    expect(result).toEqual({ message: 'Logged In', full_name: 'Ada' })
  })

  // The reason `call` delegates: it built its own fetch and never read
  // `getConfig`, so both of these were silently ignored.
  it('honours requestBaseUrl', async () => {
    setConfig('requestBaseUrl', 'https://remote.frappe.test/')
    const fetchMock = mockFetch()

    await call('ping')

    const { url, opts } = getFetchCall(fetchMock)
    expect(url).toBe('https://remote.frappe.test/api/method/ping')
    expect(opts.credentials).toBe('include')
  })

  it('honours requestHeaders', async () => {
    setConfig('requestHeaders', { Authorization: 'token key:secret' })
    const fetchMock = mockFetch()

    await call('ping')

    expect(getFetchCall(fetchMock).opts.headers.Authorization).toBe(
      'token key:secret',
    )
  })

  it('lets per-call headers win over configured ones', async () => {
    setConfig('requestHeaders', { 'X-Trace': 'config' })
    const fetchMock = mockFetch()

    await call('ping', {}, { headers: { 'X-Trace': 'per-call' } })

    expect(getFetchCall(fetchMock).opts.headers['X-Trace']).toBe('per-call')
  })

  it('routes _server_messages through the configured handler', async () => {
    const handler = vi.fn()
    setConfig('serverMessagesHandler', handler)
    mockFetch({
      json: async () => ({
        message: 'ok',
        _server_messages: JSON.stringify(['Saved']),
      }),
    })

    await call('ping')

    expect(handler).toHaveBeenCalledWith(['Saved'])
  })

  it('rejects with an error carrying exc_type, status and messages', async () => {
    mockFetch({
      ok: false,
      status: 417,
      text: async () =>
        JSON.stringify({
          exc_type: 'ValidationError',
          _server_messages: JSON.stringify(['Name is required']),
        }),
    })

    await expect(call('ping')).rejects.toMatchObject({
      exc_type: 'ValidationError',
      status: 417,
      messages: ['Name is required'],
    })
  })

  it('calls onError once with the response, status and error', async () => {
    mockFetch({
      ok: false,
      status: 403,
      text: async () => JSON.stringify({ exc_type: 'PermissionError' }),
    })
    const onError = vi.fn()

    await expect(call('ping', {}, { onError })).rejects.toThrow()

    expect(onError).toHaveBeenCalledTimes(1)
    const context = onError.mock.calls[0]![0]
    expect(context.status).toBe(403)
    expect(context.response).toBeDefined()
    expect(context.error.exc_type).toBe('PermissionError')
  })

  it('does not call onError for a transport failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const onError = vi.fn()

    await expect(call('ping', {}, { onError })).rejects.toThrow(
      'Failed to fetch',
    )

    expect(onError).not.toHaveBeenCalled()
  })
})

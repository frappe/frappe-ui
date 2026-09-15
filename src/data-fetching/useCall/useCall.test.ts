/**
 * @vitest-environment node
 */

import { ref } from 'vue'
import { useCall } from '../index'
import { url, waitUntilValueChanges } from '../../mocks/utils'
import { server } from '../../mocks/node'

describe('msw works', () => {
  it('ping responds with pong', async () => {
    const response = await fetch(url('/api/v2/method/ping'))

    expect(response.status).toBe(200)
    expect(response.statusText).toBe('OK')
    expect(await response.json()).toEqual({
      data: 'pong',
    })
  })
})

describe('useCall', () => {
  it('it returns expected reactive object', async () => {
    type PingResponse = string
    let ping = useCall<PingResponse>({
      url: url('/api/v2/method/ping'),
      immediate: false,
    })

    // Verify initial state
    expect(ping.loading).toBe(false)
    expect(ping.data).toBe(null)
    expect(ping.error).toBe(null)
    expect(typeof ping.execute).toBe('function')
    expect(typeof ping.submit).toBe('function')
    expect(typeof ping.reset).toBe('function')

    // Execute the call
    ping.execute()
    expect(ping.loading).toBe(true)

    await ping.promise
    await waitUntilValueChanges(() => ping.loading)

    // Verify final state
    expect(ping.data).toBe('pong')
    expect(ping.error).toBe(null)
    expect(ping.isFinished).toBe(true)
    expect(ping.loading).toBe(false)
  })

  it('handles error responses', async () => {
    const onError = vi.fn()
    const errorCall = useCall({
      url: url('/api/v2/method/error'),
      onError,
      immediate: false,
    })

    errorCall.fetch()
    await errorCall.promise.catch(() => {})

    await waitUntilValueChanges(() => errorCall.loading)

    expect(errorCall.loading).toBe(false)
    expect(errorCall.error).toBeInstanceOf(Error)
    expect(errorCall.error.message).toEqual(
      'ServerError: Internal Server Error occurred',
    )
    expect(errorCall.data).toBe(null)
    expect(onError).toHaveBeenCalledWith(errorCall.error)
  })

  it('handles POST requests with params', async () => {
    type Response = { success: boolean; received: any }
    const postCall = useCall<Response, { name: string }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      params: { name: 'test' },
      immediate: false,
    })

    postCall.fetch()
    await postCall.promise

    expect(postCall.data).toEqual({
      success: true,
      received: { name: 'test' },
    })
  })

  it('supports dynamic params with reactive values', async () => {
    const dynamicValue = ref('test')
    const call = useCall<{ value: string }, { value: string }>({
      url: url('/api/v2/method/get'),
      params: () => ({ value: dynamicValue.value }),
      immediate: false,
    })

    call.fetch()
    await call.promise

    expect(call.url).toContain('value=test')
    expect(call.data).toEqual({ value: 'test' })
  })

  it('refetches automatically when a reactive param changes (refetch: true)', async () => {
    const dynamicValue = ref('first')
    const call = useCall<{ value: string }, { value: string }>({
      url: url('/api/v2/method/get'),
      params: () => ({ value: dynamicValue.value }),
      refetch: true,
    })

    await call.promise
    expect(call.data).toEqual({ value: 'first' })

    // No manual fetch()/reload() call — the param ref changing is what
    // triggers the next request.
    dynamicValue.value = 'second'
    await waitUntilValueChanges(() => call.data)

    expect(call.data).toEqual({ value: 'second' })
  })

  it('does not refetch on a param change when refetch is false (the default)', async () => {
    const dynamicValue = ref('first')
    const call = useCall<{ value: string }, { value: string }>({
      url: url('/api/v2/method/get'),
      params: () => ({ value: dynamicValue.value }),
    })

    await call.promise
    expect(call.data).toEqual({ value: 'first' })

    dynamicValue.value = 'second'
    await new Promise((r) => setTimeout(r, 10))

    expect(call.data).toEqual({ value: 'first' })
  })

  it('runs beforeSubmit before the request is sent, with the submitted params', async () => {
    const beforeSubmit = vi.fn()
    const call = useCall<{ success: boolean }, { name: string }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      immediate: false,
      beforeSubmit,
    })

    await call.submit({ name: 'test' })

    expect(beforeSubmit).toHaveBeenCalledWith({ name: 'test' })
  })

  it('does not send the request and rejects when beforeSubmit throws', async () => {
    const call = useCall<{ success: boolean }, { name: string }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      immediate: false,
      beforeSubmit: () => {
        throw new Error('invalid')
      },
    })

    await expect(call.submit({ name: 'test' })).rejects.toThrow('invalid')

    expect(call.loading).toBe(false)
    expect(call.data).toBe(null)
    expect(call.error).toBe(null)
  })

  it('shows initialData before the first response arrives', () => {
    const call = useCall<{ value: string }>({
      url: url('/api/v2/method/get'),
      initialData: { value: 'placeholder' },
      immediate: false,
    })

    expect(call.data).toEqual({ value: 'placeholder' })
  })

  it('transforms response data correctly', async () => {
    type Response = { numbers: number[] }
    const call = useCall<Response>({
      url: url('/api/v2/method/numbers'),
      transform: (data) => ({ numbers: data.numbers.map((n) => n * 2) }),
      refetch: true,
    })
    await call.promise
    expect(call.data).toEqual({ numbers: [2, 4, 6, 8] })
  })

  it('supports submit with different params', async () => {
    type Params = { value: string }
    type Response = { success: boolean; received: any }
    const call = useCall<Response, Params>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      refetch: true,
      immediate: false,
    })

    call.submit({ value: 'first submit' })
    await call.promise
    expect(call.data).toEqual({
      success: true,
      received: { value: 'first submit' },
    })

    // submit with another set of params
    call.submit({ value: 'second submit' })
    await call.promise
    expect(call.data).toEqual({
      success: true,
      received: { value: 'second submit' },
    })
  })

  it('supports submit with no params', async () => {
    type Response = { success: boolean; received: any }
    const call = useCall<Response>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      refetch: false,
      immediate: false,
    })

    call.submit()
    await waitUntilValueChanges(() => call.data)

    expect(call.data).toEqual({
      success: true,
      received: {},
    })
  })

  it('handles abort correctly', async () => {
    const call = useCall({
      url: url('/api/v2/method/slow'),
      immediate: false,
    })

    call.fetch()
    expect(call.loading).toBe(true)

    call.abort()
    expect(call.aborted).toBe(true)
  })

  it('supports generic type parameters for Response and Params', async () => {
    interface GetResponse {
      value: string
    }
    interface GetParams {
      value: string
    }
    const call = useCall<GetResponse, GetParams>({
      url: url('/api/v2/method/get'),
      immediate: false,
    })

    // @ts-expect-error
    await call.submit({ hello: 1 }).catch(() => {})

    await call.submit({ value: 'test' })
  })

  // Actions reject, reads resolve (DAT-Q1).
  it('rejects a failed submit and resolves a failed read', async () => {
    const call = useCall({
      url: url('/api/v2/method/error'),
      immediate: false,
    })

    await expect(call.submit()).rejects.toThrow('ServerError')
    expect(call.error).toBeTruthy()

    // The same failure, through every read name.
    await expect(call.execute()).resolves.toBe(null)
    await expect(call.fetch()).resolves.toBe(null)
    await expect(call.reload()).resolves.toBe(null)
    expect(call.error).toBeTruthy()
  })

  it('resolves a successful submit with the response', async () => {
    const call = useCall<{ success: boolean }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      immediate: false,
    })

    await expect(call.submit()).resolves.toMatchObject({ success: true })
    expect(call.error).toBe(null)
  })

  // `refetch: true` hands the dispatch to the parameter watcher. `submit()`
  // still has to answer for that request (DAT-Q1).
  it('rejects a failed submit when refetch is true', async () => {
    const call = useCall<{ success: boolean }, { value: string }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      refetch: true,
      immediate: false,
    })

    await expect(call.submit({ value: 'please fail' })).rejects.toThrow(
      'ValidationError: post failed',
    )
    expect(call.error).toBeTruthy()
    expect(call.loading).toBe(false)
  })

  it('resolves a successful submit with the response when refetch is true', async () => {
    const call = useCall<
      { success: boolean; received: any },
      { value: string }
    >({
      url: url('/api/v2/method/post'),
      method: 'POST',
      refetch: true,
      immediate: false,
    })

    await expect(call.submit({ value: 'first' })).resolves.toEqual({
      success: true,
      received: { value: 'first' },
    })
    expect(call.data).toEqual({ success: true, received: { value: 'first' } })

    // A second submit with new params goes through the watcher again.
    await expect(call.submit({ value: 'second' })).resolves.toEqual({
      success: true,
      received: { value: 'second' },
    })
    expect(call.error).toBe(null)
  })

  // No parameter change means no watcher, so `submit()` sends the request
  // itself. One request per call either way, and it still rejects on failure.
  it('sends the request itself when refetch is true and the params do not change', async () => {
    const call = useCall<{ success: boolean; received: any }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      refetch: true,
      immediate: false,
    })

    await expect(call.submit()).resolves.toEqual({
      success: true,
      received: {},
    })

    // The same object twice is not a parameter change either.
    const sameParams = { value: 'same' }
    const repeated = useCall<
      { success: boolean; received: any },
      { value: string }
    >({
      url: url('/api/v2/method/post'),
      method: 'POST',
      refetch: true,
      immediate: false,
    })
    await expect(repeated.submit(sameParams)).resolves.toEqual({
      success: true,
      received: { value: 'same' },
    })
    await expect(repeated.submit(sameParams)).resolves.toEqual({
      success: true,
      received: { value: 'same' },
    })

    const failing = useCall<{ success: boolean }, { value: string }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      params: { value: 'please fail' },
      refetch: true,
      immediate: false,
    })
    await expect(failing.submit()).rejects.toThrow('ValidationError: post failed')
  })

  it('sends one request per submit when refetch is true', async () => {
    let requests = 0
    const count = () => {
      requests += 1
    }
    server.events.on('request:start', count)
    const call = useCall<{ success: boolean }, { value: string }>({
      url: url('/api/v2/method/post'),
      method: 'POST',
      refetch: true,
      immediate: false,
    })

    try {
      await call.submit({ value: 'one' })
      await call.submit({ value: 'two' })
      await call.submit()
    } finally {
      server.events.removeListener('request:start', count)
    }

    expect(requests).toBe(3)
  })

  it('caches data if cacheKey is provided', async () => {
    const call = useCall({
      url: url('/api/v2/method/ping'),
      cacheKey: 'ping',
    })

    await waitUntilValueChanges(() => call.data)
    expect(call.data).toBe('pong')

    const secondCall = useCall({
      url: url('/api/v2/method/ping'),
      immediate: false,
      cacheKey: 'ping',
    })

    await waitUntilValueChanges(() => secondCall.data)
    expect(secondCall.data).toBe('pong')
  })

  it('keeps cached data visible when a refetch fails', async () => {
    const cacheKey = 'offline-ping'
    const call = useCall({
      url: url('/api/v2/method/ping'),
      cacheKey,
    })

    await waitUntilValueChanges(() => call.data)
    expect(call.data).toBe('pong')

    const offlineCall = useCall({
      url: url('/api/v2/method/network-error'),
      cacheKey,
      staleOnError: true,
    })

    await waitUntilValueChanges(() => offlineCall.data)
    await waitUntilValueChanges(() => offlineCall.loading)

    expect(offlineCall.error).toBeTruthy()
    expect(offlineCall.data).toBe('pong')
  })

  it('does not parse empty network failures as Frappe errors', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const networkCall = useCall({
      url: url('/api/v2/method/network-error'),
      immediate: false,
    })

    networkCall.fetch()
    await networkCall.promise.catch(() => {})
    await waitUntilValueChanges(() => networkCall.loading)

    expect(networkCall.error).toBeTruthy()
    expect(logSpy).not.toHaveBeenCalledWith(
      'Error parsing error response:',
      expect.anything(),
    )

    logSpy.mockRestore()
  })
})

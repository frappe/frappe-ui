/**
 * @vitest-environment node
 */

import { ref } from 'vue'
import { useCall } from '../index'
import { url, waitUntilValueChanges } from '../../mocks/utils'

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
    const postCall = useCall<Response>({
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
    const call = useCall<{ value: string }>({
      url: url('/api/v2/method/get'),
      params: () => ({ value: dynamicValue.value }),
      immediate: false,
    })

    call.fetch()
    await call.promise

    expect(call.url).toContain('value=test')
    expect(call.data).toEqual({ value: 'test' })
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
    call.submit({ hello: 1 })

    call.submit({ value: 'test' })
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
})

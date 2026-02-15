/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'
import { useFrappeFetch, FrappeResponseError } from '../useFrappeFetch'
import { baseUrl } from './mocks'
import { waitFor } from './setup'
import { http, HttpResponse } from 'msw'
import { server } from './mocks'
import './setup'

describe('useFrappeFetch', () => {
  it('fetches data successfully', async () => {
    server.use(
      http.get(`${baseUrl}/api/test`, () => {
        return HttpResponse.json({
          message: 'success',
          data: { id: 1, name: 'Test' },
        })
      }),
    )

    const result = useFrappeFetch({ url: '/api/test', baseUrl })

    expect(result.loading).toBe(true)
    expect(result.json).toBe(null)
    expect(result.error).toBe(null)

    await waitFor(() => !result.loading)

    expect(result.loading).toBe(false)
    expect(result.json).toStrictEqual({
      message: 'success',
      data: { id: 1, name: 'Test' },
    })
    expect(result.error).toBe(null)
  })

  it('handles 404 error with Frappe error format', async () => {
    server.use(
      http.get(`${baseUrl}/api/not-found`, () => {
        return HttpResponse.json(
          {
            errors: [
              {
                title: 'Not Found',
                message: 'Resource not found',
                type: 'NotFoundError',
                indicator: 'red',
              },
            ],
          },
          { status: 404 },
        )
      }),
    )

    const result = useFrappeFetch({ url: '/api/not-found', baseUrl })

    await waitFor(() => !result.loading)

    expect(result.loading).toBe(false)
    expect(result.json).toBe(null)
    expect(result.error).toBeInstanceOf(FrappeResponseError)
    expect((result.error as FrappeResponseError).type).toBe('NotFoundError')
    expect((result.error as FrappeResponseError).title).toBe('Not Found')
  })

  it('handles 500 error with Frappe error format', async () => {
    server.use(
      http.get(`${baseUrl}/api/server-error`, () => {
        return HttpResponse.json(
          {
            errors: [
              {
                title: 'Server Error',
                message: 'Internal server error',
                type: 'ServerError',
                indicator: 'red',
              },
            ],
          },
          { status: 500 },
        )
      }),
    )

    const result = useFrappeFetch({ url: '/api/server-error', baseUrl })

    await waitFor(() => !result.loading)

    expect(result.error).toBeInstanceOf(FrappeResponseError)
    expect((result.error as FrappeResponseError).type).toBe('ServerError')
  })

  it('handles generic HTTP errors', async () => {
    server.use(
      http.get(`${baseUrl}/api/generic-error`, () => {
        return new HttpResponse(null, {
          status: 503,
          statusText: 'Service Unavailable',
        })
      }),
    )

    const result = useFrappeFetch({ url: '/api/generic-error', baseUrl })

    await waitFor(() => !result.loading)

    expect(result.error).toBeInstanceOf(Error)
    expect(result.error?.message).toContain('503')
  })

  it('can reload/execute again', async () => {
    let callCount = 0
    server.use(
      http.get(`${baseUrl}/api/reload-test`, () => {
        callCount++
        return HttpResponse.json({ count: callCount })
      }),
    )

    const result = useFrappeFetch({ url: '/api/reload-test', baseUrl })

    await waitFor(() => !result.loading)

    expect(result.json).toStrictEqual({ count: 1 })

    // Reload
    result.execute()

    await waitFor(() => result.loading === true)
    await waitFor(() => result.loading === false)

    expect(result.json).toStrictEqual({ count: 2 })
  })

  it('works with relative URL when baseUrl is provided', async () => {
    server.use(
      http.get(`${baseUrl}/api/relative`, () => {
        return HttpResponse.json({ message: 'with base url' })
      }),
    )

    const result = useFrappeFetch({ url: '/api/relative', baseUrl })

    await waitFor(() => !result.loading)

    expect(result.json).toStrictEqual({ message: 'with base url' })
  })

  it('handles empty response body', async () => {
    server.use(
      http.get(`${baseUrl}/api/empty`, () => {
        return new HttpResponse('', { status: 200 })
      }),
    )

    const result = useFrappeFetch({ url: '/api/empty', baseUrl })

    await waitFor(() => !result.loading)

    expect(result.json).toStrictEqual({})
  })

  it('clears error on successful retry', async () => {
    let shouldFail = true
    server.use(
      http.get(`${baseUrl}/api/retry-test`, () => {
        if (shouldFail) {
          return HttpResponse.json(
            {
              errors: [
                {
                  title: 'Error',
                  message: 'Failed',
                  type: 'Error',
                  indicator: 'red',
                },
              ],
            },
            { status: 500 },
          )
        }
        return HttpResponse.json({ success: true })
      }),
    )

    const result = useFrappeFetch({ url: '/api/retry-test', baseUrl })

    await waitFor(() => !result.loading)

    expect(result.error).toBeTruthy()
    expect(result.json).toBe(null)

    // Retry with success
    shouldFail = false
    result.execute()

    await waitFor(() => result.loading === true)
    await waitFor(() => result.loading === false)

    expect(result.error).toBe(null)
    expect(result.json).toStrictEqual({ success: true })
  })

  it('supports POST requests with body', async () => {
    let receivedBody: any = null

    server.use(
      http.post(`${baseUrl}/api/create`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ id: 123, ...receivedBody })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/create',
      baseUrl,
      method: 'POST',
      params: { name: 'New Item', value: 42 },
    })

    await waitFor(() => !result.loading)

    expect(result.error).toBe(null)
    expect(receivedBody).toStrictEqual({ name: 'New Item', value: 42 })
    expect(result.json).toStrictEqual({ id: 123, name: 'New Item', value: 42 })
  })

  it('supports custom headers', async () => {
    let receivedHeaders: Record<string, string> = {}

    server.use(
      http.get(`${baseUrl}/api/with-headers`, ({ request }) => {
        receivedHeaders = {
          'X-Custom-Header': request.headers.get('X-Custom-Header') || '',
          Authorization: request.headers.get('Authorization') || '',
        }
        return HttpResponse.json({ success: true })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/with-headers',
      baseUrl,
      headers: {
        'X-Custom-Header': 'custom-value',
        Authorization: 'Bearer token123',
      },
    })

    await waitFor(() => !result.loading)

    expect(result.error).toBe(null)
    expect(receivedHeaders['X-Custom-Header']).toBe('custom-value')
    expect(receivedHeaders['Authorization']).toBe('Bearer token123')
  })

  it('supports PUT requests', async () => {
    server.use(
      http.put(`${baseUrl}/api/update/123`, async ({ request }) => {
        const body = (await request.json()) as Record<string, any>
        return HttpResponse.json({ id: 123, updated: true, ...body })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/update/123',
      baseUrl,
      method: 'PUT',
      params: { status: 'completed' },
    })

    await waitFor(() => !result.loading)

    expect(result.error).toBe(null)
    expect(result.json).toStrictEqual({
      id: 123,
      updated: true,
      status: 'completed',
    })
  })

  it('supports DELETE requests', async () => {
    server.use(
      http.delete(`${baseUrl}/api/delete/123`, () => {
        return HttpResponse.json({ deleted: true, id: 123 })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/delete/123',
      baseUrl,
      method: 'DELETE',
    })

    await waitFor(() => !result.loading)

    expect(result.error).toBe(null)
    expect(result.json).toStrictEqual({ deleted: true, id: 123 })
  })

  it('does not auto-execute when immediate is false', async () => {
    server.use(
      http.get(`${baseUrl}/api/manual`, () => {
        return HttpResponse.json({ manual: true })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/manual',
      baseUrl,
      immediate: false,
    })

    // Should not be loading since immediate is false
    expect(result.loading).toBe(false)
    expect(result.json).toBe(null)

    // Now manually execute
    result.execute()

    await waitFor(() => !result.loading)

    expect(result.json).toStrictEqual({ manual: true })
  })

  it('appends params to URL for GET requests', async () => {
    server.use(
      http.get(`${baseUrl}/api/search`, ({ request }) => {
        const url = new URL(request.url)
        return HttpResponse.json({
          query: url.searchParams.get('q'),
          page: url.searchParams.get('page'),
        })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/search',
      baseUrl,
      method: 'GET',
      params: { q: 'test', page: 2 },
    })

    await waitFor(() => !result.loading)

    expect(result.json).toStrictEqual({ query: 'test', page: '2' })
  })

  it('sends params as JSON body for POST requests', async () => {
    let receivedBody: any = null

    server.use(
      http.post(`${baseUrl}/api/submit`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ success: true, received: receivedBody })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/submit',
      baseUrl,
      method: 'POST',
      params: { name: 'John', age: 30 },
    })

    await waitFor(() => !result.loading)

    expect(receivedBody).toStrictEqual({ name: 'John', age: 30 })
    expect(result.json).toStrictEqual({
      success: true,
      received: { name: 'John', age: 30 },
    })
  })

  it('can manually abort requests', async () => {
    let requestCompleted = false

    server.use(
      http.get(`${baseUrl}/api/slow`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        requestCompleted = true
        return HttpResponse.json({ done: true })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/slow',
      baseUrl,
    })

    // Wait a bit for request to start
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(result.loading).toBe(true)

    result.abort()

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(result.loading).toBe(false)
    expect(result.json).toBe(null)
    expect(requestCompleted).toBe(false)
  })

  it('calls onSuccess callback when request succeeds', async () => {
    const onSuccessMock = vi.fn()

    server.use(
      http.get(`${baseUrl}/api/callback-test`, () => {
        return HttpResponse.json({ data: { result: 'success' } })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/callback-test',
      baseUrl,
      onSuccess: onSuccessMock,
    })

    await waitFor(() => !result.loading)

    expect(onSuccessMock).toHaveBeenCalledOnce()
    expect(onSuccessMock).toHaveBeenCalledWith({ data: { result: 'success' } })
  })

  it('calls onError callback when request fails', async () => {
    const onErrorMock = vi.fn()

    server.use(
      http.get(`${baseUrl}/api/error-test`, () => {
        return HttpResponse.json(
          {
            errors: [
              {
                title: 'Error',
                message: 'Something went wrong',
                type: 'ServerError',
                indicator: 'red',
              },
            ],
          },
          { status: 500 },
        )
      }),
    )

    const result = useFrappeFetch({
      url: '/api/error-test',
      baseUrl,
      onError: onErrorMock,
    })

    await waitFor(() => !result.loading)

    expect(onErrorMock).toHaveBeenCalledOnce()
    expect(onErrorMock).toHaveBeenCalledWith(expect.any(FrappeResponseError))
    expect(result.error).toBeInstanceOf(FrappeResponseError)
  })

  it('does not call onError on abort', async () => {
    const onErrorMock = vi.fn()

    server.use(
      http.get(`${baseUrl}/api/abort-test`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return HttpResponse.json({ done: true })
      }),
    )

    const result = useFrappeFetch({
      url: '/api/abort-test',
      baseUrl,
      onError: onErrorMock,
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    result.abort()

    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(onErrorMock).not.toHaveBeenCalled()
  })
})

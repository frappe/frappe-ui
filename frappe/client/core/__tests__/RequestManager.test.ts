/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import './setup'
import { createRequestManager } from '../RequestManager'
import { FrappeResponseError } from '../FrappeResponseError'
import { BASE_URL, server } from './mocks'

describe('RequestManager', () => {
  describe('basic requests', () => {
    it('performs a GET request and returns parsed JSON', async () => {
      server.use(
        http.get(`${BASE_URL}/api/test`, () =>
          HttpResponse.json({ result: 'ok' }),
        ),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      const json = await rm.fetch({ url: '/api/test', method: 'GET' })
      expect(json).toEqual({ result: 'ok' })
    })

    it('performs a POST request with body', async () => {
      server.use(
        http.post(`${BASE_URL}/api/test`, async ({ request }) => {
          const body = await request.json()
          return HttpResponse.json({ received: body })
        }),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      const json = await rm.fetch({
        url: '/api/test',
        method: 'POST',
        body: { foo: 'bar' },
      })
      expect(json).toEqual({ received: { foo: 'bar' } })
    })

    it('serializes GET body as query params', async () => {
      server.use(
        http.get(`${BASE_URL}/api/test`, ({ request }) => {
          const url = new URL(request.url)
          return HttpResponse.json({ status: url.searchParams.get('status') })
        }),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      const json = await rm.fetch({
        url: '/api/test',
        method: 'GET',
        body: { status: 'Open' },
      })
      expect(json).toEqual({ status: 'Open' })
    })
  })

  describe('error handling', () => {
    it('throws FrappeResponseError on 4xx with errors array', async () => {
      server.use(
        http.get(`${BASE_URL}/api/fail`, () =>
          HttpResponse.json(
            {
              errors: [
                {
                  title: 'Not Found',
                  message: 'Record not found',
                  type: 'NotFoundError',
                },
              ],
            },
            { status: 404 },
          ),
        ),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      await expect(
        rm.fetch({ url: '/api/fail', method: 'GET' }),
      ).rejects.toBeInstanceOf(FrappeResponseError)
    })

    it('FrappeResponseError has correct properties', async () => {
      server.use(
        http.get(`${BASE_URL}/api/fail`, () =>
          HttpResponse.json(
            {
              errors: [
                {
                  title: 'Not Found',
                  message: 'Record not found',
                  type: 'NotFoundError',
                  indicator: 'red',
                },
              ],
            },
            { status: 404 },
          ),
        ),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      const error = await rm
        .fetch({ url: '/api/fail', method: 'GET' })
        .catch((e) => e)

      expect(error).toBeInstanceOf(FrappeResponseError)
      expect(error.type).toBe('NotFoundError')
      expect(error.httpStatus).toBe(404)
      expect(error.isNotFound).toBe(true)
      expect(error.messages[0].message).toBe('Record not found')
    })

    it('calls onError hook on failure', async () => {
      server.use(
        http.get(`${BASE_URL}/api/fail`, () =>
          HttpResponse.json(
            { errors: [{ title: 'Error', type: 'Error', message: 'Oops' }] },
            { status: 500 },
          ),
        ),
      )
      const onError = vi.fn()
      const rm = createRequestManager({ baseUrl: BASE_URL, onError })
      vi.useFakeTimers()
      await rm.fetch({ url: '/api/fail', method: 'GET' }).catch(() => {})
      vi.runAllTimers()
      vi.useRealTimers()
      expect(onError).toHaveBeenCalledWith(expect.any(FrappeResponseError))
    })
  })

  describe('onRequest hook', () => {
    it('calls onRequest before every request', async () => {
      server.use(
        http.get(`${BASE_URL}/api/test`, () => HttpResponse.json({ ok: true })),
      )
      const onRequest = vi.fn()
      const rm = createRequestManager({ baseUrl: BASE_URL, onRequest })
      await rm.fetch({ url: '/api/test', method: 'GET' })
      expect(onRequest).toHaveBeenCalledTimes(1)
      expect(onRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/api/test', method: 'GET' }),
      )
    })
  })

  describe('onResponse hook', () => {
    it('calls onResponse on success', async () => {
      server.use(
        http.get(`${BASE_URL}/api/test`, () => HttpResponse.json({ ok: true })),
      )
      const onResponse = vi.fn()
      const rm = createRequestManager({ baseUrl: BASE_URL, onResponse })
      await rm.fetch({ url: '/api/test', method: 'GET' })
      expect(onResponse).toHaveBeenCalledWith({ ok: true })
    })
  })

  describe('deduplication', () => {
    it('deduplicates concurrent GET requests to the same URL', async () => {
      let callCount = 0
      server.use(
        http.get(`${BASE_URL}/api/dedup`, () => {
          callCount++
          return HttpResponse.json({ count: callCount })
        }),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      const [a, b] = await Promise.all([
        rm.fetch({ url: '/api/dedup', method: 'GET' }),
        rm.fetch({ url: '/api/dedup', method: 'GET' }),
      ])
      expect(callCount).toBe(1)
      expect(a).toEqual(b)
    })

    it('does NOT deduplicate POST requests', async () => {
      let callCount = 0
      server.use(
        http.post(`${BASE_URL}/api/no-dedup`, () => {
          callCount++
          return HttpResponse.json({ count: callCount })
        }),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      await Promise.all([
        rm.fetch({ url: '/api/no-dedup', method: 'POST' }),
        rm.fetch({ url: '/api/no-dedup', method: 'POST' }),
      ])
      expect(callCount).toBe(2)
    })

    it('second GET request after first completes is NOT deduplicated', async () => {
      let callCount = 0
      server.use(
        http.get(`${BASE_URL}/api/seq`, () => {
          callCount++
          return HttpResponse.json({ count: callCount })
        }),
      )
      const rm = createRequestManager({ baseUrl: BASE_URL })
      await rm.fetch({ url: '/api/seq', method: 'GET' })
      await rm.fetch({ url: '/api/seq', method: 'GET' })
      expect(callCount).toBe(2)
    })
  })
})

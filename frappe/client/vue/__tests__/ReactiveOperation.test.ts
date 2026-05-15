/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { ref } from 'vue'
import '../../core/__tests__/setup'
import { createDocStore } from '../../core/DocStore'
import { createRequestManager } from '../../core/RequestManager'
import { wrapOperation } from '../ReactiveOperation'
import { BASE_URL, server } from '../../core/__tests__/mocks'

describe('wrapOperation', () => {
  function makeOp(result: any, shouldFail = false) {
    return {
      call: vi.fn(async () => {
        if (shouldFail)
          throw Object.assign(new Error('Request failed'), { httpStatus: 422 })
        return result
      }),
      callOptimistic: vi.fn(async (_params: any, updater: any) => {
        updater({
          /* mock store */
        })
        if (shouldFail)
          throw Object.assign(new Error('Request failed'), { httpStatus: 422 })
        return result
      }),
    }
  }

  it('starts with loading=false, error=null, data=null', () => {
    const op = wrapOperation(makeOp('some-result'))
    expect(op.loading.value).toBe(false)
    expect(op.error.value).toBe(null)
    expect(op.data.value).toBe(null)
  })

  it('sets loading=true during call, false after', async () => {
    let resolveFetch!: (v: any) => void
    const core = {
      call: vi.fn(
        () =>
          new Promise((r) => {
            resolveFetch = r
          }),
      ),
      callOptimistic: vi.fn(),
    }
    const op = wrapOperation(core)

    const callPromise = op.call(undefined)
    expect(op.loading.value).toBe(true)

    resolveFetch('result')
    await callPromise
    expect(op.loading.value).toBe(false)
  })

  it('sets data on success', async () => {
    const op = wrapOperation(makeOp({ id: 1, label: 'hello' }))
    await op.call(undefined)
    expect(op.data.value).toEqual({ id: 1, label: 'hello' })
    expect(op.error.value).toBe(null)
  })

  it('sets error on failure and clears data', async () => {
    const op = wrapOperation(makeOp(null, true))
    await expect(op.call(undefined)).rejects.toThrow()
    expect(op.error.value).not.toBe(null)
    expect(op.loading.value).toBe(false)
  })

  it('clears error on next call', async () => {
    const core = {
      call: vi
        .fn()
        .mockRejectedValueOnce(new Error('first error'))
        .mockResolvedValueOnce('ok'),
      callOptimistic: vi.fn(),
    }
    const op = wrapOperation(core)
    await expect(op.call(undefined)).rejects.toThrow()
    expect(op.error.value).not.toBe(null)

    await op.call(undefined)
    expect(op.error.value).toBe(null)
    expect(op.data.value).toBe('ok')
  })

  it('forwards callOptimistic', async () => {
    const op = wrapOperation(makeOp('optimistic-result'))
    const updater = vi.fn()
    const result = await op.callOptimistic(undefined, updater)
    expect(result).toBe('optimistic-result')
    expect(updater).toHaveBeenCalled()
  })
})

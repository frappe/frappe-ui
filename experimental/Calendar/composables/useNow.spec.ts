// @vitest-environment jsdom
/**
 * Unit tests for src/components/Calendar/composables/useNow.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useNow } from './useNow'

beforeEach(() => vi.useFakeTimers())

afterEach(() => {
  // The interval and the subscriber count live at module scope, so a test that
  // forgets to stop its scopes would leave the timer running and break whichever
  // test happens to run next. Fail here instead, where the blame belongs.
  expect(vi.getTimerCount()).toBe(0)
  vi.useRealTimers()
})

/** Runs `fn` in a scope and hands back a stop() so the subscription is released. */
function inScope<T>(fn: () => T) {
  const scope = effectScope()
  const value = scope.run(fn) as T
  return { value, stop: () => scope.stop() }
}

describe('useNow', () => {
  it('advances with the wall clock', () => {
    vi.setSystemTime(new Date('2026-08-06T10:00:00'))
    const { value: now, stop } = inScope(useNow)
    expect(now.value.getMinutes()).toBe(0)

    vi.setSystemTime(new Date('2026-08-06T10:05:00'))
    vi.advanceTimersByTime(30_000)

    expect(now.value.getMinutes()).toBe(5)
    stop()
  })

  it('crosses midnight without a refresh', () => {
    vi.setSystemTime(new Date('2026-08-06T23:59:40'))
    const { value: now, stop } = inScope(useNow)
    expect(now.value.toDateString()).toBe(new Date('2026-08-06T12:00').toDateString())

    vi.setSystemTime(new Date('2026-08-07T00:00:10'))
    vi.advanceTimersByTime(30_000)

    expect(now.value.toDateString()).toBe(new Date('2026-08-07T12:00').toDateString())
    stop()
  })

  it('shares one timer across every day column', () => {
    const scopes = Array.from({ length: 7 }, () => inScope(useNow))
    expect(vi.getTimerCount()).toBe(1)
    scopes.forEach((s) => s.stop())
    expect(vi.getTimerCount()).toBe(0)
  })

  it('stops ticking once the last consumer goes away', () => {
    const a = inScope(useNow)
    const b = inScope(useNow)
    a.stop()
    expect(vi.getTimerCount()).toBe(1) // b is still listening
    b.stop()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('serves a current date with no document, and starts no timer', () => {
    vi.setSystemTime(new Date('2026-08-09T17:30:00'))
    const doc = globalThis.document
    // @ts-expect-error - standing in for a server renderer
    delete globalThis.document
    try {
      const { value: now, stop } = inScope(useNow)
      expect(now.value.toDateString()).toBe(new Date().toDateString())
      expect(vi.getTimerCount()).toBe(0)
      stop()
    } finally {
      globalThis.document = doc
    }
  })
})

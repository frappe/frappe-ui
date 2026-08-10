import { describe, it, expect, afterEach } from 'vitest'
import { moduleSingleton } from './moduleSingleton'

const KEYS = ['test-store', 'test-falsy', 'test-count']

afterEach(() => {
  for (const key of KEYS) {
    delete (globalThis as Record<symbol, unknown>)[Symbol.for(`frappe-ui.${key}`)]
  }
})

describe('moduleSingleton', () => {
  // The bug this exists to prevent: Vite's dep pre-bundler cannot parse .vue,
  // so it inlines frappe-ui's .ts modules and leaves the SFCs as raw source.
  // A .ts module read from both sides is instantiated twice. Calling the
  // factory twice with the same key is that second instantiation.
  it('hands a second module instance the same object', () => {
    const first = moduleSingleton('test-store', () => ({ items: [1] }))
    const second = moduleSingleton('test-store', () => ({ items: [] }))

    expect(second).toBe(first)

    first.items.push(2)
    expect(second.items).toEqual([1, 2])
  })

  it('runs the factory exactly once, even for a falsy value', () => {
    let calls = 0
    const create = () => {
      calls++
      return 0
    }

    expect(moduleSingleton('test-falsy', create)).toBe(0)
    expect(moduleSingleton('test-falsy', create)).toBe(0)
    expect(calls).toBe(1)
  })

  it('keeps separate keys separate', () => {
    const store = moduleSingleton('test-store', () => ({ items: [] }))
    const count = moduleSingleton('test-count', () => ({ n: 0 }))

    expect(store).not.toBe(count)
  })
})

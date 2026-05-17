/**
 * @vitest-environment node
 *
 * Unit tests for the v1 toast public API.
 * FrappeUIProvider mount + CSS-variable integration is covered in Toast.cy.ts.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Stub vue-sonner before importing the wrapper so calls land on spies
// instead of the real Observer (which expects a mounted <Toaster>).
const sonnerSpy = Object.assign(vi.fn(), {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  loading: vi.fn(),
  message: vi.fn(),
  promise: vi.fn(),
  custom: vi.fn(),
  dismiss: vi.fn(),
})

vi.mock('vue-sonner', () => ({ toast: sonnerSpy }))

const { toast } = await import('./toast')

beforeEach(() => {
  sonnerSpy.mockClear()
  Object.values(sonnerSpy).forEach((fn) => {
    if (typeof (fn as any).mockClear === 'function') (fn as any).mockClear()
  })
})

describe('Toast v1 — vue-sonner API surface', () => {
  it('toast exposes the expected v1 API', () => {
    expect(typeof toast.success).toBe('function')
    expect(typeof toast.error).toBe('function')
    expect(typeof toast.warning).toBe('function')
    expect(typeof toast.info).toBe('function')
    expect(typeof toast.loading).toBe('function')
    expect(typeof toast.message).toBe('function')
    expect(typeof toast.promise).toBe('function')
    expect(typeof toast.custom).toBe('function')
    expect(typeof toast.dismiss).toBe('function')
  })
})

describe('Toast v1 — backwards-compat shim', () => {
  it('toast.create is kept as a deprecated shim', () => {
    expect(typeof (toast as any).create).toBe('function')
  })

  it('toast.remove is kept as a deprecated shim for toast.dismiss(id)', () => {
    expect(typeof (toast as any).remove).toBe('function')
  })

  it('toast.removeAll is kept as a deprecated shim for toast.dismiss()', () => {
    expect(typeof (toast as any).removeAll).toBe('function')
  })

  it('toast.create({ closable: false }) makes the toast persistent', () => {
    // Old reka-ui contract: closable=false drove duration=0 which reka
    // treated as persistent. Sonner would auto-dismiss after 5s without
    // this remap — breaking the helpdesk loading-indicator pattern.
    ;(toast as any).create({ message: 'Loading…', closable: false })
    const [, data] = sonnerSpy.mock.calls[0]!
    expect(data.duration).toBe(Infinity)
    expect(data.closeButton).toBe(false)
  })

  it('toast.create({ duration: 0 }) is persistent, not instant-dismiss', () => {
    // Sonner treats 0 as "close immediately"; the legacy idiom meant
    // "no timeout". Map 0 → Infinity to preserve old semantics.
    ;(toast as any).create({ message: 'Pinned', duration: 0 })
    const [, data] = sonnerSpy.mock.calls[0]!
    expect(data.duration).toBe(Infinity)
  })

  it('toast.create maps seconds → ms for non-zero durations', () => {
    ;(toast as any).create({ message: 'Brief', duration: 3 })
    const [, data] = sonnerSpy.mock.calls[0]!
    expect(data.duration).toBe(3000)
  })

  it('toast({ title, text, timeout: 0 }) is persistent', () => {
    ;(toast as any)({ title: 'Stuck', text: 'No timeout', timeout: 0 })
    const [, data] = sonnerSpy.mock.calls[0]!
    expect(data.duration).toBe(Infinity)
    expect(data.description).toBe('No timeout')
  })
})

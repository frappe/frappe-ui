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

// Every toast path runs through renderSafeHTML → DOMPurify.sanitize, which
// needs a DOM. Stub it with a passthrough so this node-environment file doesn't
// crash; the real sanitization is verified in Toast.sanitize.test.ts (jsdom).
vi.mock('dompurify', () => ({ default: { sanitize: (html: string) => html } }))

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

describe('Toast v1 — the removed shims', () => {
  it('no longer exposes create, remove or removeAll', () => {
    expect((toast as any).create).toBeUndefined()
    expect((toast as any).remove).toBeUndefined()
    expect((toast as any).removeAll).toBeUndefined()
  })

  it('hands a legacy object straight to sonner as the message', () => {
    // The legacy object form is gone, and its removal is silent: nothing
    // throws, sonner just receives an object where it expects a string. This
    // pins that the wrapper no longer interprets the shape.
    const legacy = { title: 'Old', text: 'shape' }
    ;(toast as any)(legacy)
    const [message, data] = sonnerSpy.mock.calls[0]!
    expect(message).toBe(legacy)
    expect(data?.description).toBeUndefined()
  })
})

describe('Toast v1 — description sanitization', () => {
  it('wraps a string description in a render function, like the message', () => {
    toast('Saved', { description: 'Set <b>variant</b>' })
    const [, data] = sonnerSpy.mock.calls[0]!
    expect(typeof data.description).toBe('function')
  })

  it('sanitizes the description on the semantic creators too', () => {
    toast.success('Saved', { description: '<em>done</em>' })
    const [, data] = sonnerSpy.success.mock.calls[0]!
    expect(typeof data.description).toBe('function')
  })

  it('leaves a non-string description untouched', () => {
    const vnode = () => 'already a render fn'
    toast('Saved', { description: vnode })
    const [, data] = sonnerSpy.mock.calls[0]!
    expect(data.description).toBe(vnode)
  })

  it('leaves options without a description alone', () => {
    toast('Saved', { duration: 1000 })
    const [, data] = sonnerSpy.mock.calls[0]!
    expect(data.description).toBeUndefined()
    expect(data.duration).toBe(1000)
  })
})

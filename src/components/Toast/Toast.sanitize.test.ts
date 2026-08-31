/**
 * @vitest-environment jsdom
 *
 * Sanitization is verified against the REAL DOMPurify (needs a DOM, hence the
 * jsdom environment) — the allow-list wiring is covered separately in
 * Toast.test.ts with a stubbed DOMPurify.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VNode } from 'vue'

const sonnerSpy = Object.assign(vi.fn(), {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  message: vi.fn(),
  loading: vi.fn(),
  promise: vi.fn(),
  custom: vi.fn(),
  dismiss: vi.fn(),
})

vi.mock('vue-sonner', () => ({ toast: sonnerSpy }))

const { toast } = await import('./toast')

// renderSafeHTML returns `() => h('span', { innerHTML })`. Pull that render
// function off the sonner spy, invoke it, and read the sanitized markup back.
function sanitizedHTML(): string {
  const [message] = sonnerSpy.success.mock.calls[0]!
  const vnode = (message as () => VNode)()
  return (vnode.props as { innerHTML: string }).innerHTML
}

// Same trick for the description, which arrives in the options object.
function sanitizedDescription(spy: { mock: { calls: unknown[][] } }): string {
  const [, data] = spy.mock.calls[0]! as [unknown, { description: () => VNode }]
  return (data.description().props as { innerHTML: string }).innerHTML
}

beforeEach(() => {
  Object.values(sonnerSpy).forEach((fn) => {
    if (typeof (fn as { mockClear?: () => void }).mockClear === 'function') {
      ;(fn as { mockClear: () => void }).mockClear()
    }
  })
})

describe('Toast v1 — DOMPurify stripping', () => {
  it('strips tags outside the allow-list while keeping their text content', () => {
    toast.success('<strong>safe</strong><div>nested</div>')
    const html = sanitizedHTML()
    expect(html).toContain('<strong>safe</strong>')
    expect(html).not.toContain('<div>')
    expect(html).toContain('nested')
  })

  it('removes script and event-handler payloads to prevent XSS', () => {
    toast.success('<b>ok</b><img src=x onerror=alert(1)><script>alert(2)<\/script>')
    const html = sanitizedHTML()
    expect(html).toContain('<b>ok</b>')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('<script')
  })
})

describe('Toast v1 — description is stripped the same way', () => {
  it('strips a tag outside the allow-list from the description', () => {
    // The headline claim in the changelog: `Set <Button> variant` loses the
    // tag and reads `Set  variant`. Pin the real DOMPurify behavior, not just
    // that the value got wrapped in a render function.
    toast.success('Heads up', { description: 'Set <Button> variant' })
    const html = sanitizedDescription(sonnerSpy.success)
    expect(html).not.toContain('<Button>')
    expect(html).not.toContain('Button')
    expect(html).toContain('Set')
    expect(html).toContain('variant')
  })

  it('keeps allow-listed inline tags in the description', () => {
    toast.success('Saved', { description: 'See <a href="/docs">the docs</a>' })
    const html = sanitizedDescription(sonnerSpy.success)
    expect(html).toContain('<a')
    expect(html).toContain('the docs')
  })

  it('covers the creators that come off the sonner namespace', () => {
    // `message` and `loading` are inherited through Object.assign, so they
    // are the ones that silently opted out of the contract before.
    toast.message('Heads up', { description: '<div>plain</div>' })
    expect(sanitizedDescription(sonnerSpy.message)).not.toContain('<div>')

    toast.loading('Working', { description: '<div>plain</div>' })
    expect(sanitizedDescription(sonnerSpy.loading)).not.toContain('<div>')
  })

  it('sanitizes the message that `message` renders, like `toast.create` did', () => {
    // migration.md sends every toast.create caller here, and toast.create
    // rendered its message as HTML through dispatch.
    toast.message('<b>Loading</b>')
    const [message] = sonnerSpy.message.mock.calls[0]! as [() => VNode]
    expect((message().props as { innerHTML: string }).innerHTML).toContain(
      '<b>Loading</b>',
    )
  })
})

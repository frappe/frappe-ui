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

beforeEach(() => sonnerSpy.success.mockClear())

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

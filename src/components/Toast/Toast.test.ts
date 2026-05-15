/**
 * @vitest-environment node
 *
 * Unit tests for the v1 toast public API.
 * FrappeUIProvider mount + CSS-variable integration is covered in Toast.cy.ts.
 */

import { describe, it, expect } from 'vitest'
import { toast } from 'vue-sonner'

describe('Toast v1 — removed APIs (no longer on toast object)', () => {
  it('toast.create does not exist (removed in v1)', () => {
    expect((toast as any).create).toBeUndefined()
  })

  it('toast.remove does not exist (removed in v1)', () => {
    expect((toast as any).remove).toBeUndefined()
  })

  it('toast.removeAll does not exist (removed in v1)', () => {
    expect((toast as any).removeAll).toBeUndefined()
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

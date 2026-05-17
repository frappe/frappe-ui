/**
 * @vitest-environment node
 *
 * Unit tests for the v1 toast public API.
 * FrappeUIProvider mount + CSS-variable integration is covered in Toast.cy.ts.
 */

import { describe, it, expect } from 'vitest'
import { toast } from './toast'

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
})

import { describe, it, expect } from 'vitest'
import { safeGetPos, mapStoredRange } from './node-view'
import type { EditorState } from '@tiptap/pm/state'

describe('safeGetPos', () => {
  it('returns the position for a valid number (including 0)', () => {
    expect(safeGetPos(() => 0)).toBe(0)
    expect(safeGetPos(() => 7)).toBe(7)
  })

  it('returns null for undefined', () => {
    expect(safeGetPos(() => undefined)).toBeNull()
  })

  it('returns null for NaN', () => {
    expect(safeGetPos(() => Number.NaN)).toBeNull()
  })
})

describe('mapStoredRange', () => {
  const state = { doc: { content: { size: 10 } } } as unknown as EditorState

  it('clamps a range into the current document bounds', () => {
    expect(mapStoredRange(state, { from: -5, to: 100 })).toEqual({
      from: 0,
      to: 10,
    })
  })

  it('keeps to >= from', () => {
    expect(mapStoredRange(state, { from: 6, to: 2 })).toEqual({
      from: 6,
      to: 6,
    })
  })

  it('passes through an in-bounds range', () => {
    expect(mapStoredRange(state, { from: 2, to: 5 })).toEqual({
      from: 2,
      to: 5,
    })
  })
})

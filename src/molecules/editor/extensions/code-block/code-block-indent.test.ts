import { describe, it, expect } from 'vitest'
import { INDENT, lineStartsBetween } from './code-block-indent'

describe('INDENT', () => {
  it('is four spaces', () => {
    expect(INDENT).toBe('    ')
    expect(INDENT.length).toBe(4)
  })
})

describe('lineStartsBetween', () => {
  it('returns a single start for a single-line selection', () => {
    // "abc" with selection 1..2 — one line, starts at offset 0.
    expect(lineStartsBetween('abc', 1, 2)).toEqual([0])
  })

  it('returns the start of every line a multi-line selection touches', () => {
    // "aaa\nbbb\nccc" — selecting from within line 1 to within line 3.
    const text = 'aaa\nbbb\nccc'
    expect(lineStartsBetween(text, 1, 9)).toEqual([0, 4, 8])
  })

  it('does not include a trailing line when the selection ends on the newline boundary', () => {
    // "aaa\nbbb" — selection ends exactly at the newline of line 1.
    expect(lineStartsBetween('aaa\nbbb', 0, 4)).toEqual([0])
  })

  it('handles a caret (zero-width selection) on a later line', () => {
    const text = 'aaa\nbbb\nccc'
    expect(lineStartsBetween(text, 5, 5)).toEqual([4])
  })
})

describe('text.slice indentation detection (Shift-Tab)', () => {
  it('detects a 4-space indent via slice', () => {
    const line = '    code'
    expect(line.slice(0, 4)).toBe(INDENT)
  })

  it('does not falsely match a shorter run of spaces', () => {
    const line = '  code'
    expect(line.slice(0, 4)).not.toBe(INDENT)
  })
})

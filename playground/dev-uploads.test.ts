// The uploads route answers byte ranges, so a video served from it can be
// scrubbed: a browser seeks by asking for the bytes it does not have yet.
import { describe, it, expect } from 'vitest'
import { byteRange } from './dev-uploads'

describe('byteRange', () => {
  it('reads a closed, an open and a suffix range', () => {
    expect(byteRange('bytes=10-19', 100)).toEqual([10, 19])
    expect(byteRange('bytes=90-', 100)).toEqual([90, 99])
    expect(byteRange('bytes=-10', 100)).toEqual([90, 99])
  })
  it('clips an end past the file', () => {
    expect(byteRange('bytes=10-500', 100)).toEqual([10, 99])
    expect(byteRange('bytes=-500', 100)).toEqual([0, 99])
  })
  it('wants the whole file with no usable header', () => {
    expect(byteRange(undefined, 100)).toBeNull()
    expect(byteRange('bytes=-', 100)).toBeNull()
    expect(byteRange('items=1-2', 100)).toBeNull()
  })
  it('refuses a range past the file', () => {
    expect(byteRange('bytes=100-', 100)).toBe('invalid')
    expect(byteRange('bytes=20-10', 100)).toBe('invalid')
    expect(byteRange('bytes=0-', 0)).toBe('invalid')
  })
})

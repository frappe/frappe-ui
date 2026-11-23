/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { documentDir, physicalSide } from './document'

afterEach(() => {
  document.documentElement.dir = ''
})

describe('documentDir', () => {
  it('reads the direction the page declares', () => {
    document.documentElement.dir = 'rtl'
    expect(documentDir()).toBe('rtl')
  })

  it('falls back to ltr', () => {
    expect(documentDir()).toBe('ltr')
  })
})

describe('physicalSide', () => {
  it('puts inline-start on the left and inline-end on the right in LTR', () => {
    expect(physicalSide('inline-start')).toBe('left')
    expect(physicalSide('inline-end')).toBe('right')
  })

  it('mirrors inline-start and inline-end on an RTL page', () => {
    document.documentElement.dir = 'rtl'
    expect(physicalSide('inline-start')).toBe('right')
    expect(physicalSide('inline-end')).toBe('left')
  })

  it('leaves physical sides alone', () => {
    document.documentElement.dir = 'rtl'
    expect(physicalSide('left')).toBe('left')
    expect(physicalSide('bottom')).toBe('bottom')
  })
})

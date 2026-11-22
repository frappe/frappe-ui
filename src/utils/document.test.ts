/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { documentDir } from './document'

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

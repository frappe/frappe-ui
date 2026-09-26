/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { documentDir, documentLocale } from './utils'
import { formatValue } from './format'

afterEach(() => {
  document.documentElement.dir = ''
  document.documentElement.lang = ''
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

describe('documentLocale', () => {
  it('reads the language the page declares', () => {
    document.documentElement.lang = 'de-DE'
    expect(documentLocale()).toBe('de-DE')
  })

  // Not the runtime's own locale: a page that declares no language should keep
  // printing what it printed before this was read at all.
  it('falls back to en-US', () => {
    expect(documentLocale()).toBe('en-US')
  })

  it('groups a number by the declared language', () => {
    document.documentElement.lang = 'de-DE'
    expect(formatValue(1234.5, 1)).toBe('1.234,5')
  })

  // `Intl` throws a RangeError on a malformed tag rather than falling back, and
  // charts format numbers during render.
  it('falls back rather than throwing on a malformed lang', () => {
    for (const lang of ['en_US', 'en--US', '!!']) {
      document.documentElement.lang = lang
      expect(documentLocale()).toBe('en-US')
      expect(formatValue(1234.5, 1)).toBe('1,234.5')
    }
  })
})

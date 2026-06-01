import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import {
  EXCLUDE_FROM_PASTE,
  PALETTE_COLORS,
  PALETTE_NAMES,
  highlightColorHexMap,
  textColorHexMap,
} from './color-palette'
import {
  extractHighlightColorFromStyle,
  extractTextColorFromStyle,
  highlightColorStyle,
  textColorStyle,
} from './color-style'
import { parseHexToRgb, parseRgbToRgb } from './color-parse'

const here = dirname(fileURLToPath(import.meta.url))
const colorCss = readFileSync(
  resolve(here, '../color/color-styles.css'),
  'utf8',
)
const highlightCss = readFileSync(
  resolve(here, '../highlight/highlight-styles.css'),
  'utf8',
)

// Colors that must always be offered by the picker / extensions.
const DEFAULT_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'purple',
  'pink',
  'gray',
]

describe('color palette', () => {
  it('palette names cover the default colors', () => {
    for (const color of DEFAULT_COLORS) {
      expect(PALETTE_NAMES).toContain(color)
    }
  })

  it('hex maps cover every palette name', () => {
    for (const { name } of PALETTE_COLORS) {
      expect(textColorHexMap[name], `text hex for ${name}`).toBeTruthy()
      expect(
        highlightColorHexMap[name],
        `highlight hex for ${name}`,
      ).toBeTruthy()
    }
  })

  it('does NOT include black (defaults to ink)', () => {
    expect(PALETTE_NAMES).not.toContain('black')
    expect(textColorHexMap.black).toBeUndefined()
  })

  it('declares a --prose-color-* var for every palette name', () => {
    for (const { name } of PALETTE_COLORS) {
      expect(colorCss, `--prose-color-${name}`).toContain(
        `--prose-color-${name}:`,
      )
    }
  })

  it('declares a --prose-highlight-* var for every palette name', () => {
    for (const { name } of PALETTE_COLORS) {
      expect(highlightCss, `--prose-highlight-${name}`).toContain(
        `--prose-highlight-${name}:`,
      )
    }
  })

  it('includes indigo', () => {
    expect(PALETTE_NAMES).toContain('indigo')
    expect(colorCss).toContain('--prose-color-indigo:')
    expect(highlightCss).toContain('--prose-highlight-indigo:')
  })
})

describe('color parse', () => {
  it('parseHexToRgb returns null for 3-digit hex', () => {
    expect(parseHexToRgb('#abc')).toBeNull()
  })

  it('parseHexToRgb parses 6-digit hex', () => {
    expect(parseHexToRgb('#dc2626')).toEqual({ r: 220, g: 38, b: 38 })
  })

  it('parseRgbToRgb parses comma and space syntaxes and percentages', () => {
    expect(parseRgbToRgb('rgb(220, 38, 38)')).toEqual({ r: 220, g: 38, b: 38 })
    expect(parseRgbToRgb('rgb(220 38 38)')).toEqual({ r: 220, g: 38, b: 38 })
    expect(parseRgbToRgb('rgba(220, 38, 38, 0.5)')).toEqual({
      r: 220,
      g: 38,
      b: 38,
    })
    expect(parseRgbToRgb('rgb(100% 0% 0%)')).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('color style', () => {
  it('builders emit canonical CSS vars', () => {
    expect(textColorStyle('blue')).toBe('color: var(--prose-color-blue)')
    expect(highlightColorStyle('yellow')).toBe(
      'background-color: var(--prose-highlight-yellow)',
    )
  })

  it('extracts CSS-var colors round-trip', () => {
    expect(extractTextColorFromStyle(textColorStyle('blue'))).toBe('blue')
    expect(
      extractHighlightColorFromStyle(highlightColorStyle('yellow')),
    ).toBe('yellow')
  })

  it('drops excluded colors (gray) on paste', () => {
    expect(EXCLUDE_FROM_PASTE).toContain('gray')
    // gray text hex should normalize to null, not "gray"
    expect(extractTextColorFromStyle('color: #6b7280')).toBeNull()
  })

  it('matches a near hex to the closest palette name', () => {
    // a red-ish hex close to #dc2626
    expect(extractTextColorFromStyle('color: #dd2525')).toBe('red')
  })
})

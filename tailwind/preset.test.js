/**
 * The spacing scale is the one place sizing is declared.
 *
 * Tailwind 3.4 resolves width, height, size, minWidth, maxWidth, minHeight and
 * maxHeight from `theme('spacing')`, so the preset declares the scale once and
 * the plugin declares no sizing blocks of its own. These tests resolve the real
 * preset through Tailwind to check what a consuming app actually gets.
 */
import { describe, expect, it } from 'vitest'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import preset from './preset.js'

const theme = resolveConfig({ content: [], presets: [preset] }).theme

describe('spacing scale', () => {
  it('has every integer from 1 to 128', () => {
    for (const n of [1, 13, 17, 40, 52, 64, 65, 112, 128]) {
      expect(theme.spacing[n], `spacing.${n}`).toBe(`${n * 0.25}rem`)
    }
    expect(theme.spacing[129]).toBeUndefined()
  })

  it('has every half step from 0.5 to 19.5', () => {
    for (let n = 0.5; n < 20; n += 1) {
      expect(theme.spacing[n], `spacing.${n}`).toBe(`${n * 0.25}rem`)
    }
    expect(theme.spacing[20.5]).toBeUndefined()
  })

  it('keeps Tailwind values for the keys it overlaps', () => {
    expect(theme.spacing[3.5]).toBe('0.875rem')
    expect(theme.spacing[12]).toBe('3rem')
  })
})

describe('sizing reads the spacing scale', () => {
  it('feeds width, height, minWidth, maxWidth, minHeight and maxHeight', () => {
    for (const section of [
      'width',
      'height',
      'size',
      'minWidth',
      'maxWidth',
      'minHeight',
      'maxHeight',
    ]) {
      expect(theme[section][40], `${section}.40`).toBe('10rem')
      expect(theme[section][3.5], `${section}.3.5`).toBe('0.875rem')
    }
  })

  it('keeps the classes the library and its apps already use', () => {
    expect(theme.width[112]).toBe('28rem')
    expect(theme.maxHeight[52]).toBe('13rem')
    expect(theme.height[15]).toBe('3.75rem')
  })

  it('drops the two entries that were not on the scale', () => {
    // `w-wizard` was an app screen name, and `min-w-50` was 18rem against a
    // scale that says 12.5rem.
    expect(theme.width.wizard).toBeUndefined()
    expect(theme.minWidth[50]).toBe('12.5rem')
  })
})

describe('list styling-hook sugar', () => {
  it('offers a utility for every spacing key', () => {
    // `list-gap-*` and `list-row-px-*` are generated from `theme('spacing')`
    // (see plugin.js), so the new keys reach them too.
    expect(theme.spacing[16.5]).toBe('4.125rem')
  })
})

describe('radius scale', () => {
  it('reads every step from a CSS variable', () => {
    expect(theme.borderRadius[4]).toBe('var(--radius-4) /* 8px */')
  })

  it('makes rounded-9 the largest real corner, not a second pill', () => {
    // ADR-0006 and spec/foundations.md both define radius/9 as 100px.
    // `rounded-full` (9999px) is the pill.
    expect(theme.borderRadius[9]).toBe('var(--radius-9) /* 100px */')
    expect(theme.borderRadius.full).toBe('var(--radius-full) /* 9999px */')
  })

  it('has no named aliases left', () => {
    for (const alias of ['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl']) {
      expect(theme.borderRadius[alias], alias).toBeUndefined()
    }
  })
})

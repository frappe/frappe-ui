/**
 * The Tailwind-only shaping layer. `tokens.test.js` covers the values; this
 * covers the two transforms that exist purely so Tailwind's `/<opacity>`
 * modifier works.
 */
import { describe, expect, it } from 'vitest'
import { generateColorPalette, generateSemanticColors } from './colorPalette.js'
import { colors, semanticColors } from './tokens.js'

const palette = generateColorPalette()
const semantic = generateSemanticColors()

describe('alpha placeholder', () => {
  it('opens an alpha slot on solid oklch values', () => {
    expect(palette.gray['500']).toBe(
      colors.light.gray['500'].replace(/\)$/, ' / <alpha-value>)'),
    )
  })

  // Overlay ramps are deliberately translucent. Tailwind cannot compose a
  // modifier onto an existing alpha channel, so they pass through untouched.
  it('leaves values that already carry alpha alone', () => {
    expect(palette['white-overlay']['50']).toBe(colors.overlay.white['50'])
    expect(palette['white-overlay']['50']).not.toContain('<alpha-value>')
  })

  it('exposes dark ramps under a dark- prefix', () => {
    expect(palette['dark-gray']['500']).toContain('<alpha-value>')
  })
})

describe('semantic colors', () => {
  // A `var(...)` reference has no alpha slot, so `bg-surface-base/50` would be
  // ignored without the color-mix wrapper. The light value rides along as the
  // var's fallback so the colour still renders where the stylesheet is absent.
  it('wraps the CSS variable with its light value as fallback', () => {
    expect(semantic.surface.base).toBe(
      `color-mix(in srgb, var(--surface-base, ${semanticColors.light.surface.base}) calc(<alpha-value> * 100%), transparent)`,
    )
  })

  it('covers every category the token layer defines', () => {
    expect(Object.keys(semantic).sort()).toEqual(
      Object.keys(semanticColors.light).sort(),
    )
  })
})

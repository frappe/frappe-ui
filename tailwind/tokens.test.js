/**
 * The public token surface (`frappe-ui/tailwind`).
 *
 * The load-bearing rule here is the sentinel check: Tailwind's `<alpha-value>`
 * placeholder and the `color-mix` wrapper are compile-time artefacts that mean
 * nothing to any other consumer. A colour picker handed one renders an empty
 * swatch. If shaping ever leaks back down from colorPalette.js into tokens.js,
 * that test fails before a consumer finds out.
 */
import { describe, expect, it } from 'vitest'
import * as tokens from './tokens.js'
import * as entry from './index.js'

const PUBLIC_NAMES = [
  'colors',
  'cssVariables',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'radius',
  'screens',
  'semanticColors',
  'shadows',
  'spacing',
  'textTransform',
  'tracking',
]

describe('public surface', () => {
  it('re-exports every token from frappe-ui/tailwind', () => {
    for (const name of PUBLIC_NAMES) {
      expect(entry[name], name).toBe(tokens[name])
    }
  })

  it('still ships the preset as the default export', () => {
    expect(entry.default.plugins).toBeInstanceOf(Array)
    expect(entry.content).toBeInstanceOf(Array)
  })
})

describe('framework neutrality', () => {
  it('carries no Tailwind sentinel anywhere', () => {
    const serialized = JSON.stringify(
      Object.fromEntries(PUBLIC_NAMES.map((n) => [n, tokens[n]])),
    )
    expect(serialized).not.toContain('<alpha-value>')
    expect(serialized).not.toContain('color-mix')
  })

  it('resolves semantic colors to real values, not var() references', () => {
    expect(tokens.semanticColors.light.surface.base).toMatch(/^oklch\(/)
    expect(tokens.semanticColors.dark.surface.base).toMatch(/^oklch\(/)
  })
})

describe('semanticColors', () => {
  it('names the same categories and entries in both themes', () => {
    expect(Object.keys(tokens.semanticColors.dark).sort()).toEqual(
      Object.keys(tokens.semanticColors.light).sort(),
    )
    for (const category of Object.keys(tokens.semanticColors.light)) {
      expect(
        Object.keys(tokens.semanticColors.dark[category]).sort(),
        category,
      ).toEqual(Object.keys(tokens.semanticColors.light[category]).sort())
    }
  })

  it('actually differs between themes', () => {
    expect(tokens.semanticColors.dark.surface.base).not.toBe(
      tokens.semanticColors.light.surface.base,
    )
  })
})

describe('fontSize', () => {
  it('carries both families, paragraph prefixed p-', () => {
    expect(tokens.fontSize.base.fontSize).toBe('14px')
    expect(tokens.fontSize['p-base'].fontSize).toBe('14px')
  })

  it('gives the paragraph family its own looser line-height', () => {
    expect(Number(tokens.fontSize['p-base'].lineHeight)).toBeGreaterThan(
      Number(tokens.fontSize.base.lineHeight),
    )
  })

  it('has no p- variant for a size the paragraph family does not define', () => {
    expect(tokens.fontSize['12xl']).toBeDefined()
    expect(tokens.fontSize['p-12xl']).toBeUndefined()
  })
})

describe('spacing', () => {
  it('fills the gaps stock Tailwind leaves above 12', () => {
    expect(tokens.spacing[17]).toBe('4.25rem')
    expect(tokens.spacing[128]).toBe('32rem')
    expect(tokens.spacing[129]).toBeUndefined()
  })

  it('keeps half steps only up to 19.5', () => {
    expect(tokens.spacing[19.5]).toBe('4.875rem')
    expect(tokens.spacing[20.5]).toBeUndefined()
  })
})

describe('cssVariables', () => {
  const light = tokens.cssVariables[':root']
  const dark = tokens.cssVariables['[data-theme="dark"]']
  const FOCUS_NAMES = ['default', 'red', 'green', 'amber', 'blue', 'violet']

  it('emits a focus outline per theme color, in both modes', () => {
    for (const name of FOCUS_NAMES) {
      expect(light[`--focus-outline-${name}`], `light ${name}`).toMatch(
        /^\d+px solid /,
      )
      expect(dark[`--focus-outline-${name}`], `dark ${name}`).toMatch(
        /^\d+px solid /,
      )
    }
  })

  // ADR-0005: the box-shadow form collided with `shadow-*` on the same element
  // and forced-colors mode dropped it. Only the outline form ships.
  it('emits no box-shadow form of the focus ring', () => {
    const shadowForm = Object.keys({ ...light, ...dark }).filter(
      (name) =>
        name.startsWith('--focus-') && !name.startsWith('--focus-outline-'),
    )
    expect(shadowForm).toEqual([])
  })

  it('keeps the 2px light / 3px dark focus width', () => {
    expect(light['--focus-outline-default']).toMatch(/^2px solid /)
    expect(dark['--focus-outline-default']).toMatch(/^3px solid /)
  })

  it('uses the light elevation values in both modes', () => {
    expect(light['--elevation-sm']).toBeDefined()
    expect(dark['--elevation-sm']).toBeUndefined()
  })

  it('emits one variable per radius token', () => {
    for (const key of Object.keys(tokens.radius)) {
      expect(light[`--radius-${key}`], key).toBe(tokens.radius[key])
    }
  })

  it('exposes both the semantic vocabulary and the raw ramps', () => {
    expect(light['--surface-base']).toBe(
      tokens.semanticColors.light.surface.base,
    )
    expect(light['--gray-500']).toBe(tokens.colors.light.gray['500'])
    expect(dark['--dark-gray-500']).toBe(tokens.colors.dark.gray['500'])
  })
})

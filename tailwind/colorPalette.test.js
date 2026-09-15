/**
 * The CSS variables the plugin's base layer emits.
 *
 * Only the outline form of the focus ring ships (ADR-0005). The box-shadow
 * form collided with `shadow-*` on the same element and forced-colors mode
 * dropped it, and nothing in frappe-ui ever read it.
 */
import { describe, expect, it } from 'vitest'
import { generateEffectVariables } from './colorPalette.js'

const effects = generateEffectVariables()
const light = effects[':root']
const dark = effects['[data-theme="dark"]']

const FOCUS_NAMES = ['default', 'red', 'green', 'amber', 'blue', 'violet']

describe('focus variables', () => {
  it('emits an outline variable per theme color, in both modes', () => {
    for (const name of FOCUS_NAMES) {
      expect(light[`--focus-outline-${name}`], `light ${name}`).toMatch(
        /^\d+px solid /,
      )
      expect(dark[`--focus-outline-${name}`], `dark ${name}`).toMatch(
        /^\d+px solid /,
      )
    }
  })

  it('emits no box-shadow form', () => {
    const shadowForm = Object.keys({ ...light, ...dark }).filter(
      (name) =>
        name.startsWith('--focus-') && !name.startsWith('--focus-outline-'),
    )
    expect(shadowForm).toEqual([])
  })

  it('keeps the 2px light / 3px dark width', () => {
    expect(light['--focus-outline-default']).toMatch(/^2px solid /)
    expect(dark['--focus-outline-default']).toMatch(/^3px solid /)
  })
})

describe('elevation variables', () => {
  it('uses the light values in both modes', () => {
    expect(light['--elevation-sm']).toBeDefined()
    expect(dark['--elevation-sm']).toBeUndefined()
  })
})

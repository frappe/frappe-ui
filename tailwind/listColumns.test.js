import { describe, expect, it } from 'vitest'
import { listBreakpoints, listColumnRules } from './listColumns.js'

const PRESET_SCREENS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

describe('listBreakpoints', () => {
  it('orders screens by min width, whatever the config order', () => {
    const screens = { xl: '1280px', sm: '640px', lg: '1024px', md: '768px' }
    expect(listBreakpoints(screens).map((s) => s.name)).toEqual([
      'sm',
      'md',
      'lg',
      'xl',
    ])
  })

  it('orders rem and px screens on one scale', () => {
    const screens = { tablet: '40rem', phone: '380px', desktop: '64rem' }
    expect(listBreakpoints(screens).map((s) => s.name)).toEqual([
      'phone',
      'tablet',
      'desktop',
    ])
  })

  it('keeps the min of a min/max screen and drops screens with no floor', () => {
    const screens = {
      band: { min: '700px', max: '900px' },
      short: { raw: '(max-height: 600px)' },
      narrow: { max: '600px' },
      multi: [{ min: '100px', max: '200px' }, { min: '400px' }],
      md: '768px',
    }
    expect(listBreakpoints(screens)).toEqual([
      { name: 'band', min: '700px' },
      { name: 'md', min: '768px' },
    ])
  })

  it('ignores a screen named base, which the columns prop reserves', () => {
    expect(listBreakpoints({ base: '0px', md: '768px' })).toEqual([
      { name: 'md', min: '768px' },
    ])
  })
})

describe('listColumnRules', () => {
  it('resets every carrier on each list root and derives the base tier', () => {
    const rules = listColumnRules(PRESET_SCREENS)
    expect(rules["[data-slot='list']"]).toEqual({
      '--_list-columns-base': 'initial',
      '--_list-columns-sm': 'initial',
      '--_list-columns-md': 'initial',
      '--_list-columns-lg': 'initial',
      '--_list-columns-xl': 'initial',
      '--_list-columns': 'var(--_list-columns-base)',
    })
  })

  it('falls a breakpoint through every lower tier down to base', () => {
    const rules = listColumnRules(PRESET_SCREENS)
    expect(rules['@media (min-width: 768px)']).toEqual({
      "[data-slot='list']": {
        '--_list-columns':
          'var(--_list-columns-md, var(--_list-columns-sm, var(--_list-columns-base)))',
      },
    })
  })

  it('emits the media rules in ascending order, so the highest match wins', () => {
    const rules = listColumnRules(PRESET_SCREENS)
    expect(Object.keys(rules)).toEqual([
      "[data-slot='list']",
      '@media (min-width: 640px)',
      '@media (min-width: 768px)',
      '@media (min-width: 1024px)',
      '@media (min-width: 1280px)',
    ])
  })

  it("uses the app's own breakpoint names and widths", () => {
    // An app that redefines md moves the list's tracks with its md: utilities.
    const rules = listColumnRules({ md: '900px', wide: '1600px' })
    expect(Object.keys(rules)).toEqual([
      "[data-slot='list']",
      '@media (min-width: 900px)',
      '@media (min-width: 1600px)',
    ])
    expect(
      rules['@media (min-width: 1600px)']["[data-slot='list']"],
    ).toEqual({
      '--_list-columns':
        'var(--_list-columns-wide, var(--_list-columns-md, var(--_list-columns-base)))',
    })
  })

  it('still resets and resolves the base tier with no usable screens', () => {
    expect(listColumnRules({})).toEqual({
      "[data-slot='list']": {
        '--_list-columns-base': 'initial',
        '--_list-columns': 'var(--_list-columns-base)',
      },
    })
  })
})

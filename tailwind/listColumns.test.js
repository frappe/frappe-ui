import { describe, expect, it } from 'vitest'
import postcss from 'postcss'
import tailwind from 'tailwindcss'
import { listScreens, listColumnRules } from './listColumns.js'
import preset from './preset.js'

const PRESET_SCREENS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

describe('listScreens', () => {
  it('orders plain widths by size, whatever the config order', () => {
    const screens = { xl: '1280px', sm: '640px', lg: '1024px', md: '768px' }
    expect(listScreens(screens).map((s) => s.name)).toEqual([
      'sm',
      'md',
      'lg',
      'xl',
    ])
  })

  it('gives every screen shape the condition Tailwind uses for it', () => {
    const screens = {
      wide: '768px',
      floor: { min: '700px' },
      band: { min: '700px', max: '900px' },
      narrow: { max: '600px' },
      short: { raw: '(max-height: 600px)' },
      multi: [{ min: '100px', max: '200px' }, { min: '400px' }],
    }
    expect(listScreens(screens)).toEqual([
      { name: 'wide', media: '(min-width: 768px)' },
      { name: 'floor', media: '(min-width: 700px)' },
      { name: 'band', media: '(min-width: 700px) and (max-width: 900px)' },
      { name: 'narrow', media: '(max-width: 600px)' },
      { name: 'short', media: '(max-height: 600px)' },
      { name: 'multi', media: '(min-width: 100px) and (max-width: 200px), (min-width: 400px)' },
    ])
  })

  it('keeps declaration order once a screen is an object, as Tailwind does', () => {
    // Tailwind can only sort screen variants when every screen is a plain
    // string, so with an object in the config the tier that wins where two
    // match is the one declared last — same as the utility that wins.
    const screens = { md: '768px', band: { min: '700px', max: '900px' } }
    expect(listScreens(screens).map((s) => s.name)).toEqual(['md', 'band'])
  })

  it('keeps declaration order for mixed units, as Tailwind does', () => {
    // `40rem` is wider than `380px`, but Tailwind refuses to sort screens whose
    // units differ, so its `tablet:` utilities beat `phone:` ones on order
    // alone. The tiers have to land the same way round.
    const screens = { tablet: '40rem', phone: '380px', desktop: '64rem' }
    expect(listScreens(screens).map((s) => s.name)).toEqual([
      'tablet',
      'phone',
      'desktop',
    ])
  })

  it('ignores a screen named base, which the columns prop reserves', () => {
    expect(listScreens({ base: '0px', md: '768px' })).toEqual([
      { name: 'md', media: '(min-width: 768px)' },
    ])
  })

  it('drops a screen with no condition to emit', () => {
    expect(listScreens({ nothing: {}, md: '768px' })).toEqual([
      { name: 'md', media: '(min-width: 768px)' },
    ])
  })
})

describe('listColumnRules', () => {
  it('resets every carrier on each list root and resolves the tier chain', () => {
    const rules = listColumnRules(PRESET_SCREENS)
    expect(rules["[data-slot='list']"]).toEqual({
      '--_list-columns-base': 'initial',
      '--_list-columns-sm': 'initial',
      '--_list-columns-md': 'initial',
      '--_list-columns-lg': 'initial',
      '--_list-columns-xl': 'initial',
      '--_list-columns':
        'var(--_list-tier-xl, var(--_list-tier-lg, var(--_list-tier-md, ' +
        'var(--_list-tier-sm, var(--_list-columns-base)))))',
    })
  })

  it('makes a tier live only inside its own screen', () => {
    const rules = listColumnRules(PRESET_SCREENS)
    expect(rules['@media (min-width: 768px)']).toEqual({
      "[data-slot='list']": { '--_list-tier-md': 'var(--_list-columns-md)' },
    })
  })

  it('ends a bounded screen where the screen ends', () => {
    // The tier stops at 900px, so above it the tracks fall back to the tier
    // below — in step with the `band:` utilities, which stop there too.
    const rules = listColumnRules({ band: { min: '700px', max: '900px' } })
    expect(rules).toEqual({
      "[data-slot='list']": {
        '--_list-columns-base': 'initial',
        '--_list-columns-band': 'initial',
        '--_list-columns':
          'var(--_list-tier-band, var(--_list-columns-base))',
      },
      '@media (min-width: 700px) and (max-width: 900px)': {
        "[data-slot='list']": {
          '--_list-tier-band': 'var(--_list-columns-band)',
        },
      },
    })
  })

  it('carries a ceiling, a raw query and a multi-range screen too', () => {
    const rules = listColumnRules({
      narrow: { max: '600px' },
      short: { raw: '(max-height: 600px)' },
      multi: [{ max: '200px' }, { min: '400px' }],
    })
    expect(Object.keys(rules)).toEqual([
      "[data-slot='list']",
      '@media (max-width: 600px)',
      '@media (max-height: 600px)',
      '@media (max-width: 200px), (min-width: 400px)',
    ])
    expect(rules["[data-slot='list']"]['--_list-columns']).toBe(
      'var(--_list-tier-multi, var(--_list-tier-short, ' +
        'var(--_list-tier-narrow, var(--_list-columns-base))))',
    )
  })

  it('keeps both tiers when two screens share one condition', () => {
    const rules = listColumnRules({ sm: '640px', tablet: '640px' })
    expect(rules['@media (min-width: 640px)']).toEqual({
      "[data-slot='list']": {
        '--_list-tier-sm': 'var(--_list-columns-sm)',
        '--_list-tier-tablet': 'var(--_list-columns-tablet)',
      },
    })
  })

  it("uses the app's own breakpoint names and widths", () => {
    // An app that redefines md moves the list's tracks with its md: utilities.
    const rules = listColumnRules({ md: '900px', wide: '1600px' })
    expect(Object.keys(rules)).toEqual([
      "[data-slot='list']",
      '@media (min-width: 900px)',
      '@media (min-width: 1600px)',
    ])
    expect(rules["[data-slot='list']"]['--_list-columns']).toBe(
      'var(--_list-tier-wide, var(--_list-tier-md, var(--_list-columns-base)))',
    )
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

// The unit tests above check the generator. These check the wiring, and the one
// promise the prop makes: a tier and that screen's visibility utilities are
// live under the same conditions, whatever shape the app's screen is in. The
// plugin has to read the *resolved* theme for any of it to hold.
describe('the preset, built against an app config', () => {
  async function build(config, css = '@tailwind base;') {
    const built = await postcss([tailwind(config)]).process(css, {
      from: undefined,
    })
    return built.css
  }

  function baseLayer(config) {
    return build(config)
  }

  // Every media condition a given snippet of CSS appears under, in source
  // order. Comparing the tier's conditions with the utility's is the whole
  // acceptance test: same conditions means they switch together.
  function conditionsAround(css, needle) {
    const conditions = []
    postcss.parse(css).walkAtRules('media', (rule) => {
      if (rule.toString().includes(needle)) conditions.push(rule.params)
    })
    return conditions
  }

  function ladder(css) {
    return css
      .split('\n')
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.startsWith('@media (min-width') ||
          line.startsWith('--_list-tier-'),
      )
  }

  it("uses the app's overridden and added screens, re-sorted by width", async () => {
    const css = await baseLayer({
      presets: [preset],
      content: [{ raw: '<div data-slot="list"></div>' }],
      theme: { extend: { screens: { md: '900px', tablet: '850px' } } },
    })
    expect(ladder(css)).toEqual([
      '@media (min-width: 640px) {',
      '--_list-tier-sm: var(--_list-columns-sm);',
      // tablet sorts below the overridden md, though it was declared after it.
      '@media (min-width: 850px) {',
      '--_list-tier-tablet: var(--_list-columns-tablet);',
      '@media (min-width: 900px) {',
      '--_list-tier-md: var(--_list-columns-md);',
      '@media (min-width: 1024px) {',
      '--_list-tier-lg: var(--_list-columns-lg);',
      '@media (min-width: 1280px) {',
      '--_list-tier-xl: var(--_list-columns-xl);',
    ])
    expect(css).toContain(
      '--_list-columns: var(--_list-tier-xl, var(--_list-tier-lg, ' +
        'var(--_list-tier-md, var(--_list-tier-tablet, ' +
        'var(--_list-tier-sm, var(--_list-columns-base))))))',
    )
  })

  it("switches list tracks at the same width as the app's md: utilities", async () => {
    const css = await build(
      {
        presets: [preset],
        content: [{ raw: '<div data-slot="list" class="md:hidden"></div>' }],
        theme: { extend: { screens: { md: '900px' } } },
      },
      '@tailwind base;@tailwind utilities;',
    )
    expect(conditionsAround(css, '--_list-tier-md')).toEqual([
      '(min-width: 900px)',
    ])
    expect(conditionsAround(css, '.md\\:hidden')).toEqual([
      '(min-width: 900px)',
    ])
    expect(css).not.toContain('@media (min-width: 768px)')
  })

  it('ends a bounded screen exactly where its utilities end', async () => {
    // The regression: a `{ min, max }` screen used to keep only its min, so the
    // tier stayed on above the max while `band:hidden` had already switched off
    // — cells and tracks disagreeing, which is the one thing this file exists
    // to prevent.
    const css = await build(
      {
        presets: [preset],
        content: [{ raw: '<div data-slot="list" class="band:hidden"></div>' }],
        theme: { screens: { band: { min: '700px', max: '900px' } } },
      },
      '@tailwind base;@tailwind utilities;',
    )
    const utility = conditionsAround(css, '.band\\:hidden')
    expect(utility).toEqual(['(min-width: 700px) and (max-width: 900px)'])
    expect(conditionsAround(css, '--_list-tier-band')).toEqual(utility)
  })

  it('matches a ceiling screen and a raw screen the same way', async () => {
    const css = await build(
      {
        presets: [preset],
        content: [
          { raw: '<div data-slot="list" class="narrow:hidden short:hidden"></div>' },
        ],
        theme: {
          screens: {
            narrow: { max: '600px' },
            short: { raw: '(max-height: 600px)' },
          },
        },
      },
      '@tailwind base;@tailwind utilities;',
    )
    expect(conditionsAround(css, '--_list-tier-narrow')).toEqual(
      conditionsAround(css, '.narrow\\:hidden'),
    )
    expect(conditionsAround(css, '--_list-tier-short')).toEqual(
      conditionsAround(css, '.short\\:hidden'),
    )
    expect(conditionsAround(css, '.short\\:hidden')).toEqual([
      '(max-height: 600px)',
    ])
  })

  it('lets the same tier win as the utility where two screens overlap', async () => {
    // An object screen stops Tailwind sorting, so `band:` wins over `md:` on
    // declaration order alone. The chain has to nest the same way round, or a
    // hidden cell and its track would be chosen from different tiers.
    const css = await build(
      {
        presets: [preset],
        content: [
          { raw: '<div data-slot="list" class="md:hidden band:hidden"></div>' },
        ],
        theme: {
          screens: { md: '768px', band: { min: '700px', max: '900px' } },
        },
      },
      '@tailwind base;@tailwind utilities;',
    )
    // Tailwind emits the winner last.
    expect(css.indexOf('.md\\:hidden')).toBeLessThan(
      css.indexOf('.band\\:hidden'),
    )
    // The chain tries the winner first (outermost).
    expect(css).toContain(
      '--_list-columns: var(--_list-tier-band, ' +
        'var(--_list-tier-md, var(--_list-columns-base)))',
    )
  })
})

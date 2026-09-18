/**
 * The public token surface (`frappe-ui/tailwind/tokens`).
 *
 * The load-bearing rule here is the sentinel check: Tailwind's `<alpha-value>`
 * placeholder and the `color-mix` wrapper are compile-time artefacts that mean
 * nothing to any other consumer. A colour picker handed one renders an empty
 * swatch. If shaping ever leaks back down from colorPalette.js into tokens.js,
 * that test fails before a consumer finds out.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import effects from './tokens/effects.json' with { type: 'json' }
import * as tokens from './tokens.js'

const PUBLIC_NAMES = [
  'colors',
  'cssVariables',
  'focusRing',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'radius',
  'screens',
  'semanticColors',
  'shadows',
  'spacing',
  'tracking',
]

describe('public surface', () => {
  it('exports every token name', () => {
    expect(Object.keys(tokens).sort()).toEqual([...PUBLIC_NAMES].sort())
  })

  // `textTransform` was an empty object for its whole life: `tiny`, the
  // uppercase eyebrow style behind it, went away in #940. plugin.js reads the
  // property from typography.json instead.
  it('does not export textTransform', () => {
    expect('textTransform' in tokens).toBe(false)
  })

  // The tokens sit on their own subpath because `frappe-ui/tailwind`
  // statically imports tailwindcss/plugin, @tailwindcss/forms and
  // @tailwindcss/typography, none of which resolve under plain Node. Both
  // are build-time entries, which ADR-0010 freezes additive-only until
  // 2.0.0 — this path may not be renamed.
  it('is reachable at frappe-ui/tailwind/tokens', () => {
    expect(pkg.exports['./tailwind/tokens']).toEqual({
      types: './tailwind/tokens.d.ts',
      import: './tailwind/tokens.js',
      default: './tailwind/tokens.js',
    })
  })

  it('imports nothing outside its own token JSON', () => {
    const src = readFileSync(new URL('./tokens.js', import.meta.url), 'utf8')
    const specifiers = [...src.matchAll(/from\s+'([^']+)'/g)].map(
      (m) => m[1],
    )
    expect(specifiers.every((s) => s.startsWith('./tokens/'))).toBe(true)
  })
})

describe('native node', () => {
  // Vitest transforms JSON imports, so it cannot see a missing import
  // attribute — only a real node process can. The docs promise a plain Node
  // script can read tokens from this entry point, so spawn one.
  it('loads under plain node, with no bundler', () => {
    const entryPath = fileURLToPath(new URL('./tokens.js', import.meta.url))
    const out = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { radius, semanticColors } from ${JSON.stringify(entryPath)}
         console.log(radius['4'], semanticColors.light.surface.base)`,
      ],
      { encoding: 'utf8' },
    ).trim()
    expect(out).toBe(
      `${tokens.radius['4']} ${tokens.semanticColors.light.surface.base}`,
    )
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

describe('shadows', () => {
  it('is flat, and keyed like the shadow-* utilities', () => {
    expect(Object.keys(tokens.shadows).sort()).toEqual(
      ['none', 'DEFAULT', 'sm', 'base', 'md', 'lg', 'xl', '2xl'].sort(),
    )
    expect(tokens.shadows.elevation).toBeUndefined()
    expect(tokens.shadows.focus).toBeUndefined()
  })

  // The point of the map: a consumer with no frappe-ui stylesheet can paint
  // these. A `var(--elevation-*)` reference would resolve to nothing there.
  it('holds real box-shadow strings, not var() references', () => {
    for (const [key, value] of Object.entries(tokens.shadows)) {
      expect(typeof value, key).toBe('string')
      expect(value, key).not.toContain('var(')
    }
    expect(tokens.shadows.none).toBe('none')
  })

  it('points DEFAULT at the base step', () => {
    expect(tokens.shadows.DEFAULT).toBe(tokens.shadows.base)
  })

  // The dark elevation ramp stays in effects.json. Espresso 2.0 references
  // `elevation/light/*` on its dark page too, so it is not what we render.
  it('ships only the light elevation ramp', () => {
    expect(tokens.shadows.base).toBe(effects.elevation.light.base)
  })
})

describe('focusRing', () => {
  const NAMES = ['default', 'red', 'green', 'amber', 'blue', 'violet']

  it('carries both themes, every colour', () => {
    expect(Object.keys(tokens.focusRing).sort()).toEqual(['dark', 'light'])
    expect(Object.keys(tokens.focusRing.light).sort()).toEqual([...NAMES].sort())
    expect(Object.keys(tokens.focusRing.dark).sort()).toEqual([...NAMES].sort())
  })

  // ADR-0005: frappe-ui draws focus as an outline, so the export is the
  // outline shorthand, matching `--focus-outline-<name>` exactly.
  it('is the outline shorthand, 2px light and 3px dark', () => {
    expect(tokens.focusRing.light.default).toMatch(/^2px solid /)
    expect(tokens.focusRing.dark.default).toMatch(/^3px solid /)
    for (const name of NAMES) {
      expect(tokens.cssVariables.light[`--focus-outline-${name}`]).toBe(
        tokens.focusRing.light[name],
      )
      expect(tokens.cssVariables.dark[`--focus-outline-${name}`]).toBe(
        tokens.focusRing.dark[name],
      )
    }
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
  const light = tokens.cssVariables.light
  const dark = tokens.cssVariables.dark
  const FOCUS_NAMES = ['default', 'red', 'green', 'amber', 'blue', 'violet']

  // Keyed by theme, not by selector. `plugin.js` picks the selector each
  // theme lands on, because that choice is Tailwind's, not the token data's.
  it('has exactly the two theme keys', () => {
    expect(Object.keys(tokens.cssVariables).sort()).toEqual(['dark', 'light'])
  })

  // `dark` is an override layer: anything it leaves out keeps the light value.
  it('keeps dark to the properties that change', () => {
    expect(Object.keys(dark).length).toBeLessThan(Object.keys(light).length)
    expect(dark['--surface-base']).not.toBe(light['--surface-base'])
  })

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

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
import { content } from './content.js'
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

/**
 * Key order in `theme.boxShadow` is CSS source order. With `DEFAULT` last,
 * `class="shadow shadow-xl"` resolves to `.shadow`, so the order is asserted
 * here as well as in tokens.js#shadows. Nothing else checked the resolved
 * theme, so deleting the `DEFAULT` branch in buildBoxShadowConfig left every
 * tailwind test green.
 */
describe('boxShadow theme', () => {
  it('points every key at its elevation variable, in order', () => {
    expect(Object.keys(theme.boxShadow)).toEqual([
      'none',
      'sm',
      'base',
      'DEFAULT',
      'md',
      'lg',
      'xl',
      '2xl',
    ])
    expect(theme.boxShadow.none).toBe('none')
    // `DEFAULT` is a Tailwind key name, not an elevation step: it shares the
    // `base` variable so `shadow` and `shadow-base` paint the same thing.
    expect(theme.boxShadow.DEFAULT).toBe('var(--elevation-base)')
    for (const key of ['sm', 'base', 'md', 'lg', 'xl', '2xl']) {
      expect(theme.boxShadow[key], key).toBe(`var(--elevation-${key})`)
    }
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

/**
 * The dark-theme checkbox marks are attribute selectors, so they must stay in
 * the base layer: Tailwind v4 loads a v3 preset through `@config` and fails
 * the build on an `addComponents` key that is not a single class name. These
 * tests compile the real preset, so a move back into `addComponents`, or a
 * dropped rule, fails here instead of in a consumer's v4 build.
 */
describe('dark-theme checkbox marks', () => {
  const compile = async () => {
    const { default: postcss } = await import('postcss')
    const { default: tailwindcss } = await import('tailwindcss')
    const result = await postcss([
      tailwindcss({
        presets: [preset],
        content: [
          {
            raw: '<input type="checkbox" class="form-checkbox" /><input class="form-input" /><p class="text-ink-gray-8"></p>',
          },
        ],
      }),
    ]).process('@tailwind base;@tailwind components;@tailwind utilities;', {
      from: undefined,
    })
    return result.css
  }

  it('emits both marks with their background images', async () => {
    const css = await compile()
    expect(css).toContain(
      `[data-theme='dark'] [type='checkbox']:checked {\n  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%230F0F0F' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");\n}`,
    )
    expect(css).toContain(
      `[data-theme='dark'] [type='checkbox']:indeterminate {\n  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='%230F0F0F' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");\n}`,
    )
  })

  it('keeps them in the base layer, after the forms plugin', async () => {
    const css = await compile()
    const at = (needle) => {
      const index = css.indexOf(needle)
      expect(index, `missing: ${needle}`).toBeGreaterThan(-1)
      return index
    }
    // Between the forms plugin's own base rule and the first component rule.
    expect(at(`input:where([type='checkbox']):checked`)).toBeLessThan(
      at(`[data-theme='dark'] [type='checkbox']:checked`),
    )
    expect(
      at(`[data-theme='dark'] [type='checkbox']:indeterminate`),
    ).toBeLessThan(at('.form-input'))
  })
})

/**
 * `future.hoverOnlyWhenSupported` puts every `hover:` under a media query, so
 * a phone never wears one — and so anything shown only on hover needs a touch
 * path, which the library writes as `[@media(hover:none)]:opacity-100`. These
 * compile the real preset: the gate has to be there, and the touch rule has to
 * come late enough in the sheet to win.
 */
describe('hover', () => {
  const compile = async (html) => {
    const { default: postcss } = await import('postcss')
    const { default: tailwindcss } = await import('tailwindcss')
    const result = await postcss([
      tailwindcss({
        presets: [preset],
        content: [{ raw: html, extension: 'html' }],
      }),
    ]).process('@tailwind utilities', { from: undefined })
    return result.css
  }

  it('applies only where hovering is possible', async () => {
    // Reaches every app on the preset, so a dropped flag should fail here.
    expect(preset.future.hoverOnlyWhenSupported).toBe(true)
    const css = await compile('<div class="hover:opacity-50">')
    expect(css).toMatch(
      /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.hover\\:opacity-50:hover \{/,
    )
    expect(css).not.toMatch(/^\.hover\\:opacity-50:hover/m)
  })

  it('lets a reveal show outright where hovering is not', async () => {
    const css = await compile(
      '<div class="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100">',
    )
    const base = css.indexOf('.opacity-0 {')
    const touch = css.indexOf('@media(hover:none) {')
    expect(base).toBeGreaterThan(-1)
    // Later in the sheet at the same specificity, so it wins where it applies.
    expect(touch).toBeGreaterThan(base)
    expect(css.slice(touch)).toMatch(/opacity-100 \{\s*opacity: 1/)
  })
})

/**
 * Tailwind reads an underscore in an arbitrary value as a space, so a class
 * like `mx-[var(--_x)]` compiles to `var(-- x)`: not a variable reference in
 * any browser, and a hard error in lightningcss, which is what every consumer
 * minifying with rolldown-vite hit. The escape is `--\_x`. This compiles the
 * sources the shipped `content` export hands consumers — the same list, so
 * a slip anywhere an app would scan fails here.
 */
describe('arbitrary values', () => {
  it('keep every custom property name whole', async () => {
    const { default: postcss } = await import('postcss')
    const { default: tailwindcss } = await import('tailwindcss')
    const { css } = await postcss([
      tailwindcss({
        presets: [preset],
        content,
      }),
    ]).process('@tailwind utilities', { from: undefined })
    expect(css).toMatch(/var\(--_page-header-mobile-title-inset\)/)
    expect(css).not.toMatch(/var\(--\s/)
  }, 60_000)
})

/**
 * What the icon pack plugin actually emits, run through Tailwind with the real
 * preset: the class form is a masked square, and it must leave inline SVGs
 * alone. lucide-vue-next stamps every SVG it renders with `lucide-<name>`, the
 * very class this plugin owns, so an unguarded rule matched those SVGs too:
 * it pinned them to 1em and painted the plugin's own shape over them, and a
 * `size` or stroke set on the component did nothing.
 */
import { describe, expect, it } from 'vitest'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import preset from './preset.js'

async function cssFor(html) {
  const result = await postcss([
    tailwindcss({
      content: [{ raw: html }],
      presets: [preset],
      corePlugins: { preflight: false },
    }),
  ]).process('@tailwind components; @tailwind utilities;', { from: undefined })
  return result.css
}

describe('icon pack plugin', () => {
  it('emits the mask for elements that are not SVGs', async () => {
    const css = await cssFor('<span class="lucide-search size-4"></span>')
    expect(css).toMatch(
      /\.lucide-search:where\(:not\(svg\)\)\s*\{[^}]*mask-image/,
    )
  })

  it('never emits a bare rule an inline SVG with the same class would match', async () => {
    const css = await cssFor('<span class="lucide-search"></span>')
    expect(css).not.toMatch(/\.lucide-search\s*\{/)
  })

  it('still lets a size utility win over the mask', async () => {
    const css = await cssFor('<span class="lucide-search size-4"></span>')
    expect(css.indexOf('.size-4')).toBeGreaterThan(
      css.indexOf('.lucide-search'),
    )
  })
})

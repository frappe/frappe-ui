import plugin from 'tailwindcss/plugin'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

// Resolve lucide-static's icons directory once per plugin init. Works whether
// frappe-ui is consumed locally or installed as a dependency of another app.
const require = createRequire(import.meta.url)
const ICONS_DIR = path.join(
  path.dirname(require.resolve('lucide-static/package.json')),
  'icons',
)

const svgDataUriCache = new Map()

function encodeSvgAsDataUri(name) {
  if (svgDataUriCache.has(name)) return svgDataUriCache.get(name)

  const filePath = path.join(ICONS_DIR, `${name}.svg`)
  if (!fs.existsSync(filePath)) {
    svgDataUriCache.set(name, null)
    return null
  }

  const svg = fs.readFileSync(filePath, 'utf8').replace(/\s+/g, ' ').trim()
  const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  svgDataUriCache.set(name, uri)
  return uri
}

function readAvailableIconNames() {
  try {
    return fs
      .readdirSync(ICONS_DIR)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.replace(/\.svg$/, ''))
  } catch {
    return []
  }
}

/**
 * Generates `lucide-<name>` utility classes for every icon shipped by
 * lucide-static (~1800 icons). Each class renders as an inline-block
 * square that masks the icon SVG with the current text color — so you
 * can size it with `size-*`, tint it with `text-*`, and drop it into
 * any template without an import:
 *
 *   <span class="lucide-menu size-4 text-ink-gray-6" />
 *
 * Under the hood each class emits a `mask-image` data URI pointing at
 * the raw lucide SVG, plus `background-color: currentColor`. Tailwind's
 * JIT only emits CSS for classes actually referenced in source, so the
 * 1800-icon registration is a lookup table — the generated CSS stays
 * minimal.
 */
export default plugin(({ matchUtilities }) => {
  const names = readAvailableIconNames()
  const values = Object.fromEntries(names.map((n) => [n, n]))

  matchUtilities(
    {
      lucide: (value) => {
        const uri = encodeSvgAsDataUri(value)
        if (!uri) return {}
        return {
          display: 'inline-block',
          width: '1em',
          height: '1em',
          'background-color': 'currentColor',
          '-webkit-mask-image': `url("${uri}")`,
          'mask-image': `url("${uri}")`,
          '-webkit-mask-repeat': 'no-repeat',
          'mask-repeat': 'no-repeat',
          '-webkit-mask-position': 'center',
          'mask-position': 'center',
          '-webkit-mask-size': 'contain',
          'mask-size': 'contain',
          'flex-shrink': '0',
        }
      },
    },
    { values, type: 'any' },
  )
})

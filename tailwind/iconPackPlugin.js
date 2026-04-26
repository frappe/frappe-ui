import plugin from 'tailwindcss/plugin'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Builds a Tailwind plugin that exposes every SVG in `iconsDir` as a
 * `<prefix>-<name>` utility class. Each class renders as a block-level
 * square (matching Tailwind preflight's `svg { display: block }`) that
 * masks the icon SVG with the current text color — size with `size-*`,
 * tint with `text-*`:
 *
 *   <span class="lucide-menu size-4 text-ink-gray-6" />
 *
 * Designed to be reused for any pack that ships a flat directory of named
 * SVGs (lucide, tabler, heroicons, custom in-repo packs, ...). Tailwind's
 * JIT only emits CSS for classes actually referenced in source, so a
 * full-pack registration is a lookup table — generated CSS stays minimal.
 *
 * @param {object} options
 * @param {string} options.prefix              Class prefix, e.g. 'lucide'.
 * @param {string} options.iconsDir            Absolute path to a directory of `<name>.svg` files.
 * @param {number} [options.normalizeStrokeWidth]  If set, rewrites every SVG's stroke-width to this value.
 * @param {string} [options.defaultColor]      CSS color baked as `color: ...` (overridable via `text-*`).
 */
export function iconPackPlugin({
  prefix,
  iconsDir,
  normalizeStrokeWidth,
  defaultColor,
}) {
  if (!prefix) throw new Error('iconPackPlugin: `prefix` is required')
  if (!iconsDir) throw new Error('iconPackPlugin: `iconsDir` is required')

  const svgDataUriCache = new Map()

  function encodeSvgAsDataUri(name) {
    if (svgDataUriCache.has(name)) return svgDataUriCache.get(name)

    const filePath = path.join(iconsDir, `${name}.svg`)
    if (!fs.existsSync(filePath)) {
      svgDataUriCache.set(name, null)
      return null
    }

    let svg = fs.readFileSync(filePath, 'utf8')
    if (normalizeStrokeWidth != null) {
      svg = svg.replace(
        /stroke-width="[^"]+"/g,
        `stroke-width="${normalizeStrokeWidth}"`,
      )
    }
    svg = svg.replace(/\s+/g, ' ').trim()
    const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    svgDataUriCache.set(name, uri)
    return uri
  }

  function readAvailableIconNames() {
    try {
      return fs
        .readdirSync(iconsDir)
        .filter((f) => f.endsWith('.svg'))
        .map((f) => f.replace(/\.svg$/, ''))
    } catch {
      return []
    }
  }

  return plugin(({ matchComponents }) => {
    const names = readAvailableIconNames()
    const values = Object.fromEntries(names.map((n) => [n, n]))

    // Registered via `matchComponents` (not `matchUtilities`) so Tailwind
    // puts these rules in the components layer. Regular utilities like
    // `size-4`, `w-5`, `text-ink-gray-6` live in the utilities layer which
    // comes after — so they always win without needing `!important`.
    matchComponents(
      {
        [prefix]: (value) => {
          const uri = encodeSvgAsDataUri(value)
          if (!uri) return {}
          const rules = {
            // Match Tailwind preflight's `svg { display: block }` so a
            // class-based icon behaves identically to the inline-svg form
            // it replaces — no phantom line-box height in the parent, no
            // baseline drift next to text in flex containers.
            display: 'block',
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
          if (defaultColor) rules.color = defaultColor
          return rules
        },
      },
      { values, type: 'any' },
    )
  })
}

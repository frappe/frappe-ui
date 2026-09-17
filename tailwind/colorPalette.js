/**
 * Tailwind-shaped colours.
 *
 * Everything here exists because Tailwind needs a sentinel that is meaningless
 * anywhere else. `<alpha-value>` is how Tailwind v3 threads the `/50` opacity
 * modifier into a colour: it substitutes the modifier at compile time. A bare
 * `oklch(L C H)` has no alpha slot, so without the placeholder `bg-blue-900/30`
 * silently emits an opaque colour.
 *
 * Which is why this is a separate layer. `tokens.js` holds the same values
 * clean, for every consumer that is not Tailwind.
 */
import tailwindColors from 'tailwindcss/colors'
import { colors, semanticColors } from './tokens.js'

// Inject the placeholder into solid oklch values. Values that already carry an
// alpha channel (the overlay ramps) are left intact — they are deliberately
// translucent, and a modifier on top of that is not a thing Tailwind supports.
function withAlphaPlaceholder(value) {
  if (typeof value !== 'string') return value
  const solid = value.match(/^oklch\(([^/]+)\)$/)
  return solid ? `oklch(${solid[1].trim()} / <alpha-value>)` : value
}

function mapShades(shades) {
  return Object.fromEntries(
    Object.entries(shades).map(([shade, value]) => [
      shade,
      withAlphaPlaceholder(value),
    ]),
  )
}

// Declared in the order Tailwind should emit their utilities. Key order in
// `theme.colors` is CSS source order, so two colour utilities on the same
// element resolve by it — which makes this list behaviour, not decoration.
// Families in the export but not named here still land, after these.
const FAMILY_ORDER = [
  'gray',
  'blue',
  'green',
  'red',
  'orange',
  'yellow',
  'teal',
  'violet',
  'cyan',
  'amber',
  'pink',
  'purple',
]

function generateColorPalette() {
  const colorPalette = {
    inherit: tailwindColors.inherit,
    current: tailwindColors.current,
    transparent: tailwindColors.transparent,
    black: tailwindColors.black,
    white: tailwindColors.white,
  }
  for (const family of FAMILY_ORDER) colorPalette[family] = {}
  colorPalette['white-overlay'] = { ...colors.overlay.white }
  colorPalette['black-overlay'] = { ...colors.overlay.black }

  for (const [family, shades] of Object.entries(colors.light)) {
    colorPalette[family] = mapShades(shades)
  }
  // Dark ramps are addressable by name (`bg-dark-gray-500`) for the rare case
  // a component needs the other theme's step explicitly. Theme flipping itself
  // goes through the semantic `--<category>-<name>` variables, not these.
  for (const [family, shades] of Object.entries(colors.dark)) {
    colorPalette[`dark-${family}`] = mapShades(shades)
  }

  return colorPalette
}

// Semantic colours point at their CSS variable rather than a fixed value, so
// one utility works in both themes. The `color-mix` wrapper is what gives them
// an alpha slot: a `var(...)` reference has none, so `bg-surface-base/50` would
// otherwise be ignored. The resolved light value rides along as the var's
// fallback, so the colour still renders where the stylesheet isn't loaded.
function generateSemanticColors() {
  return Object.fromEntries(
    Object.entries(semanticColors.light).map(([category, entries]) => [
      category,
      Object.fromEntries(
        Object.entries(entries).map(([name, lightValue]) => [
          name,
          `color-mix(in srgb, var(--${category}-${name}, ${lightValue}) calc(<alpha-value> * 100%), transparent)`,
        ]),
      ),
    ]),
  )
}

export { generateColorPalette, generateSemanticColors }

/**
 * The design tokens, as data.
 *
 * This is the one module that turns `./tokens/*.js` into shaped values, and
 * the only one a consumer outside frappe-ui should read. Everything here is
 * framework-neutral: resolved `oklch(...)` strings, plain px, plain numbers.
 * Nothing carries a Tailwind sentinel.
 *
 * That last rule is load-bearing. `colorPalette.js` wraps these same values in
 * `oklch(L C H / <alpha-value>)` and `color-mix(... calc(<alpha-value> *
 * 100%) ...)` so Tailwind's `/50` opacity modifier works. Those strings mean
 * nothing anywhere else — a colour picker fed `<alpha-value>` renders an empty
 * swatch. The Tailwind-only shaping lives one layer up, in `colorPalette.js`
 * and `plugin.js`, and never leaks back down here.
 *
 * Exported as `frappe-ui/tailwind/tokens`, its own entry point. It imports
 * nothing but the four data modules beside it, so a Node script (codegen,
 * docs, a design tool) can read tokens with no bundler and no component tree.
 * The preset at `frappe-ui/tailwind` cannot: it statically imports
 * `tailwindcss/plugin`, which plain Node does not resolve.
 *
 * Those four are plain modules, not JSON. Reading JSON from an ES module
 * needs an import attribute, and the oldest config loaders in the supported
 * peer range cannot parse one. See `tokens/build.js`.
 *
 * Per ADR-0010 this surface is additive-only until 2.0.0: names may be added,
 * none may be renamed or removed.
 */

import colorsData from './tokens/colors.js'
import effectsData from './tokens/effects.js'
import radiusTokens from './tokens/radius.js'
import typographyTokens from './tokens/typography.js'

// ---------- COLORS ----------

/**
 * Primitive colour ramps, split by theme. These are the raw scales, not the
 * semantic vocabulary — `colors.light.gray[500]`, not `surface-gray-2`.
 * Reach for `semanticColors` unless you specifically want a ramp step.
 */
export const colors = {
  light: colorsData.lightMode,
  dark: colorsData.darkMode,
  overlay: colorsData.overlay,
  neutral: colorsData.neutral,
}

// `themedVariables` stores each semantic entry as an unresolved pointer into
// the ramps above (`"lightMode/gray/50"`, `"neutral/white"`). Follow it.
function resolveColorReference(reference) {
  const [mode, color, shade] = reference.split('/')
  if (mode === 'lightMode') return colorsData.lightMode[color][shade]
  if (mode === 'darkMode') return colorsData.darkMode[color][shade]
  if (mode === 'overlay') return colorsData.overlay[color][shade]
  if (mode === 'neutral') return colorsData.neutral[color]
  return null
}

function resolveThemedLayer(layer) {
  return Object.fromEntries(
    Object.entries(layer).map(([category, entries]) => [
      category,
      Object.fromEntries(
        Object.entries(entries).map(([name, reference]) => [
          name,
          resolveColorReference(reference),
        ]),
      ),
    ]),
  )
}

/**
 * The semantic vocabulary — `surface`, `surface-alpha`, `ink`, `outline`,
 * `outline-alpha` — resolved to real colours, per theme:
 *
 *   semanticColors.light.surface['gray-2']  // 'oklch(0.964 0 0)'
 *   semanticColors.dark.ink.base            // …
 *
 * Split by theme rather than theme-agnostic, because a consumer outside a
 * frappe-ui page has no `[data-theme]` to resolve against and needs to pick a
 * side. Inside a themed page, prefer the `--<category>-<name>` variables from
 * `cssVariables`, which flip on their own.
 */
export const semanticColors = {
  light: resolveThemedLayer(colorsData.themedVariables.light),
  dark: resolveThemedLayer(colorsData.themedVariables.dark),
}

// ---------- RADIUS ----------

/**
 * Numbered radius scale `0`–`9` plus `none` and `full`, in px. The named
 * aliases (`sm`, `md`, `lg`, …) were removed in 1.0.0 — see ADR-0006.
 */
export const radius = radiusTokens

// ---------- SHADOWS ----------

/**
 * The box-shadows frappe-ui renders, as one flat map of composed
 * `box-shadow` strings. Keyed the way the `shadow-*` utilities are: `none`,
 * the six elevation steps, and `DEFAULT` for the bare `shadow` class.
 *
 * Real values, not `var(--elevation-*)` references, so a consumer that has no
 * frappe-ui stylesheet can still paint the shadow. `plugin.js` reads the key
 * list from here and points each Tailwind key at its variable.
 *
 * Only the light steps ship. Espresso 2.0 references `elevation/light/*` on
 * its dark-mode page too, so `elevation.dark` in `effects.js` is not what
 * frappe-ui renders and is not exported. Focus is a separate shape, and a
 * different CSS property: see `focusRing`.
 */
export const shadows = buildShadows()

// `DEFAULT` sits right after `base`, where the theme literal always had it.
// `plugin.js` builds `theme.boxShadow` in this key order, and theme key order
// is CSS source order: with `DEFAULT` last, `class="shadow shadow-xl"` would
// resolve to `.shadow`, not `.shadow-xl`.
function buildShadows() {
  const out = { none: 'none' }
  for (const [step, value] of Object.entries(effectsData.elevation.light)) {
    out[step] = value
    if (step === 'base') out.DEFAULT = value
  }
  return { ...out, ...effectsData.elevation.custom }
}

// Focus tokens arrive as single-layer `0 0 0 <spread> <color>` shadows.
// Re-express as an `outline` shorthand so the focus ring never collides with
// a `shadow-*` utility on the same element and survives forced-colors mode
// (ADR-0005). Only the outline form is emitted; nothing reads `--focus-<name>`.
function shadowToOutline(shadow) {
  const parts = shadow.trim().split(/\s+/)
  return `${parts[3]} solid ${parts.slice(4).join(' ')}`
}

function toOutlines(layer) {
  return Object.fromEntries(
    Object.entries(layer).map(([name, value]) => [name, shadowToOutline(value)]),
  )
}

/**
 * The focus ring per theme, one entry per colour (`default`, `red`, `green`,
 * `amber`, `blue`, `violet`).
 *
 * Each value is an `outline` shorthand — `'2px solid #c9c9c9e5'` — not a
 * box-shadow. frappe-ui draws focus with `outline` (ADR-0005), and these are
 * the exact strings behind `--focus-outline-<name>`. Light rings are 2px,
 * dark ones 3px, which is why this one does mode-swap and `shadows` does not.
 */
export const focusRing = {
  light: toOutlines(effectsData.focus.light),
  dark: toOutlines(effectsData.focus.dark),
}

// ---------- TYPOGRAPHY ----------

/**
 * One entry per size, in both families. `fontSize.base` is the text family;
 * `fontSize['p-base']` is the paragraph family, same size with a looser
 * line-height and its own letter-spacing.
 *
 * Objects, not Tailwind's `[size, meta]` tuple form — the tuple is a Tailwind
 * convention and this module does not speak Tailwind. `plugin.js` converts.
 *
 * `letterSpacing` here is the regular weight's. Tracking varies by weight and
 * CSS letter-spacing cannot follow `font-weight`, so per-weight values live in
 * `tracking` and ship as self-contained `text-<size>-<weight>` classes.
 */
export const fontSize = buildFontSize()

function buildFontSize() {
  const out = {}
  for (const [key, [size, meta]] of Object.entries(typographyTokens.fontSize)) {
    out[key] = { fontSize: size, ...meta }
  }
  // Only these two. The paragraph family is the text family at a looser
  // line-height with its own tracking, and nothing else. Spreading the whole
  // paragraph entry would let a third key added to the Figma export reshape
  // every `p-*` style with no code change and no review.
  for (const [key, p] of Object.entries(typographyTokens.paragraph || {})) {
    if (!out[key]) continue
    out[`p-${key}`] = {
      ...out[key],
      lineHeight: p.lineHeight,
      letterSpacing: p.letterSpacing,
    }
  }
  return out
}

/**
 * `regular` is 420, not 400. Inter's 400 reads too light at frappe-ui's sizes,
 * and 420 is the one real customisation in the scale — the rest are stock
 * Inter weights.
 */
export const fontWeight = typographyTokens.fontWeight

export const fontFamily = typographyTokens.fontFamily

/**
 * Letter-spacing per (size, weight), for the `text` and `paragraph` families
 * separately. The only token property that varies by weight.
 */
export const tracking = typographyTokens.tracking

// ---------- SIZING ----------

/**
 * Every integer 1–128 plus every half step 0.5–19.5, at the canonical 0.25rem
 * step. Stock Tailwind's numeric scale has gaps above 12 (13, 15, 17… are
 * undefined), so `h-17` silently compiles to nothing. Values on the keys
 * Tailwind already defines match its own formula, so filling them is a no-op;
 * the win is the in-between steps.
 *
 * This is the ONE place sizing is declared. Tailwind reads `theme('spacing')`
 * for width, height, size, min/max of both, which is why nothing else
 * declares a sizing block.
 */
export const spacing = Object.fromEntries(
  [
    ...Array.from({ length: 20 }, (_, i) => i + 0.5),
    ...Array.from({ length: 128 }, (_, i) => i + 1),
  ]
    .sort((a, b) => a - b)
    .map((n) => [n, `${n * 0.25}rem`]),
)

/** Breakpoint minimums. Not in the Figma export — decided in code. */
export const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

// ---------- CSS VARIABLES ----------

function mergeLayers(...layers) {
  const out = { light: {}, dark: {} }
  for (const layer of layers) {
    for (const [theme, vars] of Object.entries(layer)) {
      out[theme] = { ...out[theme], ...vars }
    }
  }
  return out
}

function colorVariables() {
  const light = {}
  const dark = {}

  for (const [category, entries] of Object.entries(semanticColors.light)) {
    for (const [name, value] of Object.entries(entries)) {
      light[`--${category}-${name}`] = value
    }
  }
  for (const [category, entries] of Object.entries(semanticColors.dark)) {
    for (const [name, value] of Object.entries(entries)) {
      dark[`--${category}-${name}`] = value
    }
  }
  // Every ramp step is also addressable directly, so a component can reach a
  // primitive the semantic vocabulary doesn't name.
  for (const [family, shades] of Object.entries(colors.light)) {
    for (const [shade, value] of Object.entries(shades)) {
      light[`--${family}-${shade}`] = value
    }
  }
  for (const [family, shades] of Object.entries(colors.dark)) {
    for (const [shade, value] of Object.entries(shades)) {
      dark[`--dark-${family}-${shade}`] = value
    }
  }

  return { light, dark }
}

function effectVariables() {
  const light = {}
  const dark = {}

  // Off `effectsData`, not off `shadows`: `shadows` carries `none` and
  // `DEFAULT`, which are Tailwind key names with no variable of their own.
  for (const [step, value] of Object.entries(effectsData.elevation.light)) {
    light[`--elevation-${step}`] = value
  }
  for (const [name, value] of Object.entries(effectsData.elevation.custom)) {
    light[`--elevation-${name}`] = value
  }
  for (const [name, value] of Object.entries(focusRing.light)) {
    light[`--focus-outline-${name}`] = value
  }
  for (const [name, value] of Object.entries(focusRing.dark)) {
    dark[`--focus-outline-${name}`] = value
  }

  return { light, dark }
}

function radiusVariables() {
  const vars = {}
  for (const [key, value] of Object.entries(radius)) {
    vars[`--radius-${key}`] = value
  }
  return { light: vars }
}

/**
 * Every token as a CSS custom property, keyed by theme:
 *
 *   cssVariables.light['--surface-base']
 *   cssVariables.dark['--surface-base']
 *
 * `light` goes on `:root`, `dark` on `[data-theme="dark"]`. Neither is a
 * subset of the other. `dark` re-values the semantic and focus properties
 * that `light` already declares, and adds the dark ramps under their own
 * `--dark-*` names. Those are the only keys it has that `light` lacks.
 * `light` additionally carries the light ramps (`--gray-500`), elevation and
 * radius. None of those three flip by theme, so a property `dark` leaves out
 * keeps its `:root` value.
 *
 * `plugin.js` emits both into the base layer, which is how a frappe-ui page
 * gets them. Read this map directly when you need a token's value somewhere
 * that does not load frappe-ui's stylesheet, such as exported markup or a
 * canvas renderer.
 */
export const cssVariables = mergeLayers(
  colorVariables(),
  effectVariables(),
  radiusVariables(),
)

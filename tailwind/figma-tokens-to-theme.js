/**
 * Generator: reads the W3C Design Tokens Community Group JSON exported from
 * Figma (espresso-v2-design-tokens/) and emits theme JSON files that the
 * tailwind plugin can consume.
 *
 *   Inputs:  espresso-v2-design-tokens/*.tokens.json
 *   Outputs: tailwind/generated/{colors,radius,typography}.json
 *
 * Run with: yarn sync-tokens
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const TOKENS_DIR = path.join(REPO_ROOT, 'espresso-v2-design-tokens')
const OUT_DIR = path.join(__dirname, 'generated')

// Color families mirrored from Figma's "🔵 Colour primitives" collection.
// Each appears under `light.<family>` and `dark.<family>` plus their alpha pair.
const COLOR_FAMILIES = [
  'gray',
  'blue',
  'green',
  'red',
  'orange',
  'amber',
  'yellow',
  'teal',
  'cyan',
  'purple',
  'pink',
  'violet',
]
// 'red-alpha' was listed here historically but Figma's primitives export has
// never contained a `light.red-alpha` / `dark.red-alpha` family — the guard
// below silently skips it, so it never emitted a token. Not listed, so the
// dead branch isn't there to skip going forward (#940).
const ALPHA_FAMILIES = ['gray-alpha']
const SEMANTIC_CATEGORIES = ['surface', 'surface-alpha', 'ink', 'outline', 'outline-alpha']

// Named aliases layered on top of Figma's numeric radius keys.
// Matched by px value, so the alias stays correct if Figma shifts.
// Only `none` survives — the deprecated size aliases (`sm`, `DEFAULT`, `md`,
// `lg`, `xl`, `2xl`) were removed in 1.0.0 per ADR-0006 (#998). Migrate old
// code with tailwind/migrate-tokens-v2.js.
const RADIUS_NAME_BY_PX = {
  '0px': 'none',
}
// Preserved from current plugin.js — Figma doesn't model `full`.
const RADIUS_EXTRA = { full: '9999px' }

// Real Figma variable-font weights. Only Regular is customized (420); the rest
// are standard. NOTE: do NOT source these from the `text.styles` export — its
// fontWeight column is corrupt (Regular exports as 100/400 because the body
// styles use Inter's "Thin" named instance with a wght-axis override to 420
// that the exporter discards; Black exports as 700 instead of 800).
const FONT_WEIGHT_MAP = {
  regular: 420,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}

// ---------- HEX → OKLCH ----------

// Figma exports every color as hex (8-digit when it carries alpha), but
// colors.json ships oklch (fa18b8ade). Convert at generation time so a
// routine `yarn sync-tokens` can't revert the palette to hex (#986).
// Math from Björn Ottosson's OKLab reference implementation.

const fmt = (n) => String(Math.round(n * 1000) / 1000)

export function hexToOklch(hex) {
  const value = hex.slice(1)
  if (value.length !== 6 && value.length !== 8) {
    throw new Error(`hexToOklch expects #rrggbb or #rrggbbaa, got "${hex}"`)
  }
  const int = (i) => parseInt(value.slice(i, i + 2), 16)
  const [r, g, b] = [int(0), int(2), int(4)]
  const alpha = value.length === 8 ? int(6) / 255 : 1

  const lin = (c) => {
    const v = c / 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  const [lr, lg, lb] = [lin(r), lin(g), lin(b)]

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const C = Math.sqrt(A * A + B * B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  // Achromatic: a hue on a zero-chroma color is noise.
  if (Math.round(C * 1000) === 0) H = 0

  const lch = `${fmt(L)} ${fmt(C)} ${fmt(H)}`
  return alpha < 1 ? `oklch(${lch} / ${fmt(alpha)})` : `oklch(${lch})`
}

// Literal color values pass through here; alias references don't.
export function toOklch(value) {
  return typeof value === 'string' && value.startsWith('#') ? hexToOklch(value) : value
}

function readTokens(filename) {
  return JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, filename), 'utf8'))
}

function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

function writeJSON(filename, data) {
  const filepath = path.join(OUT_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n')
  console.log(`  wrote ${path.relative(REPO_ROOT, filepath)}`)
}

// ---------- COLORS ----------

// Build colors.json in the shape colorPalette.js already consumes:
//   { lightMode, darkMode, overlay, neutral, themedVariables: { light, dark } }
function buildColors() {
  const primitives = readTokens('Colour primitives.Light.tokens.json')
  const stylesLight = readTokens('Styles.Light.tokens.json')
  const stylesDark = readTokens('Styles.Dark.tokens.json')

  const colors = {
    lightMode: {},
    darkMode: {},
    overlay: { white: {}, black: {} },
    neutral: {
      white: toOklch(primitives.neutral.white.$value),
      black: toOklch(primitives.neutral.black.$value),
      ...(primitives.neutral.transparent
        ? { transparent: toOklch(primitives.neutral.transparent.$value) }
        : {}),
    },
    themedVariables: {
      light: Object.fromEntries(SEMANTIC_CATEGORIES.map((category) => [category, {}])),
      dark: Object.fromEntries(SEMANTIC_CATEGORIES.map((category) => [category, {}])),
    },
  }

  // Primitive ramps — light.<family>.<shade>
  for (const family of [...COLOR_FAMILIES, ...ALPHA_FAMILIES]) {
    if (primitives.light?.[family]) {
      colors.lightMode[family] = mapShades(primitives.light[family])
    }
    if (primitives.dark?.[family]) {
      colors.darkMode[family] = mapShades(primitives.dark[family])
    }
  }

  // Overlay ramps — white-alpha / black-alpha at top level of primitives.
  if (primitives['white-alpha']) {
    colors.overlay.white = mapShades(primitives['white-alpha'])
  }
  if (primitives['black-alpha']) {
    colors.overlay.black = mapShades(primitives['black-alpha'])
  }

  // Semantic aliases — Styles.Light/Dark → themedVariables.{light,dark}
  for (const category of SEMANTIC_CATEGORIES) {
    collectSemanticCategory(stylesLight, category, colors.themedVariables.light)
    collectSemanticCategory(stylesDark, category, colors.themedVariables.dark)
  }

  return colors
}

// No legacy aliases: retired names (surface-white, surface-modal,
// outline-gray-modals, …) are intentionally NOT emitted so straggler usage
// fails visibly instead of silently keeping old styles alive. Migrate old
// code with tailwind/migrate-tokens-v2.js.

function mapShades(family) {
  const out = {}
  for (const [shade, token] of Object.entries(family)) {
    if (token && token.$value) {
      out[shade] = toOklch(token.$value)
    }
  }
  return out
}

// Semantic names present in Figma's Styles export with zero call sites
// anywhere (#940 rule-5 census: frappe-ui's own source/docs/stories, all 9
// consumer apps, and frappe's ui/ package):
//   - `alert-button-{default,info,success,warning,error}` (surface + ink):
//     Alert's actual buttons color via the shared variant+theme axes (P4),
//     not a per-alert-type token — this Figma spec never got wired to code.
//   - `gray-2-overlay` (surface-alpha): resolves to the black/white overlay
//     ramp rather than the gray-alpha ramp its name implies, breaking the
//     `{family}-{step}` pattern every other surface-alpha entry follows, and
//     nothing ever reached for it under either reading.
const DROPPED_SEMANTIC_NAMES = {
  surface: [
    'alert-button-default',
    'alert-button-info',
    'alert-button-success',
    'alert-button-warning',
    'alert-button-error',
  ],
  'surface-alpha': ['gray-2-overlay'],
  ink: [
    'alert-button-default',
    'alert-button-info',
    'alert-button-success',
    'alert-button-warning',
    'alert-button-error',
  ],
}

function collectSemanticCategory(styles, category, target) {
  const section = styles[category]
  if (!section) return
  target[category] = target[category] || {}
  const dropped = DROPPED_SEMANTIC_NAMES[category] || []
  for (const [name, token] of Object.entries(section)) {
    if (!token?.$value) continue
    if (dropped.includes(name)) continue
    // Resolve `{path.to.token}` aliases into the "lightMode/family/shade" format
    // that colorPalette.js#resolveColorReference understands.
    target[category][name] = aliasToReference(token.$value)
  }
}

// Convert a DTCG alias string like "{light.gray.50}" into the reference shape
// stored in colors.json today: "lightMode/gray/50". Non-aliases (literal hex)
// convert to oklch like every other resolved value.
function aliasToReference(value) {
  if (typeof value !== 'string') return value
  const match = value.match(/^\{(.+)\}$/)
  if (!match) return toOklch(value)
  const segments = match[1].split('.')

  // {neutral.white} | {neutral.black}
  if (segments[0] === 'neutral' && segments.length === 2) {
    return `neutral/${segments[1]}`
  }
  // {white-alpha.50} | {black-alpha.50}  →  overlay/white/50 | overlay/black/50
  if (segments[0] === 'white-alpha' || segments[0] === 'black-alpha') {
    const color = segments[0].split('-')[0]
    return `overlay/${color}/${segments[1]}`
  }
  // {light.gray.50}  →  lightMode/gray/50
  // {light.gray-alpha.50}  →  lightMode/gray-alpha/50
  if (segments[0] === 'light') {
    return `lightMode/${segments.slice(1, -1).join('-')}/${segments[segments.length - 1]}`
  }
  if (segments[0] === 'dark') {
    return `darkMode/${segments.slice(1, -1).join('-')}/${segments[segments.length - 1]}`
  }
  console.warn(`  ⚠ unresolved alias: ${value}`)
  return value
}

// ---------- RADIUS ----------

function buildRadius() {
  const tokens = readTokens('Tokens.Mode 1.tokens.json')
  const radius = { ...RADIUS_EXTRA }

  for (const [key, token] of Object.entries(tokens.radius || {})) {
    const px = token.$value
    radius[key] = px
    const name = RADIUS_NAME_BY_PX[px]
    if (name) radius[name] = px
  }
  return radius
}

// ---------- TYPOGRAPHY ----------

// We derive the type scale from the Figma *text styles* export
// (`text.styles.tokens.json`), not the *variable* export
// (`Typography.Desktop`). Text styles carry the exact per-size pairing of size +
// line-height + letter-spacing (+ `uppercase` on `tiny`); the variable export
// rounds line-heights to px and drops per-size letter-spacing. Weights still
// come from FONT_WEIGHT_MAP because the text-styles weight column is corrupt
// (see note there).

// Figma models line-height & letter-spacing as percentages of the font size.
// Tailwind wants a unitless ratio for line-height and `em` for letter-spacing.
const pctToRatio = (v) => String(round(parseFloat(v) / 100, 4)) // "115%" -> "1.15"
// letter-spacing % of font size === em. `paragraph/5xl` exports as "0.5px" by an
// exporter bug (should be "0.5%"); parseFloat keeps the number and we treat it
// as a percent regardless of unit, which yields the intended value either way.
const lsToEm = (v) => `${round(parseFloat(v) / 100, 5)}em` // "2%" -> "0.02em"

function round(n, places) {
  const f = 10 ** places
  return Math.round(n * f) / f
}

// Sizes present in the Figma text-styles export that ship no vocabulary:
// audited in #940 against frappe-ui's own source, docs, and stories, plus a
// fresh rule-5 census of every consumer app (crm, helpdesk, gameplan,
// insights, builder, suite, central, frappe_calendar, frappe-ui-starter,
// frappe's ui/ package) — zero call sites anywhere for either.
//   - `tiny`: also excluded from the docs type-scale page's own size lists
//     (TypographyPage.vue), so even frappe-ui's own showcase doesn't use it.
//   - `13xl`-`16xl`: the docs "display sizes" showcase itself stops at
//     `12xl` (see DISPLAY_KEYS in TypographyPage.vue) — these four sizes are
//     past what even the type-scale demo cares to show.
const DROPPED_SIZES = ['tiny', '13xl', '14xl', '15xl', '16xl']

function buildTypography() {
  const styles = readTokens('text.styles.tokens.json')
  const text = Object.fromEntries(
    Object.entries(styles.text || {}).filter(([key]) => !DROPPED_SIZES.includes(key)),
  )
  // Same filter as `text` above — paragraph has no dropped-size entries today
  // (it tops out at `4xl` and never had a `tiny`), but this keeps it that way
  // if Figma ever adds one (#940).
  const paragraphStyles = Object.fromEntries(
    Object.entries(styles.paragraph || {}).filter(([key]) => !DROPPED_SIZES.includes(key)),
  )

  const fontFamily = { text: text.base?.regular?.$value.fontFamily || 'Inter Variable' }

  const fontWeight = {
    regular: FONT_WEIGHT_MAP.regular,
    medium: FONT_WEIGHT_MAP.medium,
    semibold: FONT_WEIGHT_MAP.semibold,
    bold: FONT_WEIGHT_MAP.bold,
    black: FONT_WEIGHT_MAP.extrabold,
  }

  // Letter-spacing is the only property that varies by weight (line-height &
  // text-transform are constant per size). Capture it per (size, weight) so the
  // plugin can emit `text-<size>-<weight>` classes; values are honored as-is
  // from text.styles (the source of truth), oddities included.
  const WEIGHTS = ['regular', 'medium', 'semibold', 'bold', 'black']
  const trackingOf = (variants) =>
    Object.fromEntries(
      WEIGHTS.filter((w) => variants[w]).map((w) => [w, lsToEm(variants[w].$value.letterSpacing)]),
    )

  // Base size utilities (`text-<size>`), from each size's `regular` variant.
  const fontSize = {}
  const textTransform = {}
  const tracking = { text: {}, paragraph: {} }
  for (const [key, variants] of Object.entries(text)) {
    const v = variants.regular.$value
    fontSize[key] = [
      v.fontSize,
      {
        lineHeight: pctToRatio(v.lineHeight),
        letterSpacing: lsToEm(v.letterSpacing),
        fontWeight: String(FONT_WEIGHT_MAP.regular),
      },
    ]
    if (v.textTransform && v.textTransform !== 'none') textTransform[key] = v.textTransform
    tracking.text[key] = trackingOf(variants)
  }

  // Paragraph variants (`text-p-<size>`) — same sizes, reading line-height/track.
  const paragraph = {}
  for (const [key, variants] of Object.entries(paragraphStyles)) {
    const v = variants.regular.$value
    paragraph[key] = {
      lineHeight: pctToRatio(v.lineHeight),
      letterSpacing: lsToEm(v.letterSpacing),
    }
    tracking.paragraph[key] = trackingOf(variants)
  }

  return { fontFamily, fontWeight, fontSize, textTransform, paragraph, tracking }
}

// ---------- EFFECTS (shadows) ----------

// Figma exports shadow effects as DTCG `$type: shadow` tokens — an array of
// layers, each with offsetX/offsetY/blur/spread/color (+ optional inset).
// Emit pre-composed CSS box-shadow strings so the plugin can drop them into
// CSS variables verbatim.
// Custom elevation names present in Figma but with zero call sites anywhere
// (#940 rule-5 census: frappe-ui's own source/docs/stories, all 9 consumer
// apps, and frappe's ui/ package). `status` isn't even wired into the docs'
// own elevation showcase (ElevationPreview.vue renders only the six numbered
// steps) — it's named in prose once and never rendered.
const DROPPED_CUSTOM_ELEVATIONS = ['status']

function buildEffects() {
  const tokens = readTokens('effect.styles.tokens.json')
  const out = {
    elevation: { light: {}, dark: {}, custom: {} },
    focus: { light: {}, dark: {} },
  }

  for (const step of Object.keys(tokens.elevation?.light || {})) {
    out.elevation.light[step] = shadowToCss(tokens.elevation.light[step].$value)
  }
  for (const step of Object.keys(tokens.elevation?.dark || {})) {
    out.elevation.dark[step] = shadowToCss(tokens.elevation.dark[step].$value)
  }
  for (const [name, token] of Object.entries(tokens.elevation?.custom || {})) {
    if (DROPPED_CUSTOM_ELEVATIONS.includes(name)) continue
    out.elevation.custom[name] = shadowToCss(token.$value)
  }
  for (const [name, token] of Object.entries(tokens.focus?.light || {})) {
    out.focus.light[name] = shadowToCss(token.$value)
  }
  for (const [name, token] of Object.entries(tokens.focus?.dark || {})) {
    out.focus.dark[name] = shadowToCss(token.$value)
  }

  return out
}

// Figma paints its effect array back-to-front (index 0 = bottom of the stack),
// while CSS box-shadow paints front-to-back (first listed = on top). Reverse the
// layers so the composed CSS string matches Figma's visual stacking order.
function shadowToCss(layers) {
  return layers
    .slice()
    .reverse()
    .map((layer) => {
      const parts = [
        layer.inset ? 'inset' : null,
        layer.offsetX,
        layer.offsetY,
        layer.blur,
        layer.spread || '0px',
        layer.color,
      ].filter(Boolean)
      return parts.join(' ')
    })
    .join(', ')
}

// ---------- MAIN ----------

function main() {
  if (!fs.existsSync(TOKENS_DIR)) {
    console.error(`✗ tokens directory not found: ${TOKENS_DIR}`)
    process.exit(1)
  }

  console.log(`Reading tokens from ${path.relative(REPO_ROOT, TOKENS_DIR)}/`)
  ensureOutDir()

  writeJSON('colors.json', buildColors())
  writeJSON('radius.json', buildRadius())
  writeJSON('typography.json', buildTypography())
  writeJSON('effects.json', buildEffects())

  // colors.json is consumed from tailwind/ (top-level) by colorPalette.js, while
  // the generator emits to tailwind/generated/. Copy it up so `yarn sync-tokens`
  // is the single source of truth (no manual copy step).
  fs.copyFileSync(path.join(OUT_DIR, 'colors.json'), path.join(__dirname, 'colors.json'))

  console.log('✓ done')
}

const scriptPath = fileURLToPath(import.meta.url)
const invokedPath = process.argv[1]
const isCLI = invokedPath && fs.realpathSync(invokedPath) === fs.realpathSync(scriptPath)
if (isCLI) main()

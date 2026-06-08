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
const ALPHA_FAMILIES = ['gray-alpha', 'red-alpha']

// Named aliases layered on top of Figma's numeric radius keys.
// Each name is matched by px value, so the alias stays correct if Figma shifts.
const RADIUS_NAME_BY_PX = {
  '0px': 'none',
  '4px': 'sm',
  '8px': 'DEFAULT',
  '10px': 'md',
  '12px': 'lg',
  '16px': 'xl',
  '20px': '2xl',
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
      white: primitives.neutral.white.$value,
      black: primitives.neutral.black.$value,
      ...(primitives.neutral.transparent
        ? { transparent: primitives.neutral.transparent.$value }
        : {}),
    },
    themedVariables: {
      light: { surface: {}, ink: {}, outline: {} },
      dark: { surface: {}, ink: {}, outline: {} },
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
  collectSemanticCategory(stylesLight, 'surface', colors.themedVariables.light)
  collectSemanticCategory(stylesLight, 'ink', colors.themedVariables.light)
  collectSemanticCategory(stylesLight, 'outline', colors.themedVariables.light)
  collectSemanticCategory(stylesDark, 'surface', colors.themedVariables.dark)
  collectSemanticCategory(stylesDark, 'ink', colors.themedVariables.dark)
  collectSemanticCategory(stylesDark, 'outline', colors.themedVariables.dark)

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
      out[shade] = token.$value
    }
  }
  return out
}

function collectSemanticCategory(styles, category, target) {
  const section = styles[category]
  if (!section) return
  target[category] = target[category] || {}
  for (const [name, token] of Object.entries(section)) {
    if (!token?.$value) continue
    // Resolve `{path.to.token}` aliases into the "lightMode/family/shade" format
    // that colorPalette.js#resolveColorReference understands.
    target[category][name] = aliasToReference(token.$value)
  }
}

// Convert a DTCG alias string like "{light.gray.50}" into the reference shape
// stored in colors.json today: "lightMode/gray/50". Non-aliases (literal hex)
// pass through unchanged so the consumer can decide whether to treat them as
// resolved values.
function aliasToReference(value) {
  if (typeof value !== 'string') return value
  const match = value.match(/^\{(.+)\}$/)
  if (!match) return value
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

function buildTypography() {
  const styles = readTokens('text.styles.tokens.json')
  const text = styles.text || {}
  const paragraphStyles = styles.paragraph || {}

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

function shadowToCss(layers) {
  return layers
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

main()

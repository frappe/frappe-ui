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

// Figma's font weight strings → tailwind numeric weights.
const FONT_WEIGHT_MAP = {
  regular: 400,
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

function buildTypography() {
  const tokens = readTokens('Typography.Desktop.tokens.json')
  const sizes = tokens.font?.size || {}
  const lineHeights = tokens.font?.['line-height'] || {}
  const weights = tokens.font?.weight || {}
  const families = tokens.font?.family || {}

  const fontSize = {}
  for (const [key, token] of Object.entries(sizes)) {
    const lh = lineHeights[key]?.$value
    fontSize[key] = [
      token.$value,
      {
        lineHeight: lh || '1.15',
      },
    ]
  }

  const fontWeight = {}
  for (const [key, token] of Object.entries(weights)) {
    const numeric = FONT_WEIGHT_MAP[token.$value]
    fontWeight[key] = numeric ?? token.$value
  }

  const fontFamily = {}
  for (const [key, token] of Object.entries(families)) {
    fontFamily[key] = token.$value
  }

  return { fontFamily, fontSize, fontWeight }
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

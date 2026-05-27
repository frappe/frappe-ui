// Public token exports for external consumers (Tailwind v3 presets, CSS-in-JS,
// design-system tooling). Sourced from the Figma-synced `./generated/*` JSON;
// the plugin reads the same generated files directly so both stay in sync via
// `yarn sync-tokens`.
import radiusTokens from './generated/radius.json'
import typographyTokens from './generated/typography.json'

const borderRadius = radiusTokens

// Elevation tokens are flipped per theme by the plugin via CSS vars; the
// exported shape keeps static values so non-runtime consumers (snapshot tests,
// docs tooling) still get sensible defaults.
const boxShadow = {
  sm: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  DEFAULT:
    '0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)',
  lg: '0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)',
  xl: '0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)',
  '2xl':
    '0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)',
  none: 'none',
}

// letterSpacing / fontWeight aren't modelled on `font.size.*` in the Figma
// export — keep the historical values keyed by size name. Kept in sync with
// the matching map in plugin.js.
const FONT_SIZE_AUGMENT = {
  '2xs': { letterSpacing: '0.01em', fontWeight: '420' },
  xs: { letterSpacing: '0.02em', fontWeight: '420' },
  sm: { letterSpacing: '0.02em', fontWeight: '420' },
  base: { letterSpacing: '0.02em', fontWeight: '420' },
  lg: { letterSpacing: '0.02em', fontWeight: '400' },
  xl: { letterSpacing: '0.01em', fontWeight: '400' },
  '2xl': { letterSpacing: '0.01em', fontWeight: '400' },
  '3xl': { letterSpacing: '0.005em', fontWeight: '400' },
}

const PARAGRAPH_LINE_HEIGHT = {
  '2xs': '1.6',
  xs: '1.6',
  sm: '1.5',
  base: '1.5',
  lg: '1.5',
  xl: '1.42',
  '2xl': '1.38',
  '3xl': '1.2',
}

function buildFontSize() {
  const out = {}
  for (const [key, [size, meta]] of Object.entries(typographyTokens.fontSize)) {
    const lineHeight = meta.lineHeight === '0px' ? '1.15' : meta.lineHeight
    out[key] = [size, { lineHeight, ...(FONT_SIZE_AUGMENT[key] || {}) }]
  }
  for (const [key, lineHeight] of Object.entries(PARAGRAPH_LINE_HEIGHT)) {
    if (!out[key]) continue
    const [size, meta] = out[key]
    out[`p-${key}`] = [size, { ...meta, lineHeight }]
  }
  return out
}

const fontSize = buildFontSize()

export { borderRadius, boxShadow, fontSize }
export * from './colorPalette.js'

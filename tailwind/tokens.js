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

// lineHeight, letterSpacing and fontWeight are baked into each size tuple by
// the token sync (see figma-tokens-to-theme.js#buildTypography); mirror the
// plugin's `buildFontSize` so this public export stays in sync.
function buildFontSize() {
  const out = {}
  for (const [key, [size, meta]] of Object.entries(typographyTokens.fontSize)) {
    out[key] = [size, { ...meta }]
  }
  for (const [key, p] of Object.entries(typographyTokens.paragraph || {})) {
    if (!out[key]) continue
    const [size, meta] = out[key]
    out[`p-${key}`] = [size, { ...meta, lineHeight: p.lineHeight, letterSpacing: p.letterSpacing }]
  }
  return out
}

const fontSize = buildFontSize()

export { borderRadius, boxShadow, fontSize }
export * from './colorPalette.js'

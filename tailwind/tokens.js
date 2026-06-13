// Public token exports for external consumers (Tailwind v3 presets, CSS-in-JS,
// design-system tooling). Sourced from the Figma-synced `./generated/*` JSON;
// the plugin reads the same generated files directly so both stay in sync via
// `yarn sync-tokens`.
import radiusTokens from './generated/radius.json'
import typographyTokens from './generated/typography.json'
import effectsData from './generated/effects.json'

const borderRadius = radiusTokens

// Elevation tokens are flipped per theme by the plugin via CSS vars; the
// exported shape keeps static values so non-runtime consumers (snapshot tests,
// docs tooling) still get sensible defaults.
const boxShadow = {
  none: 'none',
  ...effectsData.elevation.light,
  DEFAULT: effectsData.elevation.light.base,
  ...effectsData.elevation.custom,
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
    out[`p-${key}`] = [
      size,
      { ...meta, lineHeight: p.lineHeight, letterSpacing: p.letterSpacing },
    ]
  }
  return out
}

const fontSize = buildFontSize()

export { borderRadius, boxShadow, fontSize }
export * from './colorPalette.js'

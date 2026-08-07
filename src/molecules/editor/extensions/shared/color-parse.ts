/**
 * Pure color-parsing helpers. No Vue, no DOM mutation, fully unit-testable.
 *
 * `getClosestNamedColor` is the single matcher used when normalizing pasted
 * inline colors back to a palette name. It honours `EXCLUDE_FROM_PASTE`
 * (e.g. `gray`) so that `set` and `paste` agree on which colors are dropped,
 * and rejects neutral (near-black / near-white) tones outright so legacy body
 * ink is not coerced into the nearest saturated hue.
 */

import {
  EXCLUDE_FROM_PASTE,
  legacyHighlightColorMap,
  legacyTextColorMap,
} from './color-palette'

export interface Rgb {
  r: number
  g: number
  b: number
}

/**
 * Parse a 6-digit hex string (with or without leading `#`) to RGB.
 * Returns `null` on anything that is not exactly 6 hex digits — including
 * 3-digit shorthand (`#abc`) which is intentionally rejected.
 */
export function parseHexToRgb(hex: string): Rgb | null {
  const clean = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

/** Clamp a number to the 0–255 byte range and round it. */
function toByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

/** Resolve a single rgb channel token: integer, or `NN%` percentage. */
function channelToByte(token: string): number | null {
  const t = token.trim()
  if (t.endsWith('%')) {
    const pct = parseFloat(t.slice(0, -1))
    if (Number.isNaN(pct)) return null
    return toByte((pct / 100) * 255)
  }
  const n = parseFloat(t)
  if (Number.isNaN(n)) return null
  return toByte(n)
}

/**
 * Parse an `rgb()` / `rgba()` color to RGB. Accepts comma-separated and
 * space-separated (CSS Color 4) syntaxes, integer or percentage channels, and
 * an optional alpha (ignored). Returns `null` on malformed input.
 */
export function parseRgbToRgb(rgb: string): Rgb | null {
  const match = /rgba?\(([^)]+)\)/i.exec(rgb.trim())
  if (!match) return null

  // Split off an explicit alpha after `/` (space syntax) before tokenizing.
  const body = match[1].split('/')[0]
  const parts = body
    .split(/[\s,]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  if (parts.length < 3) return null

  const r = channelToByte(parts[0])
  const g = channelToByte(parts[1])
  const b = channelToByte(parts[2])
  if (r === null || g === null || b === null) return null

  return { r, g, b }
}

/** Chroma of an RGB color: the spread between its strongest and weakest channel. */
function chroma(rgb: Rgb): number {
  return Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)
}

/**
 * Below this fraction of the matched anchor's chroma, the input is treated as a
 * neutral (ink/paper) tone rather than a washed-out version of that anchor.
 *
 * Nearest-neighbour in RGB space always returns *something*, so without this
 * guard every near-black ink snaps to the closest saturated anchor — `#000000`,
 * `#111827` and the legacy `#1F272E` body ink all land on green, and `#ffffff`
 * lands on purple. A third of the anchor's chroma sits comfortably between real
 * pale shades (tailwind's 300-level tints keep ~half the anchor's chroma) and
 * neutral inks (which keep well under a fifth).
 */
const NEUTRAL_CHROMA_RATIO = 1 / 3

/**
 * Map an RGB color to the nearest palette name by Euclidean distance in RGB
 * space. Names in `EXCLUDE_FROM_PASTE` are never returned (so pasted gray text
 * is dropped to the default ink color), and neutral tones are rejected outright
 * (see `NEUTRAL_CHROMA_RATIO`). Returns `null` when `colorMap` yields no
 * candidate, the closest match is excluded, or the input is neutral.
 *
 * @param rgb       The parsed color to classify.
 * @param colorMap  name → 6-digit hex anchor map (text or highlight).
 * @param allowed   Optional allowlist of names eligible to match. When omitted,
 *                  every key of `colorMap` is eligible.
 */
export function getClosestNamedColor(
  rgb: Rgb,
  colorMap: Record<string, string>,
  allowed?: readonly string[],
): string | null {
  let closest: string | null = null
  let closestAnchor: Rgb | null = null
  let minDistance = Infinity

  const candidates = allowed ?? Object.keys(colorMap)
  for (const name of candidates) {
    const anchorHex = colorMap[name]
    if (!anchorHex) continue
    const anchor = parseHexToRgb(anchorHex)
    if (!anchor) continue

    const distance = Math.sqrt(
      (rgb.r - anchor.r) ** 2 +
        (rgb.g - anchor.g) ** 2 +
        (rgb.b - anchor.b) ** 2,
    )
    if (distance < minDistance) {
      minDistance = distance
      closest = name
      closestAnchor = anchor
    }
  }

  if (closest === null || closestAnchor === null) return null
  if (EXCLUDE_FROM_PASTE.includes(closest)) return null
  if (chroma(rgb) < chroma(closestAnchor) * NEUTRAL_CHROMA_RATIO) return null
  return closest
}

/**
 * Outcome of a legacy exact-hex lookup. `excluded` is distinct from `unknown`
 * on purpose: a hex that is a *known* legacy value for an excluded name (e.g.
 * the legacy body ink `#1F272E` → `gray`) has been fully resolved and must stop
 * the lookup, not fall through to distance matching.
 */
export type LegacyHexMatch =
  | { status: 'matched'; name: string }
  | { status: 'excluded' }
  | { status: 'unknown' }

/**
 * Fast exact-hex → name lookup for historical content that stored raw hex
 * values. Matching is case-insensitive, since legacy HTML normalizes hex casing
 * inconsistently.
 *
 * @param variant `'text'` or `'highlight'` selects the legacy map.
 */
export function matchLegacyHex(
  hex: string,
  variant: 'text' | 'highlight',
): LegacyHexMatch {
  const map = variant === 'text' ? legacyTextColorMap : legacyHighlightColorMap
  const needle = hex.trim().toLowerCase()
  const key = Object.keys(map).find((k) => k.toLowerCase() === needle)
  if (!key) return { status: 'unknown' }
  const name = map[key]
  if (EXCLUDE_FROM_PASTE.includes(name)) return { status: 'excluded' }
  return { status: 'matched', name }
}

/**
 * Pure color-parsing helpers. No Vue, no DOM mutation, fully unit-testable.
 *
 * `getClosestNamedColor` is the single matcher used when normalizing pasted
 * inline colors back to a palette name. It honours `EXCLUDE_FROM_PASTE`
 * (e.g. `gray`) so that `set` and `paste` agree on which colors are dropped.
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

/**
 * Map an RGB color to the nearest palette name by Euclidean distance in RGB
 * space. Names in `EXCLUDE_FROM_PASTE` are never returned (so pasted gray text
 * is dropped to the default ink color). Returns `null` when `colorMap` yields
 * no candidate or the closest match is excluded.
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
    }
  }

  if (closest !== null && EXCLUDE_FROM_PASTE.includes(closest)) {
    return null
  }
  return closest
}

/**
 * Fast exact-hex → name lookup for historical content that stored raw hex
 * values. Returns `null` when the hex is not a known legacy value.
 *
 * @param variant `'text'` or `'highlight'` selects the legacy map.
 */
export function matchLegacyHex(
  hex: string,
  variant: 'text' | 'highlight',
): string | null {
  const map = variant === 'text' ? legacyTextColorMap : legacyHighlightColorMap
  const direct = map[hex]
  if (direct) return EXCLUDE_FROM_PASTE.includes(direct) ? null : direct
  return null
}

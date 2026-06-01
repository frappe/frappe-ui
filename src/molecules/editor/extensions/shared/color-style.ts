/**
 * CSS-style extraction + CSS-var style builders for named colors.
 *
 * Extractors read a raw inline `style` string (from pasted/legacy HTML) and
 * normalize it to a palette name via `color-parse`. Builders produce the
 * canonical `var(--prose-*)` declarations the extensions render. Both ends
 * agree on `EXCLUDE_FROM_PASTE` so a color that is dropped on paste is also
 * never produced by the picker.
 */

import {
  highlightColorHexMap,
  textColorHexMap,
} from './color-palette'
import {
  getClosestNamedColor,
  matchLegacyHex,
  parseHexToRgb,
  parseRgbToRgb,
} from './color-parse'

type ColorVariant = 'text' | 'highlight'

const CSS_PROPERTY: Record<ColorVariant, string> = {
  text: 'color',
  highlight: 'background-color',
}

const HEX_MAP: Record<ColorVariant, Record<string, string>> = {
  text: textColorHexMap,
  highlight: highlightColorHexMap,
}

/** Pull the raw value of a CSS property out of an inline `style` string. */
function extractPropertyValue(style: string, property: string): string | null {
  // Match `property: <value>` up to the next `;` or end of string.
  const re = new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, 'i')
  const match = re.exec(style)
  return match ? match[1].trim() : null
}

/**
 * Resolve a raw CSS color value (hex / rgb / `var(--prose-*-NAME)`) plus an
 * optional palette name from a CSS-var reference, into a palette name.
 *
 * @param allowed Optional allowlist constraining which names may be returned.
 */
function resolveColorValue(
  rawValue: string,
  variant: ColorVariant,
  allowed?: readonly string[],
): string | null {
  // 1. Direct CSS-var reference already produced by this editor.
  const varName = variant === 'text' ? 'prose-color' : 'prose-highlight'
  const varMatch = new RegExp(`var\\(--${varName}-([a-z0-9]+)\\)`, 'i').exec(
    rawValue,
  )
  if (varMatch) {
    const name = varMatch[1].toLowerCase()
    if (!allowed || allowed.includes(name)) return name
    return null
  }

  // 2. Exact legacy hex match (fast path).
  const hexLiteral = /#[0-9a-f]{3,8}/i.exec(rawValue)?.[0]
  if (hexLiteral) {
    const legacy = matchLegacyHex(hexLiteral, variant)
    if (legacy && (!allowed || allowed.includes(legacy))) return legacy
  }

  // 3. Distance match against the palette anchors.
  const rgb = hexLiteral
    ? parseHexToRgb(hexLiteral)
    : parseRgbToRgb(rawValue)
  if (!rgb) return null

  const closest = getClosestNamedColor(rgb, HEX_MAP[variant], allowed)
  return closest
}

/**
 * Extract a named color of the given variant from an inline `style` string.
 * Returns `null` when no color is present or it normalizes to an excluded name.
 */
export function extractColorFromStyle(
  style: string,
  variant: ColorVariant,
  allowed?: readonly string[],
): string | null {
  const rawValue = extractPropertyValue(style, CSS_PROPERTY[variant])
  if (!rawValue) return null
  return resolveColorValue(rawValue, variant, allowed)
}

/** Extract a named TEXT color from an inline `style` string. */
export function extractTextColorFromStyle(
  style: string,
  allowed?: readonly string[],
): string | null {
  return extractColorFromStyle(style, 'text', allowed)
}

/** Extract a named HIGHLIGHT color from an inline `style` string. */
export function extractHighlightColorFromStyle(
  style: string,
  allowed?: readonly string[],
): string | null {
  return extractColorFromStyle(style, 'highlight', allowed)
}

/** Build the inline style for a named TEXT color: `color: var(--prose-color-NAME)`. */
export function textColorStyle(name: string): string {
  return `color: var(--prose-color-${name})`
}

/** Build the inline style for a named HIGHLIGHT color. */
export function highlightColorStyle(name: string): string {
  return `background-color: var(--prose-highlight-${name})`
}

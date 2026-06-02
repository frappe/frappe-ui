/**
 * Derives the presentational swatch lists for the font-color picker from the
 * canonical palette. Each swatch carries the explicit lowercase color VALUE
 * (the name stored on the mark) plus a capitalized display label and the
 * Tailwind classes used to paint the swatch button.
 *
 * The color value is taken directly from `PaletteColor.name` — NOT derived by
 * lowercasing a label — so the value passed to `setColorByName` /
 * `toggleHighlightByName` always matches a palette entry exactly.
 */

import {
  PALETTE_COLORS,
  type PaletteColor,
} from '#molecules/editor/extensions/shared/color-palette'

export interface ColorSwatch {
  /** Lowercase palette value stored on the mark, e.g. `'blue'`. `null` = Default. */
  value: string | null
  /** Capitalized display label, e.g. `'Blue'` / `'Default'`. */
  label: string
  /** Tailwind class string painting the swatch button. */
  class: string
}

const TEXT_CLASS: Record<string, string> = {
  red: 'text-red-600 dark:text-dark-red-400',
  orange: 'text-orange-600 dark:text-dark-orange-400',
  yellow: 'text-yellow-600 dark:text-dark-yellow-400',
  green: 'text-green-600 dark:text-dark-green-400',
  teal: 'text-teal-600 dark:text-dark-teal-400',
  cyan: 'text-cyan-600 dark:text-dark-cyan-400',
  blue: 'text-blue-600 dark:text-dark-blue-400',
  // indigo has no design token — alias the violet hue used by its CSS var.
  indigo: 'text-violet-600 dark:text-dark-violet-400',
  purple: 'text-purple-600 dark:text-dark-purple-400',
  pink: 'text-pink-600 dark:text-dark-pink-400',
  gray: 'text-gray-600 dark:text-dark-gray-400',
}

const HIGHLIGHT_CLASS: Record<string, string> = {
  red: 'bg-red-100 dark:bg-dark-red-800 border-transparent',
  orange: 'bg-orange-100 dark:bg-dark-orange-800 border-transparent',
  yellow: 'bg-yellow-100 dark:bg-dark-yellow-800 border-transparent',
  green: 'bg-green-100 dark:bg-dark-green-800 border-transparent',
  teal: 'bg-teal-100 dark:bg-dark-teal-800 border-transparent',
  cyan: 'bg-cyan-100 dark:bg-dark-cyan-800 border-transparent',
  blue: 'bg-blue-100 dark:bg-dark-blue-800 border-transparent',
  indigo: 'bg-violet-100 dark:bg-dark-violet-800 border-transparent',
  purple: 'bg-purple-100 dark:bg-dark-purple-800 border-transparent',
  pink: 'bg-pink-100 dark:bg-dark-pink-800 border-transparent',
  gray: 'bg-gray-100 dark:bg-dark-gray-800 border-transparent',
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function toSwatch(
  color: PaletteColor,
  classMap: Record<string, string>,
): ColorSwatch {
  return {
    value: color.name,
    label: capitalize(color.name),
    class: classMap[color.name] ?? '',
  }
}

const DEFAULT_TEXT_SWATCH: ColorSwatch = {
  value: null,
  label: 'Default',
  class: 'text-ink-gray-9',
}

const DEFAULT_HIGHLIGHT_SWATCH: ColorSwatch = {
  value: null,
  label: 'Default',
  class: 'border-outline-gray-modals',
}

/** Text-color swatches, "Default" first, then the palette in canonical order. */
export const textSwatches: ColorSwatch[] = [
  DEFAULT_TEXT_SWATCH,
  ...PALETTE_COLORS.map((c) => toSwatch(c, TEXT_CLASS)),
]

/** Highlight-color swatches, "Default" first, then the palette. */
export const highlightSwatches: ColorSwatch[] = [
  DEFAULT_HIGHLIGHT_SWATCH,
  ...PALETTE_COLORS.map((c) => toSwatch(c, HIGHLIGHT_CLASS)),
]

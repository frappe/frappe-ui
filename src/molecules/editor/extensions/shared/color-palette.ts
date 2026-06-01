/**
 * Single source of truth for the editor's named-color palette.
 *
 * Every palette name MUST have a matching `--prose-color-NAME` (text) and
 * `--prose-highlight-NAME` (highlight) CSS custom property declared in
 * `color/color-styles.css` and `highlight/highlight-styles.css`. This invariant
 * is asserted by `color-palette.test.ts`.
 *
 * Hex maps are used only as RGB-distance anchors when normalizing pasted
 * inline colors back to a named color (see `color-parse.getClosestNamedColor`).
 * The rendered styles themselves use the CSS vars above, never these hexes.
 */

export interface PaletteColor {
  /** Lowercase palette key, e.g. `'blue'`. Also the value stored on the mark. */
  name: string
  /** CSS var reference used to render text color. */
  textVar: string
  /** CSS var reference used to render highlight (background) color. */
  highlightVar: string
}

/**
 * The ordered, canonical palette.
 *
 * NOTE on `indigo`: the design system has no `--indigo-*` token, so its
 * CSS vars alias the closest available hue (`--violet-*`). The hex anchors
 * below match that hue so paste-normalization stays self-consistent.
 *
 * NOTE on `black`: intentionally NOT a palette color. Text defaults to ink;
 * the "Default" action in the picker unsets the color rather than setting
 * black. `black` is therefore absent from `textColorHexMap` (see PLAN black
 * decision) and from this list.
 */
export const PALETTE_COLORS: readonly PaletteColor[] = [
  { name: 'red', textVar: 'var(--prose-color-red)', highlightVar: 'var(--prose-highlight-red)' },
  { name: 'orange', textVar: 'var(--prose-color-orange)', highlightVar: 'var(--prose-highlight-orange)' },
  { name: 'yellow', textVar: 'var(--prose-color-yellow)', highlightVar: 'var(--prose-highlight-yellow)' },
  { name: 'green', textVar: 'var(--prose-color-green)', highlightVar: 'var(--prose-highlight-green)' },
  { name: 'teal', textVar: 'var(--prose-color-teal)', highlightVar: 'var(--prose-highlight-teal)' },
  { name: 'cyan', textVar: 'var(--prose-color-cyan)', highlightVar: 'var(--prose-highlight-cyan)' },
  { name: 'blue', textVar: 'var(--prose-color-blue)', highlightVar: 'var(--prose-highlight-blue)' },
  { name: 'indigo', textVar: 'var(--prose-color-indigo)', highlightVar: 'var(--prose-highlight-indigo)' },
  { name: 'purple', textVar: 'var(--prose-color-purple)', highlightVar: 'var(--prose-highlight-purple)' },
  { name: 'pink', textVar: 'var(--prose-color-pink)', highlightVar: 'var(--prose-highlight-pink)' },
  { name: 'gray', textVar: 'var(--prose-color-gray)', highlightVar: 'var(--prose-highlight-gray)' },
] as const

/** Convenience: the palette names, in canonical order. */
export const PALETTE_NAMES: readonly string[] = PALETTE_COLORS.map((c) => c.name)

/**
 * Foreground/text color hex anchors (tailwind scale ~600). Used only for
 * RGB-distance matching when normalizing pasted colors. `black` deliberately
 * omitted (see black decision); `indigo` matches the violet hue it aliases.
 */
export const textColorHexMap: Record<string, string> = {
  red: '#dc2626',
  orange: '#ea580c',
  yellow: '#ca8a04',
  green: '#16a34a',
  teal: '#0d9488',
  cyan: '#06b6d4',
  blue: '#1579D0',
  indigo: '#5f46c7',
  purple: '#9333ea',
  pink: '#db2777',
  gray: '#6b7280',
}

/** Background/highlight color hex anchors (tailwind scale ~100). */
export const highlightColorHexMap: Record<string, string> = {
  red: '#fecaca',
  orange: '#fed7aa',
  yellow: '#fef08a',
  green: '#bbf7d0',
  teal: '#99f6e4',
  cyan: '#a5f3fc',
  blue: '#bfdbfe',
  indigo: '#dbd5ff',
  purple: '#e9d5ff',
  pink: '#fbcfe8',
  gray: '#e5e7eb',
}

/**
 * Names that normalize to `null` when encountered on paste — i.e. the
 * matcher refuses to pick them as the "closest" named color, so the pasted
 * inline color is dropped rather than coerced. `set` and `paste` must agree
 * on this exclusion (gray text is treated as the default ink color).
 */
export const EXCLUDE_FROM_PASTE: readonly string[] = ['gray'] as const

/**
 * Legacy exact-hex → name maps, kept for back-compat with historical content
 * that stored raw hex values. Consumed by `color-parse.getClosestNamedColor`
 * as a fast exact-match path before RGB-distance matching.
 */
export const legacyTextColorMap: Record<string, string> = {
  '#1F272E': 'gray',
  '#ca8a04': 'yellow',
  '#ea580c': 'orange',
  '#dc2626': 'red',
  '#16a34a': 'green',
  '#1579D0': 'blue',
  '#9333ea': 'purple',
  '#db2777': 'pink',
}

export const legacyHighlightColorMap: Record<string, string> = {
  '#fef9c3': 'yellow',
  '#ffedd5': 'orange',
  '#fee2e2': 'red',
  '#dcfce7': 'green',
  '#D3E9FC': 'blue',
  '#f3e8ff': 'purple',
  '#fce7f3': 'pink',
}

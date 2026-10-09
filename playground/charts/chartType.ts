// The espresso text scale as plain numbers, for the places that cannot take a
// class. echarts draws its own text on a canvas and wants `fontSize: 12`, not
// `text-xs`, so the sizes a chart's options name are written here against the
// token they belong to rather than left as bare numerals in the options.
//
// These are `tailwind/tokens/typography.js` read off at the sizes this page
// uses — the same numbers `text-2xs`, `text-xs`, `text-sm` and `text-base`
// carry. They are copied rather than imported because the token module is
// CommonJS and lives outside the app's build, and because the scale is the one
// thing on this page that does not move with a theme; a mismatch would show up
// the moment a label sat beside one set in CSS.
//
// The library does the same thing a step down, in `axisChartCommon.ts`, where
// `AXIS_LABEL_FONT_SIZE` and `DATA_LABEL_FONT_SIZE` are both 11 — `text-2xs`.
export const TYPE = {
  /** text-2xs — 11px */
  '2xs': 11,
  /** text-xs — 12px */
  xs: 12,
  /** text-sm — 13px */
  sm: 13,
  /** text-base — 14px */
  base: 14,
} as const

/** the weights the scale names: a bare `text-*` is 420, not 400 */
export const TYPE_WEIGHT = {
  regular: 420,
  medium: 500,
  semibold: 600,
} as const

/** `leading-tighter`, the 1.15 the scale offers single-line chrome */
export const LEADING_TIGHTER = 1.15

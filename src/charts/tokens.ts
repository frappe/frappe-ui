import { computed, ref, type ComputedRef, type Ref } from 'vue'
import {
  resolvedColorScheme,
  type ResolvedColorScheme,
} from '../composables/useColorScheme'
import type { ChartPalette, ChartPaletteName } from './types'

/**
 * Plot-area colors as concrete strings. echarts parses colors itself, so
 * `var(--ink-gray-5)` would reach the SVG as a literal attribute value with no
 * substitution; every token is read back as a computed value first.
 */
export type ChartTokens = {
  categorical: string[]
  sequential: string[]
  diverging: string[]
  axisLabel: string
  axisTitle: string
  axisLine: string
  splitLine: string
  dataLabel: string
  /** Ink for a label printed on a pale fill rather than beside it. */
  insideLabel: string
  /** What a heatmap draws between two cells, i.e. the surface behind the plot. */
  cellGap: string
}

/**
 * The scheme a chart picks its fallback colors by. The package-root
 * `resolvedColorScheme` is the one resolution of `data-theme`, the `dark` class
 * and the OS setting; a chart has no `'system'` state to hold, because it reads
 * what the document is painted in rather than what the user selected.
 */
export type { ResolvedColorScheme } from '../composables/useColorScheme'

export const CHART_CATEGORICAL_LENGTH = 10
export const CHART_SEQUENTIAL_LENGTH = 9
export const CHART_DIVERGING_LENGTH = 9

/**
 * Mirrors the `--chart-*` ramps from style.css. Duplicated as literals so a
 * chart still renders in the right colors when that stylesheet isn't imported
 * (and under SSR / jsdom, where there is no computed style to read).
 *
 * The dark categorical ramp is derived from the light one slot for slot, so a
 * series keeps its hue across a theme flip. See style.css for the derivation.
 */
// "Jewel": five hue families, each a dark member then its light partner.
const LIGHT_CATEGORICAL = [
  '#2283c3',
  '#84c5f9',
  '#289e60',
  '#84d4a1',
  '#753cbb',
  '#bb9df1',
  '#c98c28',
  '#f5ca8e',
  '#ba205a',
  '#f98da7',
]

const LIGHT_SEQUENTIAL = [
  '#095895',
  '#2283c3',
  '#4eacdf',
  '#71bde5',
  '#91ccec',
  '#9cd1ee',
  '#b8def2',
  '#dceef9',
  '#edf7fc',
]

// RdYlBu, softened: blue → pale warm yellow → red, with both ends turned down.
const LIGHT_DIVERGING = [
  '#366ea3',
  '#5b8ec1',
  '#81b0de',
  '#a9d2fb',
  '#fbf1c7',
  '#eec88c',
  '#e09e62',
  '#ce7249',
  '#b5473f',
]

// Same hue, lightness dropped 0.03, chroma held; see style.css.
const DARK_CATEGORICAL = [
  '#137ab9',
  '#7bbbef',
  '#189557',
  '#7aca98',
  '#6d32b1',
  '#b294e7',
  '#bf8319',
  '#ebc085',
  '#af0f52',
  '#ef849e',
]

const DARK_SEQUENTIAL = [
  '#074677',
  '#1b699c',
  '#3e8ab2',
  '#5a97b7',
  '#74a3bd',
  '#7da7be',
  '#93b2c2',
  '#b4c2cb',
  '#c1c9cd',
]

// Same hue, lightness dropped 0.04, chroma held; see style.css.
const DARK_DIVERGING = [
  '#2a6296',
  '#4f82b4',
  '#75a3d1',
  '#9cc5ee',
  '#eee4ba',
  '#e1bb80',
  '#d39256',
  '#c1663d',
  '#a73b34',
]

const FALLBACK_CATEGORICAL: Record<ResolvedColorScheme, string[]> = {
  light: LIGHT_CATEGORICAL,
  dark: DARK_CATEGORICAL,
}

const FALLBACK_SEQUENTIAL: Record<ResolvedColorScheme, string[]> = {
  light: LIGHT_SEQUENTIAL,
  dark: DARK_SEQUENTIAL,
}

const FALLBACK_DIVERGING: Record<ResolvedColorScheme, string[]> = {
  light: LIGHT_DIVERGING,
  dark: DARK_DIVERGING,
}

const TOKENS = {
  axisLabel: '--ink-gray-5',
  axisTitle: '--ink-gray-7',
  // Not the semantic outline tokens: those are picked for borders against the
  // page, and in dark `--outline-gray-1` resolves to the same value as an
  // elevated card surface, so a gridline drawn in it is invisible. The two
  // `--chart-*` vars name a hairline stop per mode instead. See style.css.
  axisLine: '--chart-axis-line',
  splitLine: '--chart-gridline',
  dataLabel: '--ink-gray-6',
  // Its own token rather than `--ink-gray-8`: the ink on a fill answers to the
  // fill, not to the page, and `--ink-gray-8` inverts to a light gray in dark
  // mode — invisible on the categorical ramp's light-tier stops. See style.css.
  insideLabel: '--chart-inside-label',
  cellGap: '--chart-cell-gap',
} as const

const FALLBACK_TOKENS: Record<
  ResolvedColorScheme,
  Record<keyof typeof TOKENS, string>
> = {
  light: {
    axisLabel: 'oklch(0.586 0 0)',
    axisTitle: 'oklch(0.341 0 0)',
    axisLine: 'oklch(0.913 0 0)',
    splitLine: 'oklch(0.946 0 0)',
    dataLabel: 'oklch(0.439 0 0)',
    insideLabel: 'oklch(0.271 0 0)',
    cellGap: '#ffffff',
  },
  dark: {
    axisLabel: 'oklch(0.58 0 0)',
    axisTitle: 'oklch(0.754 0 0)',
    axisLine: 'oklch(0.379 0 0)',
    splitLine: 'oklch(0.341 0 0)',
    dataLabel: 'oklch(0.683 0 0)',
    // Same near-black as light: see the note on `TOKENS.insideLabel`.
    insideLabel: 'oklch(0.271 0 0)',
    cellGap: '#242424',
  },
}

/**
 * Reads the color ramps and plot-area tokens as computed values. `el` scopes the
 * lookup so a subtree that redefines `--chart-*` wins over the document root.
 */
export function resolveChartTokens(el?: HTMLElement | null): ChartTokens {
  const scheme = resolvedColorScheme()
  const fallbacks = FALLBACK_TOKENS[scheme]

  if (typeof window === 'undefined' || typeof getComputedStyle !== 'function') {
    return {
      categorical: FALLBACK_CATEGORICAL[scheme],
      sequential: FALLBACK_SEQUENTIAL[scheme],
      diverging: FALLBACK_DIVERGING[scheme],
      ...fallbacks,
    }
  }

  const styles = getComputedStyle(el ?? document.documentElement)
  const read = (name: string) => styles.getPropertyValue(name).trim()

  const readRamp = (prefix: string, length: number) => {
    const ramp: string[] = []
    for (let i = 1; i <= length; i++) {
      const value = read(`${prefix}${i}`)
      if (value) ramp.push(value)
    }
    return ramp
  }

  const categorical = readRamp('--chart-categorical-', CHART_CATEGORICAL_LENGTH)
  const sequential = readRamp('--chart-sequential-', CHART_SEQUENTIAL_LENGTH)
  const diverging = readRamp('--chart-diverging-', CHART_DIVERGING_LENGTH)

  return {
    categorical: categorical.length ? categorical : FALLBACK_CATEGORICAL[scheme],
    sequential: sequential.length ? sequential : FALLBACK_SEQUENTIAL[scheme],
    diverging: diverging.length ? diverging : FALLBACK_DIVERGING[scheme],
    axisLabel: read(TOKENS.axisLabel) || fallbacks.axisLabel,
    axisTitle: read(TOKENS.axisTitle) || fallbacks.axisTitle,
    axisLine: read(TOKENS.axisLine) || fallbacks.axisLine,
    splitLine: read(TOKENS.splitLine) || fallbacks.splitLine,
    dataLabel: read(TOKENS.dataLabel) || fallbacks.dataLabel,
    insideLabel: read(TOKENS.insideLabel) || fallbacks.insideLabel,
    cellGap: read(TOKENS.cellGap) || fallbacks.cellGap,
  }
}

// One observer for the whole page: the theme flips on `<html>`, so a per-chart
// observer would watch the same node N times over.
const themeVersion = ref(0)
let observer: MutationObserver | undefined

function ensureThemeObserver() {
  if (observer || typeof MutationObserver === 'undefined') return
  observer = new MutationObserver(() => themeVersion.value++)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  })
}

export function pickSeriesColor(ramp: string[], index: number) {
  if (!ramp.length) return FALLBACK_CATEGORICAL.light[0]
  return ramp[index % ramp.length]
}

/** The two palest sequential stops vanish against a white card. */
const SEQUENTIAL_TAIL_TRIM = 2
/** A lone series reads best as one confident mid-blue, not the ramp's dark end. */
const SEQUENTIAL_SOLO_INDEX = 1
/**
 * Below this relative luminance a fill needs white text on top of it. It is the
 * crossover, not a taste call: white and the near-black inside-label ink
 * contrast equally against a fill at 0.22. Raising it hands white to the
 * palette's mid stops (luminance 0.41), which drop from 6.6:1 to 2.3:1.
 */
const DARK_FILL_LUMINANCE = 0.22

/**
 * `count` evenly spaced stops from a continuous ramp, so a stack reads as one
 * progression rather than n unrelated hues. Cycles instead once there are more
 * series than usable stops, where even spacing would hand out duplicates.
 */
function rampStops(ramp: string[], count: number, lastIndex: number): string[] {
  if (count > lastIndex + 1) {
    return Array.from({ length: count }, (_, i) => pickSeriesColor(ramp, i))
  }
  return Array.from(
    { length: count },
    (_, i) => ramp[Math.round((i * lastIndex) / (count - 1))],
  )
}

/** The sequential ramp without the stops that vanish against a card. */
function usableSequential(ramp: string[]) {
  return ramp.slice(0, Math.max(1, ramp.length - SEQUENTIAL_TAIL_TRIM))
}

/**
 * One color per series from a named ramp. Categorical is a set of unrelated
 * hues, so it is cycled in order; the continuous ramps are sampled instead,
 * dark to light — which for a stack runs bottom to top.
 */
export function paletteColors(
  name: ChartPaletteName,
  tokens: ChartTokens,
  count: number,
): string[] {
  if (count <= 0) return []

  const cycle = (ramp: string[]) =>
    Array.from({ length: count }, (_, i) => pickSeriesColor(ramp, i))

  if (name === 'categorical') return cycle(tokens.categorical)

  const ramp = name === 'diverging' ? tokens.diverging : tokens.sequential
  if (!ramp.length) return cycle(tokens.categorical)

  if (count === 1) {
    if (name === 'diverging') return [ramp[0]]
    return [ramp[Math.min(SEQUENTIAL_SOLO_INDEX, ramp.length - 1)]]
  }

  // A diverging ramp is read by its extremes, so it always spans end to end.
  const lastIndex =
    name === 'diverging' ? ramp.length - 1 : usableSequential(ramp).length - 1
  return rampStops(ramp, count, lastIndex)
}

/**
 * A named ramp as a ramp: every stop it holds, in the order it was authored.
 * What a plot that interpolates between the stops reads, where the sampled
 * `paletteColors` would hand it a set of slots instead.
 */
function namedRamp(name: ChartPaletteName, tokens: ChartTokens): string[] {
  if (name === 'categorical') return tokens.categorical
  const ramp =
    name === 'diverging' ? tokens.diverging : usableSequential(tokens.sequential)
  return ramp.length ? ramp : tokens.categorical
}

/**
 * How a chart spends the palette: one color per thing it draws, or `'ramp'` for
 * the stops themselves, which a plot with a continuous scale interpolates
 * between rather than handing out.
 */
export type ChartColorCount = number | 'ramp'

/**
 * Which end of a sequential ramp leads. It is authored deep to pale, which is
 * how a list of series reads — the first one is the heaviest. `'last'` flips it
 * for a plot whose color runs with the value instead: a funnel that darkens as
 * it narrows, a heatmap where the heavier number is the heavier color.
 *
 * Only the sequential ramp has a deep end to place. A categorical set has no
 * order to reverse, a diverging ramp's direction is its meaning, and a caller's
 * own colors are drawn in the order they were written.
 */
export type SequentialDeepEnd = 'first' | 'last'

export type ChartColorsOptions = {
  /** Ramp to read when the caller named none. Each chart family picks its own. */
  fallback: ChartPaletteName
  count: ChartColorCount
  deepEnd?: SequentialDeepEnd
}

/**
 * The colors a chart draws in, its `palette` and the tokens taken together.
 * Every chart resolves its palette through this one call, so the precedence —
 * the caller's own colors, then the ramp they named, then the family default —
 * is stated once and reads the same whatever is being painted.
 */
export function chartColors(
  palette: ChartPalette | undefined,
  tokens: ChartTokens,
  { fallback, count, deepEnd = 'first' }: ChartColorsOptions,
): string[] {
  // A caller's colors are a list, not a ramp: handed out in the order written,
  // and cycled once they run out.
  const explicit = Array.isArray(palette) ? palette : undefined
  if (explicit?.length) {
    if (count === 'ramp') return [...explicit]
    return Array.from({ length: count }, (_, i) => pickSeriesColor(explicit, i))
  }

  const name = typeof palette === 'string' ? palette : fallback
  const colors =
    count === 'ramp'
      ? namedRamp(name, tokens)
      : paletteColors(name, tokens, count)

  return name === 'sequential' && deepEnd === 'last'
    ? colors.slice().reverse()
    : colors
}

/**
 * White, or `fallback`, depending on how dark `background` is. Only hex parses —
 * every `--chart-*` stop is authored as hex — so a token in any other notation
 * keeps the fallback ink color.
 */
export function insideLabelColor(background: string, fallback: string) {
  const luminance = hexLuminance(background)
  if (luminance === null) return fallback
  return luminance < DARK_FILL_LUMINANCE ? '#ffffff' : fallback
}

function hexLuminance(color: string): number | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim())
  if (!match) return null

  const hex =
    match[1].length === 3
      ? match[1]
          .split('')
          .map((c) => c + c)
          .join('')
      : match[1]

  const channels = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const linear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  const [r, g, b] = channels.map(linear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Plot-area colors that re-resolve when the theme flips, so `setOption` runs
 * again with values from the new scheme. Config-level color overrides are not
 * folded in here — palette precedence lives in `resolveSeriesColors`, so there
 * is one place to read it.
 */
export function useChartTokens(el: Ref<HTMLElement | undefined>): {
  tokens: ComputedRef<ChartTokens>
} {
  ensureThemeObserver()

  const tokens = computed<ChartTokens>(() => {
    themeVersion.value
    return resolveChartTokens(el.value)
  })

  return { tokens }
}

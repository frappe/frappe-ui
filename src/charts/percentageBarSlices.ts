import { toNumber } from './axisChartCommon'
import { paletteColors, type ChartTokens } from './tokens'
import { OTHERS_KEY, OTHERS_LABEL } from './utils'
import type {
  ChartPaletteName,
  PercentageBarChartConfig,
  PercentageBarSlice,
} from './types'

// Bar, legend and tooltip all read the same `PercentageBarSlice[]`, so the three
// cannot disagree about what a slice is worth. No echarts: a single stacked
// bar is a row of divs, and a plot library would only take the rounded ends and
// the pixel-exact gaps away again.

export type PercentageBarSliceContext = {
  tokens: ChartTokens
  /** Slice names the legend has switched off. Dropped from the bar. */
  hiddenSlices?: string[]
}

export const DEFAULT_MAX_SLICES = 6
/** Below two there is nothing left to group into. */
const MIN_MAX_SLICES = 2

const PERCENTAGE_BAR_PALETTE: ChartPaletteName = 'categorical'

/**
 * Narrowest a slice is drawn, as a percentage of the track. A share under
 * this reads as a hairline or as nothing at all, and a part that is in the
 * legend but not in the bar reads as a bug — so the bar carries the floor and
 * `percent` keeps the true share. Convention 3: the caller is not asked to
 * round its own data up.
 */
export const MIN_SLICE_WIDTH = 1.5

/**
 * The slices of the bar, in drawing order. Hidden slices stay in the list —
 * the legend still needs them, and dropping them would shift every color after.
 */
export function buildPercentageBarSlices(
  config: PercentageBarChartConfig,
  { tokens, hiddenSlices = [] }: PercentageBarSliceContext,
): PercentageBarSlice[] {
  const grouped = groupRows(config)
  const colors = paletteColors(
    config.palette,
    tokens,
    grouped.length,
    PERCENTAGE_BAR_PALETTE,
  )

  const visibleTotal = grouped.reduce(
    (sum, slice) =>
      hiddenSlices.includes(slice.name) ? sum : sum + slice.value,
    0,
  )

  const percents = grouped.map((slice) =>
    hiddenSlices.includes(slice.name) || !visibleTotal
      ? 0
      : (slice.value / visibleTotal) * 100,
  )
  const widths = sliceWidths(percents)

  return grouped.map((slice, index) => ({
    ...slice,
    color: colors[index],
    hidden: hiddenSlices.includes(slice.name),
    percent: percents[index],
    width: widths[index],
  }))
}

/**
 * True shares, widened so the small ones stay visible. Anything under the floor
 * is lifted onto it and the difference is taken off the slices above it, in
 * proportion to how far above they sit — so the widest gives up the most and
 * the order of the bar never changes.
 *
 * Zeroes stay at zero: a hidden slice and a slice worth nothing are both
 * absent from the bar rather than drawn as a stub of the floor.
 */
export function sliceWidths(
  percents: number[],
  min: number = MIN_SLICE_WIDTH,
): number[] {
  const lifted = percents.map((percent) =>
    percent > 0 && percent < min ? min : percent,
  )

  const total = lifted.reduce((sum, percent) => sum + percent, 0)
  const debt = total - 100
  if (debt <= 0) return lifted

  // What the slices above the floor can give up between them, i.e. how far
  // they can fall before they are on the floor themselves.
  const slack = lifted.reduce(
    (sum, percent) => sum + Math.max(0, percent - min),
    0,
  )
  // The debt is larger than they can pay: there are more parts than the track
  // holds at a readable width, so no floor can be honoured. Taking the debt
  // anyway would drive the widest slice past zero and draw the bar
  // backwards. Every slice falls back to its true share instead — the floor
  // is what gets dropped, never the accuracy.
  if (debt >= slack) return percents

  return lifted.map((percent) => {
    const above = Math.max(0, percent - min)
    return percent - above * (debt / slack)
  })
}

type UnsizedSlice = Omit<
  PercentageBarSlice,
  'color' | 'hidden' | 'percent' | 'width'
>

function groupRows(config: PercentageBarChartConfig): UnsizedSlice[] {
  const rows = config.data ?? []

  const entries = rows
    .map((row) => ({ row, value: toNumber(row[config.valueColumn]) }))
    // A bar reads as parts of a whole, and a negative part has no width to
    // draw. Same rule as the ring.
    .filter(
      (entry): entry is { row: Record<string, any>; value: number } =>
        entry.value !== null && entry.value >= 0,
    )

  // Rows are *not* sorted. A breakdown is usually written in the order it is
  // read — spent then forecast then tax, free then used — and re-ordering it by
  // size would break a sequence the caller built on purpose. The tail that gets
  // grouped is still the smallest values, wherever they sit.
  const max = Math.max(MIN_MAX_SLICES, config.maxSlices ?? DEFAULT_MAX_SLICES)
  const keep = entries.length > max ? max - 1 : entries.length
  const kept = keptIndices(entries, keep)

  const seen = new Set<string>()
  const slices: UnsizedSlice[] = []
  const overflow: { row: Record<string, any>; value: number }[] = []

  entries.forEach((entry, index) => {
    if (!kept.has(index)) {
      overflow.push(entry)
      return
    }
    const label = categoryLabel(entry.row[config.categoryColumn])
    slices.push({
      name: uniqueName(label, seen),
      label,
      value: entry.value,
      rows: [entry.row],
      isOthers: false,
    })
  })

  if (!overflow.length) return slices

  return [
    ...slices,
    {
      name: OTHERS_KEY,
      label: OTHERS_LABEL,
      value: overflow.reduce((sum, entry) => sum + entry.value, 0),
      rows: overflow.map((entry) => entry.row),
      isOthers: true,
    },
  ]
}

/**
 * Which entries keep a slice of their own: the `keep` largest, and the
 * earliest written of them where values tie. Read off a sorted copy of the
 * positions, so the bar itself stays in row order.
 *
 * Positions rather than a cutoff value, because a cutoff cannot separate rows
 * that tie on it — every one of them clears it, and seven equal rows would
 * draw seven slices under a cap of six.
 */
function keptIndices(entries: { value: number }[], keep: number): Set<number> {
  if (keep >= entries.length) return new Set(entries.map((_, index) => index))

  const byValue = entries.map((entry, index) => ({ value: entry.value, index }))
  byValue.sort((a, b) => b.value - a.value || a.index - b.index)
  return new Set(byValue.slice(0, keep).map((entry) => entry.index))
}

function categoryLabel(value: any) {
  return value === null || value === undefined || value === ''
    ? '(Blank)'
    : String(value)
}

/**
 * Two rows can carry the same category. The label is what a reader sees, so it
 * repeats; the name is what the legend and the tooltip key by, so it cannot.
 */
function uniqueName(label: string, seen: Set<string>) {
  let name = label
  let suffix = 2
  while (seen.has(name)) name = `${label} (${suffix++})`
  seen.add(name)
  return name
}

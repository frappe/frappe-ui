import { toNumber } from './axisChartCommon'
import { paletteColors, type ChartTokens } from './tokens'
import { OTHERS_KEY, OTHERS_LABEL } from './utils'
import type {
  ChartPaletteName,
  ProportionBarConfig,
  ProportionSegment,
} from './types'

// Bar, legend and tooltip all read the same `ProportionSegment[]`, so the three
// cannot disagree about what a segment is worth. No echarts: a single stacked
// bar is a row of divs, and a plot library would only take the rounded ends and
// the pixel-exact gaps away again.

export type ProportionSegmentContext = {
  tokens: ChartTokens
  /** Segment names the legend has switched off. Dropped from the bar. */
  hiddenSegments?: string[]
}

export const DEFAULT_MAX_SEGMENTS = 6
/** Below two there is nothing left to group into. */
const MIN_MAX_SEGMENTS = 2

const PROPORTION_PALETTE: ChartPaletteName = 'categorical'

/**
 * Narrowest a segment is drawn, as a percentage of the track. A share under
 * this reads as a hairline or as nothing at all, and a part that is in the
 * legend but not in the bar reads as a bug — so the bar carries the floor and
 * `percent` keeps the true share. Convention 3: the caller is not asked to
 * round its own data up.
 */
export const MIN_SEGMENT_WIDTH = 1.5

/**
 * The segments of the bar, in drawing order. Hidden segments stay in the list —
 * the legend still needs them, and dropping them would shift every color after.
 */
export function buildProportionSegments(
  config: ProportionBarConfig,
  { tokens, hiddenSegments = [] }: ProportionSegmentContext,
): ProportionSegment[] {
  const grouped = groupRows(config)
  const colors = paletteColors(
    config.palette,
    tokens,
    grouped.length,
    PROPORTION_PALETTE,
  )

  const visibleTotal = grouped.reduce(
    (sum, segment) =>
      hiddenSegments.includes(segment.name) ? sum : sum + segment.value,
    0,
  )

  const percents = grouped.map((segment) =>
    hiddenSegments.includes(segment.name) || !visibleTotal
      ? 0
      : (segment.value / visibleTotal) * 100,
  )
  const widths = segmentWidths(percents)

  return grouped.map((segment, index) => ({
    ...segment,
    color: colors[index],
    hidden: hiddenSegments.includes(segment.name),
    percent: percents[index],
    width: widths[index],
  }))
}

/**
 * True shares, widened so the small ones stay visible. Anything under the floor
 * is lifted onto it and the difference is taken off the segments above it, in
 * proportion to how far above they sit — so the widest gives up the most and
 * the order of the bar never changes.
 *
 * Zeroes stay at zero: a hidden segment and a segment worth nothing are both
 * absent from the bar rather than drawn as a stub of the floor.
 */
export function segmentWidths(
  percents: number[],
  min: number = MIN_SEGMENT_WIDTH,
): number[] {
  const lifted = percents.map((percent) =>
    percent > 0 && percent < min ? min : percent,
  )

  const total = lifted.reduce((sum, percent) => sum + percent, 0)
  const debt = total - 100
  if (debt <= 0) return lifted

  const slack = lifted.reduce(
    (sum, percent) => sum + Math.max(0, percent - min),
    0,
  )
  // Every segment is already at the floor — there are more parts than the track
  // has room for at a readable width, so they share it evenly instead.
  if (slack <= 0) return lifted.map((percent) => (percent / total) * 100)

  return lifted.map((percent) => {
    const above = Math.max(0, percent - min)
    return percent - above * (debt / slack)
  })
}

type UnsizedSegment = Omit<
  ProportionSegment,
  'color' | 'hidden' | 'percent' | 'width'
>

function groupRows(config: ProportionBarConfig): UnsizedSegment[] {
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
  const max = Math.max(
    MIN_MAX_SEGMENTS,
    config.maxSegments ?? DEFAULT_MAX_SEGMENTS,
  )
  const keep = entries.length > max ? max - 1 : entries.length
  const cutoff = smallestKept(entries, keep)

  const seen = new Set<string>()
  const segments: UnsizedSegment[] = []
  const overflow: { row: Record<string, any>; value: number }[] = []

  for (const entry of entries) {
    if (cutoff !== null && entry.value < cutoff) {
      overflow.push(entry)
      continue
    }
    const label = categoryLabel(entry.row[config.categoryColumn])
    segments.push({
      name: uniqueName(label, seen),
      label,
      value: entry.value,
      rows: [entry.row],
      isOthers: false,
    })
  }

  if (!overflow.length) return segments

  return [
    ...segments,
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
 * The value a row has to reach to keep its own segment, or `null` when every
 * row keeps one. Read off a sorted copy so the bar itself stays in row order.
 */
function smallestKept(
  entries: { value: number }[],
  keep: number,
): number | null {
  if (keep >= entries.length) return null
  const descending = entries.map((entry) => entry.value).sort((a, b) => b - a)
  return descending[keep - 1] ?? null
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

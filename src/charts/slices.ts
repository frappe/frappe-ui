import { toNumber } from './axisChartCommon'
import { formatPercent } from './format'
import { paletteColors, type ChartTokens } from './tokens'
import { OTHERS_KEY, OTHERS_LABEL } from './utils'
import type {
  ChartLegendItem,
  ChartPaletteName,
  ChartTooltipItem,
  ChartValueFormatter,
  DonutChartConfig,
  DonutSlice,
  DonutSliceEvent,
} from './types'

// The ring and the bar cut the same rows into the same slices, so a breakdown
// keeps its names, its hidden slices and its pinned colors when it moves from
// one to the other. Plot, legend and tooltip all read the same `DonutSlice[]`,
// so they can't disagree about what a slice is worth.

export type SliceConfig = Pick<
  DonutChartConfig,
  'data' | 'categoryColumn' | 'valueColumn' | 'maxSlices' | 'palette' | 'colors'
>

export type SliceContext = {
  tokens: ChartTokens
  /** Slice names the legend has switched off. Dropped from the plot. */
  hiddenSlices?: string[]
}

export const DEFAULT_MAX_SLICES = 9
/** Below two there is nothing left to group into. */
const MIN_MAX_SLICES = 2

const SLICE_PALETTE: ChartPaletteName = 'categorical'

/**
 * The slices of a breakdown, in drawing order. Hidden slices stay in the list —
 * the legend still needs them, and dropping them would shift every color after.
 */
export function buildSlices(
  config: SliceConfig,
  { tokens, hiddenSlices = [] }: SliceContext,
): DonutSlice[] {
  const grouped = groupRows(config)
  const colors = paletteColors(
    config.palette,
    tokens,
    grouped.length,
    SLICE_PALETTE,
  )

  const visibleTotal = grouped.reduce(
    (sum, slice) =>
      hiddenSlices.includes(slice.name) ? sum : sum + slice.value,
    0,
  )

  return grouped.map((slice, index) => {
    const hidden = hiddenSlices.includes(slice.name)
    // Keyed by what the caller wrote, not by the unique name: `Others` is
    // keyed by `OTHERS_KEY`, and a repeated category shares its pin.
    const key = slice.isOthers ? OTHERS_KEY : slice.label
    return {
      ...slice,
      // A pinned slice still spends its palette slot, as a pinned series does,
      // so pinning one never recolors the others.
      color: config.colors?.[key] || colors[index],
      hidden,
      percent: hidden || !visibleTotal ? 0 : (slice.value / visibleTotal) * 100,
    }
  })
}

/** The slices with a mark on the plot: a zero slice has no arc and no block. */
export function drawnSlices(slices: DonutSlice[]): DonutSlice[] {
  return slices.filter((slice) => !slice.hidden && slice.value > 0)
}

export function sliceEvent(slice: DonutSlice): DonutSliceEvent {
  return {
    name: slice.name,
    label: slice.label,
    value: slice.value,
    percent: slice.percent,
    rows: slice.rows,
  }
}

export function sliceLegendItems(
  slices: DonutSlice[],
  format: ChartValueFormatter,
): ChartLegendItem[] {
  return slices.map((slice) => ({
    name: slice.name,
    label: slice.label,
    color: slice.color,
    hidden: slice.hidden,
    // A hidden slice has no share of the visible total, so it shows none.
    hint: slice.hidden ? undefined : formatPercent(slice.percent),
    weight: slice.value,
    formattedValue: format(slice.value),
  }))
}

export function sliceTooltipItem(
  slice: DonutSlice,
  format: ChartValueFormatter,
): ChartTooltipItem {
  return {
    name: slice.name,
    label: slice.label,
    color: slice.color,
    value: slice.value,
    formattedValue: format(slice.value),
    percent: slice.percent,
    kind: 'series',
  }
}

type UnsizedSlice = Omit<DonutSlice, 'color' | 'hidden' | 'percent'>

function groupRows(config: SliceConfig): UnsizedSlice[] {
  const rows = config.data ?? []

  const entries = rows
    .map((row) => ({ row, value: toNumber(row[config.valueColumn]) }))
    // A breakdown reads as parts of a whole, and a negative part has nothing
    // to draw.
    .filter(
      (entry): entry is { row: Record<string, any>; value: number } =>
        entry.value !== null && entry.value >= 0,
    )
    // Biggest first: the plot, the legend and the tail that gets grouped all
    // depend on this order.
    .sort((a, b) => b.value - a.value)

  const max = Math.max(MIN_MAX_SLICES, config.maxSlices ?? DEFAULT_MAX_SLICES)
  // One of the slots goes to "Others" itself.
  const keep = entries.length > max ? max - 1 : entries.length

  const seen = new Set<string>()
  const slices: UnsizedSlice[] = entries.slice(0, keep).map((entry) => {
    const label = categoryLabel(entry.row[config.categoryColumn])
    return {
      name: uniqueName(label, seen),
      label,
      value: entry.value,
      rows: [entry.row],
      isOthers: false,
    }
  })

  const overflow = entries.slice(keep)
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

function categoryLabel(value: any) {
  return value === null || value === undefined || value === ''
    ? '(Blank)'
    : String(value)
}

/**
 * Two rows can carry the same category value, and a slice is addressed by name
 * — so a repeat would highlight and hide both at once. The label keeps the raw
 * value; only the identity is made unique.
 */
function uniqueName(label: string, seen: Set<string>) {
  let name = label
  let suffix = 2
  while (seen.has(name)) name = `${label} (${suffix++})`
  seen.add(name)
  return name
}

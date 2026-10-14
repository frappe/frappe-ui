import type { ChartLegendItem } from './types'
import { OTHERS_KEY } from './utils'

/**
 * The entries largest first, which is the order the legend falls back to when
 * they do not fit on one row. Magnitude rather than signed value, the way
 * `maxSeries` weighs a series: one that runs large and negative carries the
 * chart as much as one that runs large. An entry with no value, and "Others",
 * keep their given place after the ranked ones — a remainder reads at the end.
 */
export function rankLegendItems(items: ChartLegendItem[]): ChartLegendItem[] {
  const weight = (item: ChartLegendItem) =>
    item.name === OTHERS_KEY || item.value === undefined
      ? -1
      : Math.abs(item.value)
  return [...items].sort((a, b) => weight(b) - weight(a))
}

/**
 * How many entries fit on the row, given each entry's width in ranked order.
 * All of them when they fit as they are; otherwise as many as fit beside the
 * "+N more" trigger, which takes `more` of the room.
 */
export function legendFit(
  widths: number[],
  room: number,
  more: number,
  gap: number,
): number {
  const all =
    widths.reduce((sum, width) => sum + width, 0) +
    gap * Math.max(0, widths.length - 1)
  if (all <= room) return widths.length

  let used = more
  let count = 0
  for (const width of widths) {
    if (used + gap + width > room) break
    used += gap + width
    count++
  }
  return count
}

import type { ChartLegendItem } from './types'
import { OTHERS_KEY } from './utils'

/**
 * The entries heaviest first, which is the order the legend falls back to when
 * they do not fit on one row. An entry with no weight, and "Others", keep their
 * given place after the ranked ones — a remainder reads at the end.
 */
export function rankLegendItems(items: ChartLegendItem[]): ChartLegendItem[] {
  const weight = (item: ChartLegendItem) =>
    item.name === OTHERS_KEY || item.weight === undefined ? -1 : item.weight
  return [...items].sort((a, b) => weight(b) - weight(a))
}

/**
 * How many entries fit on the row, given each entry's width in ranked order.
 * All of them when they fit as they are; otherwise as many as fit beside the
 * "+N more" trigger, whose width `more` gives for the count it hides.
 */
export function legendFit(
  widths: number[],
  room: number,
  more: (hidden: number) => number,
  gap: number,
): number {
  const all =
    widths.reduce((sum, width) => sum + width, 0) +
    gap * Math.max(0, widths.length - 1)
  if (all <= room) return widths.length

  // Every candidate is tried rather than stopping at the first miss: one more
  // entry can shorten the trigger by a digit and fit where one fewer did not.
  let fit = 0
  let used = 0
  for (let count = 0; count < widths.length && used <= room; count++) {
    if (used + more(widths.length - count) <= room) fit = count
    used += widths[count] + gap
  }
  return fit
}

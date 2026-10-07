import type { ECharts } from 'echarts/core'

/** The grid edge the data labels run towards: past the tip of a column or a row. */
export type DataLabelSide = 'top' | 'right' | 'left'

/** echarts' own default distance between a label and its mark. */
const DEFAULT_LABEL_DISTANCE = 5

/**
 * The axis end one tick past the current one, or `null` when echarts has drawn
 * fewer than two ticks to read a step from. Read off the ticks rather than the
 * scale's extent, because the ticks are what the reader sees and what a label
 * has to clear.
 */
export function nextAxisMax(chart: ECharts, axis: 'xAxis' | 'yAxis') {
  const ticks = (chart as any)
    .getModel()
    .getComponent(axis, 0)
    ?.axis?.scale?.getTicks?.()
  if (!ticks || ticks.length < 2) return null
  const last = ticks[ticks.length - 1].value
  return last + (last - ticks[ticks.length - 2].value)
}

/**
 * How far the furthest data label reaches past `bound`: positive when it
 * overflows, negative when there is room to spare, `null` when nothing is
 * labelled past the end of a mark.
 *
 * echarts contains axis labels in the grid's outer bounds but not data labels,
 * and how far a label reaches depends on the axis ends echarts picks and on the
 * plot's size, so it can only be read off the laid-out chart. `bound` is the
 * grid edge the option set, which is where the axis labels on that side stop.
 */
export function dataLabelOverflow(
  chart: ECharts,
  side: DataLabelSide,
  bound: number,
) {
  const width = chart.getWidth()
  let overflow: number | null = null

  ;(chart as any).getModel().eachSeries((series: any) => {
    if (!series.get(['label', 'show'])) return
    // A label inside the fill never leaves the mark.
    if (series.get(['label', 'position']) === 'inside') return
    const distance = series.get(['label', 'distance']) ?? DEFAULT_LABEL_DISTANCE
    const data = series.getData()
    // A line lays its points out as one flat `[x0, y0, x1, y1, …]` array.
    const points = data.getLayout('points')

    data.each((index: number) => {
      const el = data.getItemGraphicEl(index)
      // A line point is a symbol group, and its label hangs off the path inside.
      const label = (el?.getSymbolPath?.() ?? el)?.getTextContent?.()
      const tip = markTip(
        points
          ? [points[index * 2], points[index * 2 + 1]]
          : data.getItemLayout(index),
        side,
      )
      // A gap in a line is a NaN point, with nothing drawn there to label.
      if (!label || tip === null || Number.isNaN(tip)) return
      const box = label.getBoundingRect()

      const reach =
        side === 'top'
          ? bound - (tip - distance - box.height)
          : side === 'right'
            ? tip + distance + box.width - (width - bound)
            : bound - (tip - distance - box.width)
      overflow = Math.max(overflow ?? -Infinity, reach)
    })
  })

  return overflow
}

/** The pixel a mark ends at on the side its label sits past. */
function markTip(layout: any, side: DataLabelSide): number | null {
  if (!layout) return null
  // A point is `[x, y]`, a bar its rect.
  if (Array.isArray(layout)) return side === 'top' ? layout[1] : layout[0]
  const { x, y, width, height } = layout
  if (side === 'top') return Math.min(y, y + height)
  if (side === 'right') return Math.max(x, x + width)
  return Math.min(x, x + width)
}

import type { ECharts } from 'echarts/core'

/**
 * Tells echarts the pointer has left the plot, as a mouse leaving does: the
 * hovered mark loses its emphasis and the axis pointer goes. A finger never
 * leaves, so after a tap echarts still counts the mark as hovered, and a second
 * tap on it would not open it again.
 *
 * echarts' own `downplay` and `hideTip` actions take the emphasis and the
 * pointer off but leave zrender's record of the hovered mark, which is what
 * stops the second tap. A move off the canvas clears that record, and
 * `globalout` is what echarts takes the axis pointer down on.
 */
export function clearHover(chart: ECharts | undefined) {
  const handler = chart?.getZr().handler
  if (!handler) return
  // Stands in for the native event, for a listener that stops it.
  const event = { preventDefault() {}, stopPropagation() {} }
  handler.dispatch('mousemove', { ...event, zrX: -1, zrY: -1 })
  handler.dispatch('mouseout', { ...event, zrEventControl: 'only_globalout' })
}

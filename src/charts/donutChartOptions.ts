import type { EChartsCoreOption } from 'echarts/core'
import { BLUR_OPACITY, DATA_LABEL_FONT_SIZE } from './axisChartCommon'
import { formatPercent } from './format'
import { CHART_FONT_FAMILY } from './measureText'
import { buildSlices, drawnSlices, type SliceContext } from './slices'
import { mergeDeep } from './utils'
import type { DonutChartConfig } from './types'

/** Wide enough a ring to read as a ring, with room for the center readout. */
const DONUT_RADIUS = ['64%', '90%']
/** Pulled in to leave the leader lines somewhere to go. */
const DONUT_RADIUS_WITH_LABELS = ['46%', '66%']

/**
 * A half ring grows into the space the missing bottom half frees up. The inner
 * radius trails the outer by the same 26 points as the full ring, which keeps
 * the band the same thickness on screen.
 */
const HALF_RADIUS = ['74%', '100%']
const HALF_RADIUS_WITH_LABELS = ['54%', '80%']
/**
 * Pushed down so the semicircle sits in the middle of the card rather than in
 * its top half. The readout overlay is anchored to the same fraction.
 */
export const HALF_CENTER_Y = '75%'
/** Thin gap between slices, so neighbouring hues don't bleed into each other. */
const SLICE_PAD_ANGLE = 1.5
const SLICE_RADIUS = 4
/** How far the hovered slice grows out of the ring, in px. */
const EMPHASIS_SCALE = 4

export function buildDonutChartOption(
  config: DonutChartConfig,
  context: SliceContext,
): EChartsCoreOption {
  const { tokens } = context
  const isRTL = config.dir === 'rtl'
  const slices = buildSlices(config, context)
  // Echarts pads a zero slice like any other. The legend still lists it.
  const plotted = drawnSlices(slices)
  const labels = new Map(slices.map((slice) => [slice.name, slice.label]))

  const isHalf = config.variant === 'half'

  const option = {
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    textStyle: { fontFamily: CHART_FONT_FAMILY },
    // No `tooltip` key, and no TooltipComponent registered with it: a pie has no
    // axis pointer for echarts' tooltip to drive, and the visible tooltip is a
    // Vue component (see ChartTooltip).
    series: [
      {
        type: 'pie',
        name: config.valueColumn,
        radius: isHalf
          ? config.showDataLabels
            ? HALF_RADIUS_WITH_LABELS
            : HALF_RADIUS
          : config.showDataLabels
            ? DONUT_RADIUS_WITH_LABELS
            : DONUT_RADIUS,
        center: ['50%', isHalf ? HALF_CENTER_Y : '50%'],
        // RTL reads the other way round the ring, as it does along an axis.
        clockwise: !isRTL,
        // Both halves sweep across the top — 9 o'clock to 3 o'clock going one
        // way, 3 to 9 going the other — so the arc opens downward either way.
        ...(isHalf
          ? isRTL
            ? { startAngle: 0, endAngle: 180 }
            : { startAngle: 180, endAngle: 0 }
          : null),
        // A lone slice is the whole ring: padding it opens a gap at the top.
        padAngle: plotted.length > 1 ? SLICE_PAD_ANGLE : 0,
        itemStyle: { borderRadius: SLICE_RADIUS, borderWidth: 0 },
        avoidLabelOverlap: true,
        label: {
          show: Boolean(config.showDataLabels),
          color: tokens.dataLabel,
          fontSize: DATA_LABEL_FONT_SIZE,
          // `params.percent` is echarts' own share of the series total, which is
          // the visible total — the same denominator the legend uses.
          formatter: (params: any) =>
            `${labels.get(params.name) ?? params.name} ${formatPercent(
              params.percent,
            )}`,
        },
        labelLine: {
          show: Boolean(config.showDataLabels),
          length: 8,
          length2: 12,
          smooth: true,
          lineStyle: { width: 1, color: tokens.axisLine },
        },
        // Hovering one slice pushes the rest of the ring back, rather than only
        // lifting the hovered arc out of it.
        emphasis: {
          focus: 'self',
          blurScope: 'series',
          scaleSize: EMPHASIS_SCALE,
        },
        blur: {
          itemStyle: { opacity: BLUR_OPACITY },
          label: { opacity: BLUR_OPACITY },
          labelLine: { opacity: BLUR_OPACITY },
        },
        // Drawn when every visible slice is zero.
        emptyCircleStyle: { color: tokens.gridline },
        data: plotted.map((slice) => ({
          name: slice.name,
          value: slice.value,
          itemStyle: { color: slice.color },
        })),
      },
    ],
  }

  return mergeDeep(option, config.echartOptions)
}

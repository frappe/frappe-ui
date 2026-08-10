import type { EChartsCoreOption } from 'echarts/core'
import { BLUR_OPACITY, DATA_LABEL_FONT_SIZE, toNumber } from './axisChartCommon'
import { formatPercent } from './format'
import { CHART_FONT_FAMILY } from './measureText'
import { chartColors, type ChartTokens } from './tokens'
import { mergeDeep, OTHERS_KEY, OTHERS_LABEL } from './utils'
import type { ChartPaletteName, DonutChartConfig, DonutSlice } from './types'

// Plot, legend, tooltip and center readout all read the same `DonutSlice[]`, so
// the four can't disagree about what a slice is worth.

export type DonutChartOptionContext = {
  tokens: ChartTokens
  /** Slice names the legend has switched off. Dropped from the ring. */
  hiddenSlices?: string[]
}

export const DEFAULT_MAX_SLICES = 9
/** Below two there is nothing left to group into. */
const MIN_MAX_SLICES = 2

const DONUT_PALETTE: ChartPaletteName = 'categorical'

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

/**
 * The slices of a ring, in drawing order. Hidden slices stay in the list — the
 * legend still needs them, and dropping them would shift every color after.
 */
export function buildDonutSlices(
  config: DonutChartConfig,
  { tokens, hiddenSlices = [] }: DonutChartOptionContext,
): DonutSlice[] {
  const grouped = groupRows(config)
  const colors = chartColors(config.palette, tokens, {
    fallback: DONUT_PALETTE,
    count: grouped.length,
  })

  const visibleTotal = grouped.reduce(
    (sum, slice) =>
      hiddenSlices.includes(slice.name) ? sum : sum + slice.value,
    0,
  )

  return grouped.map((slice, index) => {
    const hidden = hiddenSlices.includes(slice.name)
    return {
      ...slice,
      color: colors[index],
      hidden,
      percent: hidden || !visibleTotal ? 0 : (slice.value / visibleTotal) * 100,
    }
  })
}

type UnsizedSlice = Omit<DonutSlice, 'color' | 'hidden' | 'percent'>

function groupRows(config: DonutChartConfig): UnsizedSlice[] {
  const rows = config.data ?? []

  const entries = rows
    .map((row) => ({ row, value: toNumber(row[config.valueColumn]) }))
    // A ring reads as parts of a whole, and a negative part has no arc to draw.
    .filter(
      (entry): entry is { row: Record<string, any>; value: number } =>
        entry.value !== null && entry.value >= 0,
    )
    // Biggest first: the ring, the legend and the tail that gets grouped all
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
 * Two rows can carry the same category value, and echarts addresses a slice by
 * name — so a repeat would highlight and hide both at once. The label keeps the
 * raw value; only the identity is made unique.
 */
function uniqueName(label: string, seen: Set<string>) {
  let name = label
  let suffix = 2
  while (seen.has(name)) name = `${label} (${suffix++})`
  seen.add(name)
  return name
}

export function buildDonutChartOption(
  config: DonutChartConfig,
  context: DonutChartOptionContext,
): EChartsCoreOption {
  const { tokens } = context
  const isRTL = config.dir === 'rtl'
  const slices = buildDonutSlices(config, context)
  const visible = slices.filter((slice) => !slice.hidden)
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
          ? config.showInlineLabels
            ? HALF_RADIUS_WITH_LABELS
            : HALF_RADIUS
          : config.showInlineLabels
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
        padAngle: SLICE_PAD_ANGLE,
        itemStyle: { borderRadius: SLICE_RADIUS, borderWidth: 0 },
        avoidLabelOverlap: true,
        label: {
          show: Boolean(config.showInlineLabels),
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
          show: Boolean(config.showInlineLabels),
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
        data: visible.map((slice) => ({
          name: slice.name,
          value: slice.value,
          itemStyle: { color: slice.color },
        })),
      },
    ],
  }

  return mergeDeep(option, config.echartOptions)
}

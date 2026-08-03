import type { EChartsCoreOption } from 'echarts/core'
import { BLUR_OPACITY, type AxisChartOptionContext } from './axisChartCommon'
import { buildLineLikeOption } from './lineChartOptions'
import type { AreaChartConfig, AreaSeriesConfig } from './types'

export type AreaChartOptionContext = AxisChartOptionContext

/** A wash that shows the trend without swallowing the gridlines behind it. */
export const DEFAULT_FILL_OPACITY = 0.16
/** Stacked bands are read as areas, not as lines, so they carry a solid fill. */
export const DEFAULT_STACKED_FILL_OPACITY = 0.75
/** Where the gradient lands by the time it reaches the axis. */
const GRADIENT_FADE = 0.1

export function buildAreaChartOption(
  config: AreaChartConfig,
  context: AreaChartOptionContext,
): EChartsCoreOption {
  return buildLineLikeOption(config, context, (series, color) => ({
    stack: stackNameOf(series, config),
    areaStyle: fillStyle(series, config, color),
    blur: { areaStyle: { opacity: blurOpacity(series, config) } },
  }))
}

function stackNameOf(series: AreaSeriesConfig, config: AreaChartConfig) {
  if (!config.stacked) return undefined
  return series.stackName || 'stack'
}

function fillOpacityOf(series: AreaSeriesConfig, config: AreaChartConfig) {
  return (
    series.fillOpacity ??
    config.fillOpacity ??
    (config.stacked ? DEFAULT_STACKED_FILL_OPACITY : DEFAULT_FILL_OPACITY)
  )
}

/** The blur state has to dim the fill relative to its own opacity, not to 1. */
function blurOpacity(series: AreaSeriesConfig, config: AreaChartConfig) {
  return fillOpacityOf(series, config) * BLUR_OPACITY
}

/**
 * Overlapping washes fade out towards the axis so the lines stay legible where
 * they cross. Stacked bands have no overlap to resolve and read as one solid
 * block each, so they take a flat fill instead.
 */
function fillStyle(
  series: AreaSeriesConfig,
  config: AreaChartConfig,
  color: string,
) {
  const opacity = fillOpacityOf(series, config)
  if (config.stacked) return { color, opacity }

  const top = withAlpha(color, opacity)
  const bottom = withAlpha(color, opacity * GRADIENT_FADE)
  if (!top || !bottom) return { color, opacity }

  return {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: top },
        { offset: 1, color: bottom },
      ],
    },
    // The stops carry the alpha; a second multiplier here would double-dip.
    opacity: 1,
  }
}

/**
 * `rgba()` for a hex color. Only hex parses — every `--chart-*` stop is authored
 * as hex — so a color in any other notation falls back to a flat fill.
 */
function withAlpha(color: string, alpha: number): string | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color?.trim() ?? '')
  if (!match) return null

  const hex =
    match[1].length === 3
      ? match[1]
          .split('')
          .map((c) => c + c)
          .join('')
      : match[1]

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`
}

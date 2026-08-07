import { BLUR_OPACITY } from './axisChartCommon'
import type { AxisChartConfig, AxisSeriesConfig } from './types'

/** A wash that shows the trend without swallowing the gridlines behind it. */
export const DEFAULT_FILL_OPACITY = 0.16
/** Stacked bands are read as areas, not as lines, so they carry a solid fill. */
export const DEFAULT_STACKED_FILL_OPACITY = 0.75
/** Where the gradient lands by the time it reaches the axis. */
const GRADIENT_FADE = 0.1

/** The keys that turn a line series into an area: the fill, and how it blurs. */
export function areaSeriesExtra(
  series: AxisSeriesConfig,
  config: AxisChartConfig,
  color: string,
  opts: { horizontal: boolean; isRTL: boolean; stacked: boolean },
) {
  return {
    areaStyle: fillStyle(series, config, color, opts),
    blur: { areaStyle: { opacity: blurOpacity(series, config, opts.stacked) } },
  }
}

function fillOpacityOf(
  series: AxisSeriesConfig,
  config: AxisChartConfig,
  stacked: boolean,
) {
  return (
    series.fillOpacity ??
    config.fillOpacity ??
    (stacked ? DEFAULT_STACKED_FILL_OPACITY : DEFAULT_FILL_OPACITY)
  )
}

/** The blur state has to dim the fill relative to its own opacity, not to 1. */
function blurOpacity(
  series: AxisSeriesConfig,
  config: AxisChartConfig,
  stacked: boolean,
) {
  return fillOpacityOf(series, config, stacked) * BLUR_OPACITY
}

/**
 * Overlapping washes fade out towards the axis so the lines stay legible where
 * they cross. Stacked bands have no overlap to resolve and read as one solid
 * block each, so they take a flat fill instead.
 */
function fillStyle(
  series: AxisSeriesConfig,
  config: AxisChartConfig,
  color: string,
  opts: { horizontal: boolean; isRTL: boolean; stacked: boolean },
) {
  const opacity = fillOpacityOf(series, config, opts.stacked)
  if (opts.stacked) return { color, opacity }

  const near = withAlpha(color, opacity)
  const far = withAlpha(color, opacity * GRADIENT_FADE)
  if (!near || !far) return { color, opacity }

  return {
    color: {
      type: 'linear',
      ...gradientAxis(opts),
      colorStops: [
        { offset: 0, color: near },
        { offset: 1, color: far },
      ],
    },
    // The stops carry the alpha; a second multiplier here would double-dip.
    opacity: 1,
  }
}

/**
 * Which way the wash fades: from the line towards the axis it is measured from.
 * That is downwards on a column chart, and along X once the category axis has
 * moved to Y — the other way again in RTL, where the value axis is inverted.
 */
function gradientAxis({
  horizontal,
  isRTL,
}: {
  horizontal: boolean
  isRTL: boolean
}) {
  if (!horizontal) return { x: 0, y: 0, x2: 0, y2: 1 }
  return isRTL ? { x: 0, y: 0, x2: 1, y2: 0 } : { x: 1, y: 0, x2: 0, y2: 0 }
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

// Everything is computed in a 100x100 box the card stretches to its own width:
// the line as an SVG viewBox with `preserveAspectRatio="none"`, the bars as
// percentages of the band. Either way the geometry is computed once.

export type SparklinePoint = { x: number; y: number }

/** One bar, in viewBox units. `y` is its top; every bar sits on the bottom edge. */
export type SparklineBar = {
  x: number
  y: number
  width: number
  height: number
}

export type SparklineGeometryOptions = {
  /** viewBox width. Points span it edge to edge. */
  width?: number
  /** viewBox height. */
  height?: number
  /**
   * Vertical breathing room, in viewBox units, kept clear at the top and
   * bottom. Without it the stroke at the series' peak is half clipped.
   */
  inset?: number
}

const DEFAULT_WIDTH = 100
const DEFAULT_HEIGHT = 100
const DEFAULT_INSET = 2

/**
 * The series as points, oldest at the left, largest at the top. Gaps are
 * dropped rather than plotted as zero — a month with no reading is not a month
 * of nothing. A series with nothing to compare draws flat down the middle;
 * pinning it to the top or bottom would invent a trend.
 */
export function sparklinePoints(
  values: (number | null | undefined)[] | undefined,
  options: SparklineGeometryOptions = {},
): SparklinePoint[] {
  const width = options.width ?? DEFAULT_WIDTH
  const height = options.height ?? DEFAULT_HEIGHT
  const inset = options.inset ?? DEFAULT_INSET

  const readings = (values ?? []).filter(isPresent)
  if (!readings.length) return []

  const top = inset
  const bottom = height - inset
  const middle = (top + bottom) / 2

  if (readings.length === 1) {
    return [
      { x: 0, y: middle },
      { x: width, y: middle },
    ]
  }

  const min = Math.min(...readings)
  const max = Math.max(...readings)
  const span = max - min

  return readings.map((value, i) => ({
    x: (i * width) / (readings.length - 1),
    y: span === 0 ? middle : bottom - ((value - min) / span) * (bottom - top),
  }))
}

/** The trend line itself, as an SVG path. Empty when there is nothing to draw. */
export function sparklineLinePath(points: SparklinePoint[]): string {
  if (!points.length) return ''
  return points
    .map(
      (point, i) => `${i === 0 ? 'M' : 'L'}${round(point.x)},${round(point.y)}`,
    )
    .join(' ')
}

/**
 * The same line closed against the bottom of the box, for the gradient fill.
 * Drawn under the line rather than instead of it, so the stroke stays crisp.
 */
export function sparklineAreaPath(
  points: SparklinePoint[],
  height = DEFAULT_HEIGHT,
): string {
  if (!points.length) return ''
  const first = points[0]
  const last = points[points.length - 1]
  return `${sparklineLinePath(points)} L${round(last.x)},${round(height)} L${round(
    first.x,
  )},${round(height)} Z`
}

export type SparklineBarOptions = SparklineGeometryOptions & {
  /**
   * Share of each bar's slot spent on the gap beside it, so the bars thin out as
   * the series lengthens instead of colliding at a fixed width.
   */
  gapRatio?: number
  /** Floor for the shortest bar, so the low readings stay visible as bars. */
  minHeight?: number
}

const DEFAULT_GAP_RATIO = 0.3
const DEFAULT_MIN_HEIGHT = 6

/**
 * The same series as bars, each standing on the bottom edge. Scaled between the
 * smallest and largest reading rather than from zero, matching the line: a bar
 * card and a line card of the same numbers should read the same.
 */
export function sparklineBars(
  values: (number | null | undefined)[] | undefined,
  options: SparklineBarOptions = {},
): SparklineBar[] {
  const width = options.width ?? DEFAULT_WIDTH
  const height = options.height ?? DEFAULT_HEIGHT
  const inset = options.inset ?? DEFAULT_INSET
  const gapRatio = clamp(options.gapRatio ?? DEFAULT_GAP_RATIO, 0, 0.9)
  const minHeight = options.minHeight ?? DEFAULT_MIN_HEIGHT

  const readings = (values ?? []).filter(isPresent)
  if (!readings.length) return []

  const slot = width / readings.length
  const barWidth = slot * (1 - gapRatio)

  // Only the top needs clearing: the bars run off the bottom of the card.
  const tallest = Math.max(height - inset, minHeight)
  const min = Math.min(...readings)
  const max = Math.max(...readings)
  const span = max - min

  return readings.map((value, i) => {
    // A series with nothing to compare has no trend to show, so every bar draws
    // at half height rather than all of them pinned to the top or the floor.
    const fraction = span === 0 ? 0.5 : (value - min) / span
    const barHeight = round(minHeight + fraction * (tallest - minHeight))
    return {
      x: round(i * slot + (slot - barWidth) / 2),
      y: round(height - barHeight),
      width: round(barWidth),
      height: barHeight,
    }
  })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Two decimals is well past what a 100-unit box can show, and keeps paths short. */
function round(value: number) {
  return Math.round(value * 100) / 100
}

function isPresent(value: number | null | undefined): value is number {
  return value !== null && value !== undefined && !isNaN(value)
}

import { toNumber } from './axisChartCommon'
import type { ChartDir, FunnelChartConfig, FunnelStage } from './types'

// Shapes are computed in the SVG's own viewBox units. The component renders that
// box with `preserveAspectRatio="none"`, so a funnel resizes with its card
// without measuring anything.

/** One trapezoid, as the `points` attribute of an SVG polygon. */
export type FunnelShape = {
  index: number
  points: string
}

export type FunnelShapeOptions = {
  /** viewBox width. The columns divide it evenly. */
  width?: number
  /** viewBox height. The tallest stage fills it; every shape sits on its floor. */
  height?: number
  /** Mirrors the columns, so stage one starts at the right edge. */
  dir?: ChartDir
}

const DEFAULT_WIDTH = 1000
const DEFAULT_HEIGHT = 100

/**
 * The stages of a funnel, in the order the rows arrive. Rows are *not* sorted:
 * a funnel's order is its process, not its magnitude, so a stage that outgrew
 * its predecessor stays where the data put it.
 */
export function buildFunnelStages(config: FunnelChartConfig): FunnelStage[] {
  const rows = config.data ?? []
  const raw = rows.map((row) => ({
    row,
    label: stageLabel(row[config.categoryColumn]),
    // A funnel counts things that got this far, so a missing or negative count
    // is noise; both read as nothing reaching the stage.
    value: Math.max(0, toNumber(row[config.valueColumn]) ?? 0),
  }))

  const first = raw[0]?.value ?? 0

  return raw.map((stage, index) => {
    const previous = index === 0 ? first : raw[index - 1].value
    return {
      index,
      label: stage.label,
      value: stage.value,
      row: stage.row,
      percentOfFirst: share(stage.value, first),
      percentOfPrevious: share(stage.value, previous),
    }
  })
}

/**
 * A trapezoid per stage, anchored to the bottom of the box. Each starts at its
 * own stage's height and ends at the next stage's, so the tops join edge to
 * edge. The last column stays level: tapering it would draw a drop-off the data
 * never reported.
 */
export function funnelShapes(
  values: number[],
  options: FunnelShapeOptions = {},
): FunnelShape[] {
  const width = options.width ?? DEFAULT_WIDTH
  const height = options.height ?? DEFAULT_HEIGHT
  const rtl = options.dir === 'rtl'

  if (!values.length) return []

  const max = Math.max(0, ...values.map(present))
  const columnWidth = width / values.length

  // Every shape is measured against the tallest stage, so the first column of a
  // funnel that only ever loses fills the box.
  const top = (value: number) =>
    max <= 0 ? height : height - (present(value) / max) * height

  return values.map((value, index) => {
    const next = index === values.length - 1 ? value : values[index + 1]
    const start = index * columnWidth
    const end = start + columnWidth
    const x0 = rtl ? width - start : start
    const x1 = rtl ? width - end : end

    return {
      index,
      points: [
        point(x0, top(value)),
        point(x1, top(next)),
        point(x1, height),
        point(x0, height),
      ].join(' '),
    }
  })
}

function present(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}

function share(value: number, of: number) {
  return of > 0 ? (value / of) * 100 : 0
}

function stageLabel(value: any) {
  return value === null || value === undefined || value === ''
    ? '(Blank)'
    : String(value)
}

function point(x: number, y: number) {
  return `${round(x)},${round(y)}`
}

/** Two decimals is past what the box can show, and keeps the attribute short. */
function round(value: number) {
  return Math.round(value * 100) / 100
}

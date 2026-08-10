import { toNumber } from './axisChartCommon'
import type { ChartDir, FunnelChartConfig, FunnelStage } from './types'

// Shapes are computed in the SVG's own viewBox units. The component renders that
// box with `preserveAspectRatio="none"`, so a funnel resizes with its card
// without measuring anything.

/** One trapezoid, as the `d` attribute of an SVG path. */
export type FunnelShape = {
  index: number
  d: string
}

export type FunnelShapeOptions = {
  /** viewBox width. The columns divide it evenly. */
  width?: number
  /** viewBox height. The tallest stage fills it; every shape sits on its floor. */
  height?: number
  /** Mirrors the columns, so stage one starts at the right edge. */
  dir?: ChartDir
  /** How far a top corner cuts back horizontally, in viewBox units. */
  radiusX?: number
  /** How far a top corner cuts back vertically, in viewBox units. */
  radiusY?: number
}

const DEFAULT_WIDTH = 1000
const DEFAULT_HEIGHT = 100

/** The bar charts' corner, in css pixels. The funnel rounds to match them. */
const CORNER = 4

/**
 * `preserveAspectRatio="none"` stretches the two axes by different factors, so
 * one radius in viewBox units would render as a slit. Each axis is sized
 * against the band a funnel usually gets instead, which puts both sides near
 * CORNER without the component having to measure its card.
 */
const REFERENCE_WIDTH = 640
const REFERENCE_HEIGHT = 160

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
 *
 * Only the two top corners are rounded, the way a bar rounds the tip it grows
 * towards: the floor corners run off the bottom of the card, where a curve
 * would read as a shape lifting off the edge.
 */
export function funnelShapes(
  values: number[],
  options: FunnelShapeOptions = {},
): FunnelShape[] {
  const width = options.width ?? DEFAULT_WIDTH
  const height = options.height ?? DEFAULT_HEIGHT
  const rtl = options.dir === 'rtl'
  const radiusX = options.radiusX ?? (width * CORNER) / REFERENCE_WIDTH
  const radiusY = options.radiusY ?? (height * CORNER) / REFERENCE_HEIGHT

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
    const y0 = top(value)
    const y1 = top(next)
    const dx = x1 - x0
    const dy = y1 - y0

    const near = corner(radiusX, radiusY, columnWidth, height - y0)
    const far = corner(radiusX, radiusY, columnWidth, height - y1)
    // How far along the sloped top each corner eats, as a fraction of it.
    const tNear = near.x / columnWidth
    const tFar = far.x / columnWidth

    // Quadratic curves rather than arcs: the stretched viewBox turns a circular
    // arc into an ellipse it can no longer describe, while a Bezier stretches
    // into a Bezier.
    return {
      index,
      d: [
        `M ${point(x0, y0 + near.y)}`,
        `Q ${point(x0, y0)} ${point(x0 + dx * tNear, y0 + dy * tNear)}`,
        `L ${point(x1 - dx * tFar, y1 - dy * tFar)}`,
        `Q ${point(x1, y1)} ${point(x1, y1 + far.y)}`,
        `L ${point(x1, height)}`,
        `L ${point(x0, height)}`,
        'Z',
      ].join(' '),
    }
  })
}

/**
 * A corner takes at most half of either edge it sits on, and both axes shrink
 * by the same factor, so a stage barely off the floor keeps a corner in
 * proportion rather than curving into a pill.
 */
function corner(
  radiusX: number,
  radiusY: number,
  edgeX: number,
  edgeY: number,
) {
  if (radiusX <= 0 || radiusY <= 0) return { x: 0, y: 0 }
  const scale = Math.min(1, edgeX / 2 / radiusX, edgeY / 2 / radiusY)
  return { x: radiusX * scale, y: radiusY * scale }
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

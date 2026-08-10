import { describe, expect, it } from 'vitest'
import {
  sparklineAreaPath,
  sparklineBars,
  sparklineLinePath,
  sparklinePoints,
} from './sparkline'

const box = { width: 100, height: 100, inset: 0 }

describe('sparklinePoints', () => {
  it('spans the box, largest reading at the top', () => {
    const points = sparklinePoints([10, 30, 20], box)

    expect(points.map((p) => p.x)).toEqual([0, 50, 100])
    expect(points.map((p) => p.y)).toEqual([100, 0, 50])
  })

  it('keeps the stroke clear of the top and bottom edges', () => {
    const points = sparklinePoints([1, 5], { ...box, inset: 4 })

    expect(points.map((p) => p.y)).toEqual([96, 4])
  })

  it('draws a series that never moved down the middle', () => {
    const points = sparklinePoints([7, 7, 7], box)

    expect(points.map((p) => p.y)).toEqual([50, 50, 50])
  })

  it('draws a single reading as a flat line, having no trend to show', () => {
    expect(sparklinePoints([7], box)).toEqual([
      { x: 0, y: 50 },
      { x: 100, y: 50 },
    ])
  })

  it('skips gaps rather than plotting them as zero', () => {
    const points = sparklinePoints([10, null, 30, undefined, NaN, 20], box)

    expect(points.map((p) => p.x)).toEqual([0, 50, 100])
    expect(points.map((p) => p.y)).toEqual([100, 0, 50])
  })

  it('has nothing to draw without readings', () => {
    expect(sparklinePoints([], box)).toEqual([])
    expect(sparklinePoints(undefined, box)).toEqual([])
    expect(sparklinePoints([null, undefined], box)).toEqual([])
  })
})

describe('sparklineLinePath', () => {
  it('moves to the first point and lines to the rest', () => {
    expect(sparklineLinePath(sparklinePoints([10, 30, 20], box))).toBe(
      'M0,100 L50,0 L100,50',
    )
  })

  it('is empty with nothing to draw', () => {
    expect(sparklineLinePath([])).toBe('')
  })
})

describe('sparklineAreaPath', () => {
  it('closes the line against the bottom of the box', () => {
    expect(sparklineAreaPath(sparklinePoints([10, 30, 20], box), 100)).toBe(
      'M0,100 L50,0 L100,50 L100,100 L0,100 Z',
    )
  })

  it('is empty with nothing to draw', () => {
    expect(sparklineAreaPath([], 100)).toBe('')
  })
})

describe('sparklineBars', () => {
  const bars = {
    width: 100,
    height: 100,
    inset: 0,
    gapRatio: 0.2,
    minHeight: 0,
  }

  it('stands every bar on the bottom edge, tallest reading at the top', () => {
    const drawn = sparklineBars([10, 30, 20], bars)

    expect(drawn.map((b) => b.height)).toEqual([0, 100, 50])
    expect(drawn.map((b) => b.y)).toEqual([100, 0, 50])
  })

  it('centres each bar in its slot, thinning them as the series grows', () => {
    expect(sparklineBars([1, 2], bars)).toEqual([
      { x: 5, y: 100, width: 40, height: 0 },
      { x: 55, y: 0, width: 40, height: 100 },
    ])

    expect(sparklineBars([1, 2, 3, 4], bars).map((b) => b.width)).toEqual([
      20, 20, 20, 20,
    ])
  })

  it('keeps the tallest bar clear of the top edge', () => {
    const drawn = sparklineBars([1, 5], { ...bars, inset: 4 })

    expect(drawn.map((b) => b.y)).toEqual([100, 4])
  })

  it('keeps the shortest reading visible as a bar', () => {
    const drawn = sparklineBars([1, 5], { ...bars, minHeight: 6 })

    expect(drawn.map((b) => b.height)).toEqual([6, 100])
  })

  it('draws a series that never moved at half height', () => {
    expect(sparklineBars([7, 7, 7], bars).map((b) => b.height)).toEqual([
      50, 50, 50,
    ])
  })

  it('draws a single reading as one centred bar', () => {
    expect(sparklineBars([7], bars)).toEqual([
      { x: 10, y: 50, width: 80, height: 50 },
    ])
  })

  it('skips gaps rather than drawing them as zero-height bars', () => {
    const drawn = sparklineBars([10, null, 30, undefined, NaN, 20], bars)

    expect(drawn.map((b) => b.x)).toEqual([3.33, 36.67, 70])
    expect(drawn.map((b) => b.height)).toEqual([0, 100, 50])
  })

  it('has nothing to draw without readings', () => {
    expect(sparklineBars([], bars)).toEqual([])
    expect(sparklineBars(undefined, bars)).toEqual([])
    expect(sparklineBars([null, undefined], bars)).toEqual([])
  })
})

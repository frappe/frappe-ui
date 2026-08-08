import { describe, expect, it } from 'vitest'
import { buildFunnelStages, funnelShapes } from './funnelGeometry'
import type { FunnelChartConfig } from './types'

// Square corners in a square box, so the pinned paths stay readable. The
// component's own radii differ per axis, see funnelGeometry.ts.
const box = { width: 100, height: 100, radiusX: 10, radiusY: 10 }

function config(data: Record<string, any>[]): FunnelChartConfig {
  return { data, categoryColumn: 'stage', valueColumn: 'count' }
}

describe('buildFunnelStages', () => {
  it('keeps the rows in process order rather than sorting by size', () => {
    const stages = buildFunnelStages(
      config([
        { stage: 'Leads', count: 100 },
        { stage: 'Qualified', count: 400 },
        { stage: 'Won', count: 50 },
      ]),
    )

    expect(stages.map((s) => s.label)).toEqual(['Leads', 'Qualified', 'Won'])
    expect(stages.map((s) => s.index)).toEqual([0, 1, 2])
  })

  it('measures each stage against the first stage and against its predecessor', () => {
    const stages = buildFunnelStages(
      config([
        { stage: 'Leads', count: 200 },
        { stage: 'Qualified', count: 100 },
        { stage: 'Won', count: 50 },
      ]),
    )

    expect(stages.map((s) => s.percentOfFirst)).toEqual([100, 50, 25])
    expect(stages.map((s) => s.percentOfPrevious)).toEqual([100, 50, 50])
  })

  it('reads a missing, unparseable or negative count as nothing reaching the stage', () => {
    const stages = buildFunnelStages(
      config([
        { stage: 'Leads', count: 100 },
        { stage: 'Qualified', count: null },
        { stage: 'Quotation', count: 'n/a' },
        { stage: 'Won', count: -12 },
      ]),
    )

    expect(stages.map((s) => s.value)).toEqual([100, 0, 0, 0])
  })

  it('percentages nothing against a first stage of zero', () => {
    const stages = buildFunnelStages(
      config([
        { stage: 'Leads', count: 0 },
        { stage: 'Won', count: 0 },
      ]),
    )

    expect(stages.map((s) => s.percentOfFirst)).toEqual([0, 0])
    expect(stages.map((s) => s.percentOfPrevious)).toEqual([0, 0])
  })

  it('names a blank category rather than leaving the column unlabelled', () => {
    const stages = buildFunnelStages(
      config([{ stage: '', count: 5 }, { count: 2 }]),
    )

    expect(stages.map((s) => s.label)).toEqual(['(Blank)', '(Blank)'])
  })

  it('carries the row behind each stage, for click handlers', () => {
    const row = { stage: 'Leads', count: 5, owner: 'ada' }
    expect(buildFunnelStages(config([row]))[0].row).toBe(row)
  })

  it('has no stages without data', () => {
    expect(buildFunnelStages(config([]))).toEqual([])
  })
})

describe('funnelShapes', () => {
  it('slants each column from its own height to the next stage', () => {
    const [first, second] = funnelShapes([100, 50], box)

    expect(first.d).toBe(
      'M 0,10 Q 0,0 10,10 L 40,40 Q 50,50 50,60 L 50,100 L 0,100 Z',
    )
    expect(second.d).toBe(
      'M 50,60 Q 50,50 60,50 L 90,50 Q 100,50 100,60 L 100,100 L 50,100 Z',
    )
  })

  it('keeps the last column level, having no next stage to lean towards', () => {
    const shapes = funnelShapes([100, 20], box)

    expect(shapes.at(-1)!.d).toBe(
      'M 50,90 Q 50,80 60,80 L 90,80 Q 100,80 100,90 L 100,100 L 50,100 Z',
    )
  })

  it('slants upwards when a stage outgrew the one before it', () => {
    const [first] = funnelShapes([50, 100], box)

    expect(first.d).toBe(
      'M 0,60 Q 0,50 10,40 L 40,10 Q 50,0 50,10 L 50,100 L 0,100 Z',
    )
  })

  it('measures every stage against the tallest, not against the first', () => {
    const [first] = funnelShapes([50, 100], box)

    // The first column's corner sits at half height because the second stage is
    // double it. The curve leaves that corner, so the corner is the control point.
    expect(first.d).toContain('Q 0,50')
  })

  it('rounds the two top corners and leaves the floor square', () => {
    expect(funnelShapes([42], box)).toEqual([
      {
        index: 0,
        d: 'M 0,10 Q 0,0 10,0 L 90,0 Q 100,0 100,10 L 100,100 L 0,100 Z',
      },
    ])
  })

  it('shrinks a corner rather than curving a short stage into a pill', () => {
    // Four units of height leaves two for the corner, and the horizontal cut
    // shrinks by the same fifth so the corner keeps its shape.
    const [, second] = funnelShapes([100, 4], box)

    expect(second.d).toBe(
      'M 50,98 Q 50,96 52,96 L 98,96 Q 100,96 100,98 L 100,100 L 50,100 Z',
    )
  })

  it('shrinks a corner to fit a narrow column too', () => {
    // Ten stages across the box leave columns of ten, so neither corner may cut
    // back more than five.
    const [first] = funnelShapes(Array(10).fill(100), box)

    expect(first.d).toBe('M 0,5 Q 0,0 5,0 L 5,0 Q 10,0 10,5 L 10,100 L 0,100 Z')
  })

  it('drops a zero stage to the floor and slants its neighbour into it', () => {
    const [first, second] = funnelShapes([100, 0], box)

    // The corner on the floor has no height to round into.
    expect(first.d).toBe(
      'M 0,10 Q 0,0 10,20 L 50,100 Q 50,100 50,100 L 50,100 L 0,100 Z',
    )
    expect(second.d).toBe(
      'M 50,100 Q 50,100 50,100 L 100,100 Q 100,100 100,100 L 100,100 L 50,100 Z',
    )
  })

  it('draws nothing at all when every stage is zero', () => {
    const shapes = funnelShapes([0, 0], box)

    expect(shapes.map((s) => s.d)).toEqual([
      'M 0,100 Q 0,100 0,100 L 50,100 Q 50,100 50,100 L 50,100 L 0,100 Z',
      'M 50,100 Q 50,100 50,100 L 100,100 Q 100,100 100,100 L 100,100 L 50,100 Z',
    ])
  })

  it('mirrors the columns and their slants in RTL', () => {
    const [first, second] = funnelShapes([100, 50], { ...box, dir: 'rtl' })

    expect(first.d).toBe(
      'M 100,10 Q 100,0 90,10 L 60,40 Q 50,50 50,60 L 50,100 L 100,100 Z',
    )
    expect(second.d).toBe(
      'M 50,60 Q 50,50 40,50 L 10,50 Q 0,50 0,60 L 0,100 L 50,100 Z',
    )
  })

  it('sizes each axis on its own, the viewBox being stretched to fit', () => {
    const [only] = funnelShapes([1], { width: 1000, height: 100 })

    // 4px on a 640x160 band: a wider cut across, a shallower one down.
    expect(only.d.startsWith('M 0,2.5 Q 0,0 6.25,0')).toBe(true)
  })

  it('has nothing to draw without stages', () => {
    expect(funnelShapes([], box)).toEqual([])
  })
})

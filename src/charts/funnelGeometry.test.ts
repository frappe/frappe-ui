import { describe, expect, it } from 'vitest'
import { buildFunnelStages, funnelShapes } from './funnelGeometry'
import type { FunnelChartConfig } from './types'

const box = { width: 100, height: 100 }

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

    expect(first.points).toBe('0,0 50,50 50,100 0,100')
    expect(second.points).toBe('50,50 100,50 100,100 50,100')
  })

  it('keeps the last column level, having no next stage to lean towards', () => {
    const shapes = funnelShapes([100, 20], box)

    expect(shapes.at(-1)!.points).toBe('50,80 100,80 100,100 50,100')
  })

  it('slants upwards when a stage outgrew the one before it', () => {
    const [first] = funnelShapes([50, 100], box)

    expect(first.points).toBe('0,50 50,0 50,100 0,100')
  })

  it('measures every stage against the tallest, not against the first', () => {
    const [first] = funnelShapes([50, 100], box)

    // The first column stands at half height because the second one is double.
    expect(first.points.startsWith('0,50')).toBe(true)
  })

  it('fills the box with a single stage', () => {
    expect(funnelShapes([42], box)).toEqual([
      { index: 0, points: '0,0 100,0 100,100 0,100' },
    ])
  })

  it('drops a zero stage to the floor and slants its neighbour into it', () => {
    const [first, second] = funnelShapes([100, 0], box)

    expect(first.points).toBe('0,0 50,100 50,100 0,100')
    expect(second.points).toBe('50,100 100,100 100,100 50,100')
  })

  it('draws nothing at all when every stage is zero', () => {
    const shapes = funnelShapes([0, 0], box)

    expect(shapes.map((s) => s.points)).toEqual([
      '0,100 50,100 50,100 0,100',
      '50,100 100,100 100,100 50,100',
    ])
  })

  it('mirrors the columns and their slants in RTL', () => {
    const [first, second] = funnelShapes([100, 50], { ...box, dir: 'rtl' })

    expect(first.points).toBe('100,0 50,50 50,100 100,100')
    expect(second.points).toBe('50,50 0,50 0,100 50,100')
  })

  it('has nothing to draw without stages', () => {
    expect(funnelShapes([], box)).toEqual([])
  })
})

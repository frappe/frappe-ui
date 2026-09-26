import { describe, expect, it } from 'vitest'
import {
  buildProportionSegments,
  MIN_SEGMENT_WIDTH,
  segmentWidths,
} from './proportionSegments'
import { OTHERS_KEY } from './utils'
import type { ChartTokens } from './tokens'
import type { ProportionBarConfig } from './types'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  sequential: ['#000011', '#000022', '#000033', '#000044', '#000055'],
  diverging: ['#001100', '#002200', '#003300'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

function config(
  overrides: Partial<ProportionBarConfig> = {},
): ProportionBarConfig {
  return {
    data: [
      { part: 'Compute', amount: 60 },
      { part: 'Storage', amount: 30 },
      { part: 'Bandwidth', amount: 10 },
    ],
    categoryColumn: 'part',
    valueColumn: 'amount',
    ...overrides,
  }
}

function build(
  overrides: Partial<ProportionBarConfig> = {},
  hiddenSegments: string[] = [],
) {
  return buildProportionSegments(config(overrides), { tokens, hiddenSegments })
}

const total = (widths: number[]) =>
  Math.round(widths.reduce((sum, width) => sum + width, 0) * 1e6) / 1e6

describe('buildProportionSegments', () => {
  it('keeps the rows in the order they were written', () => {
    const segments = build({
      data: [
        { part: 'Bandwidth', amount: 10 },
        { part: 'Compute', amount: 60 },
        { part: 'Storage', amount: 30 },
      ],
    })

    expect(segments.map((s) => s.label)).toEqual([
      'Bandwidth',
      'Compute',
      'Storage',
    ])
  })

  it('reads each segment as a share of the total', () => {
    expect(build().map((s) => s.percent)).toEqual([60, 30, 10])
  })

  it('colors the segments from the categorical ramp, in row order', () => {
    expect(build().map((s) => s.color)).toEqual([
      '#111111',
      '#222222',
      '#333333',
    ])
  })

  it('drops a row whose value is missing, unparseable or negative', () => {
    const segments = build({
      data: [
        { part: 'Compute', amount: 60 },
        { part: 'Storage', amount: null },
        { part: 'Bandwidth', amount: 'n/a' },
        { part: 'Refund', amount: -10 },
      ],
    })

    expect(segments.map((s) => s.label)).toEqual(['Compute'])
  })

  it('names a row with no category "(Blank)"', () => {
    const segments = build({ data: [{ part: '', amount: 5 }] })
    expect(segments[0].label).toBe('(Blank)')
  })

  it('keeps two rows of the same category apart by name, not by label', () => {
    const segments = build({
      data: [
        { part: 'Compute', amount: 60 },
        { part: 'Compute', amount: 40 },
      ],
    })

    expect(segments.map((s) => s.label)).toEqual(['Compute', 'Compute'])
    expect(segments.map((s) => s.name)).toEqual(['Compute', 'Compute (2)'])
  })

  it('re-percentages the rest when a segment is hidden', () => {
    const segments = build({}, ['Bandwidth'])

    expect(segments.map((s) => s.hidden)).toEqual([false, false, true])
    expect(segments.map((s) => s.percent)).toEqual([
      expect.closeTo(66.67, 2),
      expect.closeTo(33.33, 2),
      0,
    ])
  })

  it('leaves every segment at zero when nothing is visible', () => {
    const segments = build({}, ['Compute', 'Storage', 'Bandwidth'])
    expect(segments.map((s) => s.percent)).toEqual([0, 0, 0])
    expect(segments.map((s) => s.width)).toEqual([0, 0, 0])
  })
})

describe('buildProportionSegments — the "Others" tail', () => {
  const many = Array.from({ length: 9 }, (_, i) => ({
    part: `Part ${i + 1}`,
    amount: 10 - i,
  }))

  it('groups the smallest values past the cap into one segment', () => {
    const segments = buildProportionSegments(
      config({ data: many, maxSegments: 4 }),
      { tokens },
    )

    expect(segments).toHaveLength(4)
    expect(segments.map((s) => s.label)).toEqual([
      'Part 1',
      'Part 2',
      'Part 3',
      'Others',
    ])
    expect(segments[3].name).toBe(OTHERS_KEY)
    expect(segments[3].value).toBe(7 + 6 + 5 + 4 + 3 + 2)
    expect(segments[3].rows).toHaveLength(6)
  })

  it('draws the tail last however the rows were ordered', () => {
    const segments = buildProportionSegments(
      config({
        data: [
          { part: 'Small', amount: 1 },
          { part: 'Large', amount: 90 },
          { part: 'Medium', amount: 9 },
        ],
        maxSegments: 2,
      }),
      { tokens },
    )

    expect(segments.map((s) => s.label)).toEqual(['Large', 'Others'])
    expect(segments[1].value).toBe(10)
  })

  it('groups nothing when the rows fit the cap', () => {
    const segments = build({ maxSegments: 3 })
    expect(segments.map((s) => s.isOthers)).toEqual([false, false, false])
  })

  it('refuses a cap below two — there is nothing left to group into', () => {
    const segments = buildProportionSegments(
      config({ data: many, maxSegments: 1 }),
      { tokens },
    )

    expect(segments).toHaveLength(2)
    expect(segments[1].name).toBe(OTHERS_KEY)
  })
})

describe('segmentWidths', () => {
  it('draws true shares when every one clears the floor', () => {
    expect(segmentWidths([60, 30, 10])).toEqual([60, 30, 10])
  })

  it('lifts a hairline share onto the floor', () => {
    const widths = segmentWidths([99.7, 0.3])

    expect(widths[1]).toBe(MIN_SEGMENT_WIDTH)
    expect(total(widths)).toBe(100)
  })

  it('takes the difference off the wider segments, most from the widest', () => {
    const [wide, narrow, hairline] = segmentWidths([80, 19.8, 0.2])

    expect(hairline).toBe(MIN_SEGMENT_WIDTH)
    expect(80 - wide).toBeGreaterThan(19.8 - narrow)
    expect(total([wide, narrow, hairline])).toBe(100)
  })

  it('never re-orders the bar', () => {
    const widths = segmentWidths([50, 30, 19.5, 0.5])
    expect([...widths].sort((a, b) => b - a)).toEqual(widths)
  })

  it('leaves a segment worth nothing out of the bar', () => {
    expect(segmentWidths([70, 30, 0])).toEqual([70, 30, 0])
  })

  it('shares the track evenly when every segment is under the floor', () => {
    const widths = segmentWidths(Array(100).fill(1), 2)

    expect(total(widths)).toBe(100)
    expect(new Set(widths).size).toBe(1)
  })
})

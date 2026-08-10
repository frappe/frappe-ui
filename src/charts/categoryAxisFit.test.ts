import { describe, expect, it } from 'vitest'
import { buildAxisChartOption } from './axisChartOptions'
import { AXIS_LABEL_FONT_SIZE } from './axisChartCommon'
import { estimateTextWidth } from './format'
import type { ChartTheme } from './theme'
import type { AxisChartConfig } from './types'

/**
 * How a category axis lays its labels out when they stop fitting flat. There is
 * no angle prop: it follows from the width the chart was measured at and the
 * width of the labels themselves.
 */

const theme: ChartTheme = {
  categorical: ['#111111'],
  sequential: ['#000011', '#000022', '#000033'],
  diverging: ['#001100', '#003300'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

/** The plot width every case measures against, unless it says otherwise. */
const WIDTH = 600
/** `width - 2 * EDGE_PAD - VALUE_AXIS_RESERVE`: the room the categories share. */
const PLOT = WIDTH - 4 - 44
/** Clear air a flat label keeps either side of it. */
const GAP = 8

/** `null` is a chart that has not been measured yet, `undefined` the default. */
function build(
  categories: string[],
  overrides: Partial<AxisChartConfig> = {},
  measured: number | null = WIDTH,
) {
  const width = measured ?? undefined
  const config: AxisChartConfig = {
    type: 'bar',
    data: categories.map((month, i) => ({ month, sales: i })),
    xAxis: { key: 'month', type: 'category' },
    series: [{ name: 'sales' }],
    ...overrides,
  }
  return buildAxisChartOption(config, { theme, width }) as any
}

/** The category axis' labels, whichever chart axis it landed on. */
const labelsOf = (option: any, horizontal = false) =>
  (horizontal ? option.yAxis : option.xAxis).axisLabel

/** A label of `chars` letters, every one the same width in the fallback table. */
const label = (chars: number) => 'n'.repeat(chars)

/** `count` categories of that label, which is what sets the slot width. */
const repeat = (count: number, chars: number) =>
  Array.from({ length: count }, () => label(chars))

/** The longest such label that draws inside a slot, its clear air included. */
function widestFlat(slot: number) {
  let chars = 1
  while (
    estimateTextWidth(label(chars + 1), AXIS_LABEL_FONT_SIZE) + GAP <=
    slot
  ) {
    chars++
  }
  return chars
}

describe('category labels that fit', () => {
  it('leaves a fitting axis alone: no rotation, no cap, label as it stands', () => {
    const axisLabel = labelsOf(build(['Jan', 'Feb', 'Mar']))
    expect(axisLabel.rotate).toBeUndefined()
    expect(axisLabel.width).toBeUndefined()
    expect(axisLabel.overflow).toBeUndefined()
    expect(axisLabel.formatter('Jan')).toBe('Jan')
  })

  it('leaves the axis alone until the chart has been measured', () => {
    const axisLabel = labelsOf(build(repeat(20, 30), {}, null))
    expect(axisLabel.rotate).toBeUndefined()
    expect(axisLabel.width).toBeUndefined()
  })
})

describe('crowded category labels', () => {
  it('tilts the axis and caps how far a label reaches', () => {
    const axisLabel = labelsOf(build(repeat(8, 20)))
    expect(axisLabel.rotate).toBe(45)
    expect(axisLabel.width).toBe(88)
    expect(axisLabel.overflow).toBe('truncate')
  })

  it('middle-truncates a tilted label to that cap', () => {
    const { formatter, width } = labelsOf(build(repeat(8, 20)))
    const truncated = formatter('Referral Partners and Affiliate Network')
    expect(truncated).toMatch(/^Refer.*….*work$/)
    expect(
      estimateTextWidth(truncated, AXIS_LABEL_FONT_SIZE),
    ).toBeLessThanOrEqual(width)
    // A label already inside the cap is drawn as it stands.
    expect(formatter('Outbound')).toBe('Outbound')
  })

  it('leans the other way in RTL, where the value axis is', () => {
    expect(labelsOf(build(repeat(8, 20), { dir: 'rtl' })).rotate).toBe(-45)
  })

  it('shortens the cap as the categories crowd in', () => {
    const crowded = labelsOf(build(repeat(60, 16)))
    expect(crowded.rotate).toBe(45)
    // The room beside the leading tick is its half slot plus the column the
    // value axis holds open, and at 60 categories that half slot is nothing.
    expect(crowded.width).toBe(58)
    // Whatever still collides at that spacing is thinned out, as before.
    expect(crowded.hideOverlap).toBe(true)
    expect(crowded.showMaxLabel).toBe(true)
  })

  it('keeps a wide chart flat with the same labels', () => {
    expect(labelsOf(build(repeat(8, 20), {}, 900)).rotate).toBeUndefined()
    expect(labelsOf(build(repeat(8, 20))).rotate).toBe(45)
  })
})

describe('long category labels with room around them', () => {
  it('shortens them where they stand rather than tilting the axis', () => {
    const axisLabel = labelsOf(build(repeat(3, 40)))
    expect(axisLabel.rotate).toBeUndefined()
    // A slot of its own is worth more than a diagonal: 176px of text flat
    // against the 88px a tilted label could carry.
    expect(axisLabel.width).toBe(176)
    expect(axisLabel.formatter(label(40))).toMatch(/^n+…n+$/)
  })

  it('leaves the short labels of the axis untouched', () => {
    const axisLabel = labelsOf(
      build(['Jan', 'Feb', 'Mar', 'Direct Enterprise Renewals', 'May']),
    )
    expect(axisLabel.rotate).toBeUndefined()
    expect(axisLabel.formatter('Jan')).toBe('Jan')
    expect(axisLabel.formatter('Direct Enterprise Renewals')).toMatch(/…/)
  })

  it('gives a lone category the whole plot to print itself across', () => {
    const axisLabel = labelsOf(build([label(120)]))
    expect(axisLabel.rotate).toBeUndefined()
    expect(axisLabel.width).toBe(PLOT - GAP)
  })
})

describe('the slot a label is measured against', () => {
  it('gives a bar chart one slot per category', () => {
    const chars = widestFlat(PLOT / 4)
    expect(labelsOf(build(repeat(4, chars))).width).toBeUndefined()
    expect(labelsOf(build(repeat(4, chars + 1))).width).toBe(130)
  })

  it('measures a line chart between its ticks, there being no slot', () => {
    // Points sit on the dividers, so four categories leave three gaps — wider
    // than the four slots a bar chart divides the same plot into.
    const line = { type: 'line' as const }
    const chars = widestFlat(PLOT / 3)
    expect(labelsOf(build(repeat(4, chars), line)).width).toBeUndefined()
    expect(labelsOf(build(repeat(4, chars))).width).toBe(130)
  })

  it('takes a second value axis out of the room first', () => {
    const dual = {
      series: [{ name: 'sales' }, { name: 'rate', axis: 'y2' as const }],
    }
    const chars = widestFlat(PLOT / 4)
    expect(labelsOf(build(repeat(4, chars))).width).toBeUndefined()
    expect(labelsOf(build(repeat(4, chars), dual)).width).toBe(119)
  })

  it('measures the label the caller formats, not the raw value', () => {
    const long = repeat(8, 20)
    expect(labelsOf(build(long)).rotate).toBe(45)

    const shortened = build(long, {
      xAxis: {
        key: 'month',
        type: 'category',
        echartOptions: {
          axisLabel: { formatter: (value: string) => value.slice(0, 3) },
        },
      },
    })
    expect(labelsOf(shortened).rotate).toBeUndefined()
    expect(labelsOf(shortened).width).toBeUndefined()
  })
})

describe('category axes that never tilt', () => {
  it('keeps a row chart flat and capped to its column', () => {
    const axisLabel = labelsOf(build(repeat(8, 20), { horizontal: true }), true)
    expect(axisLabel.rotate).toBeUndefined()
    expect(axisLabel.width).toBe(192)
    expect(axisLabel.overflow).toBe('truncate')
  })

  it('keeps a row chart flat however many categories it stacks', () => {
    const axisLabel = labelsOf(
      build(repeat(60, 16), { horizontal: true }),
      true,
    )
    expect(axisLabel.rotate).toBeUndefined()
    expect(axisLabel.width).toBe(192)
  })

  it('keeps a time axis flat, its ticks and levels being echarts’ to pick', () => {
    const option = build([], {
      data: Array.from({ length: 40 }, (_, i) => ({
        month: new Date(2021, i, 1),
        sales: i,
      })),
      xAxis: { key: 'month' },
    })
    const { rotate, width, formatter, rich } = labelsOf(option)
    expect(option.xAxis.type).toBe('time')
    expect(rotate).toBeUndefined()
    expect(width).toBeUndefined()
    // The levelled labels survive: a year opening a run of months still heads it.
    expect(formatter('2021-03-01')).toBe('Mar')
    expect(formatter('2021-01-01', 0, { level: 1 })).toBe('{primary|2021}')
    expect(rich.primary.fontWeight).toBe(600)
  })
})

describe('category labels measured without a DOM', () => {
  it('decides from the character table when there is nothing to measure in', () => {
    // The option builders run under node here, which is the SSR path too.
    expect(typeof document).toBe('undefined')

    const slot = PLOT / 5
    const chars = widestFlat(slot)
    expect(
      estimateTextWidth(label(chars), AXIS_LABEL_FONT_SIZE) + GAP,
    ).toBeLessThanOrEqual(slot)
    expect(
      estimateTextWidth(label(chars + 1), AXIS_LABEL_FONT_SIZE) + GAP,
    ).toBeGreaterThan(slot)

    expect(labelsOf(build(repeat(5, chars))).width).toBeUndefined()
    expect(labelsOf(build(repeat(5, chars + 1))).width).toBe(102)
  })
})

import { describe, expect, it } from 'vitest'
import { buildAxisChartOption } from './axisChartOptions'
import { AXIS_LABEL_FONT_SIZE } from './axisChartCommon'
import { estimateTextWidth, formatValue } from './format'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig } from './types'

/**
 * How a category axis lays its labels out when they stop fitting flat. There is
 * no angle prop: it follows from the width the chart was measured at and the
 * width of the labels themselves.
 */

const tokens: ChartTokens = {
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
/** The value every row carries, which is what the value axis has to print. */
const VALUE = 1
/** What one value axis takes: the widest tick it prints, and its margin. */
const valueAxis = (...ends: number[]) =>
  Math.ceil(
    Math.max(
      ...ends.map((end) =>
        estimateTextWidth(formatValue(end, 1, true), AXIS_LABEL_FONT_SIZE),
      ),
    ),
  ) + 8
/**
 * `width - 2 * EDGE_PAD - the value axis`: the room the categories share. Every
 * case plots the same one-digit value, so the column it prints is one number
 * here rather than a term in each expectation.
 */
const PLOT = WIDTH - 4 - valueAxis(VALUE)
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
    data: categories.map((month) => ({ month, sales: VALUE })),
    xAxis: { key: 'month', type: 'category' },
    series: [{ name: 'sales' }],
    ...overrides,
  }
  return buildAxisChartOption(config, { tokens, width }) as any
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

  it('keeps the whole tilt budget however crowded the axis is', () => {
    const crowded = labelsOf(build(repeat(60, 16)))
    expect(crowded.rotate).toBe(45)
    // Two tilted labels run parallel, so a long one reaches further down rather
    // than into its neighbour, and echarts holds open the room the leading one
    // needs past the plot. Crowding costs the axis nothing it could have said.
    expect(crowded.width).toBe(88)
    expect(labelsOf(build(repeat(8, 20))).width).toBe(88)
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
    // A slot of its own is worth more than a diagonal: 185px of text flat
    // against the 88px a tilted label could carry.
    expect(axisLabel.width).toBe(185)
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
    expect(labelsOf(build(repeat(4, chars + 1))).width).toBe(137)
  })

  it('measures a line chart between its ticks, there being no slot', () => {
    // Points sit on the dividers, so four categories leave three gaps — wider
    // than the four slots a bar chart divides the same plot into.
    const line = { type: 'line' as const }
    const chars = widestFlat(PLOT / 3)
    expect(labelsOf(build(repeat(4, chars), line)).width).toBeUndefined()
    expect(labelsOf(build(repeat(4, chars))).width).toBe(137)
  })

  it('takes a second value axis out of the room first', () => {
    const dual = {
      series: [{ name: 'sales' }, { name: 'rate', axis: 'y2' as const }],
    }
    // Long enough to be capped either way, so the two caps are the comparison.
    const long = repeat(4, 60)
    const one = labelsOf(build(long)).width
    const two = labelsOf(build(long, dual)).width
    expect(one).toBe(Math.floor(PLOT / 4 - GAP))
    expect(two).toBe(
      Math.floor((WIDTH - 4 - valueAxis(VALUE) - valueAxis(0)) / 4 - GAP),
    )
    expect(two).toBeLessThan(one)
  })

  it('reads the value axis off the numbers it will print', () => {
    // Millions print a wider tick than single digits, and the categories divide
    // up what is left — so the same labels have less room beside the larger
    // series. A constant would have read both charts the same.
    const chars = widestFlat(PLOT / 4)
    expect(labelsOf(build(repeat(4, chars))).width).toBeUndefined()

    const millions = {
      data: repeat(4, chars).map((month) => ({ month, sales: 12_345_678 })),
    }
    expect(labelsOf(build(repeat(4, chars), millions)).width).toBe(
      Math.floor((WIDTH - 4 - valueAxis(0, 12_345_678)) / 4 - GAP),
    )
  })

  it('reads the tick the value axis is told to print', () => {
    // A currency or a spelled-out number holds open several times the width of
    // the compact tick the axis would print itself, and the categories only get
    // what is left.
    const wide = label(12)
    const formatted = {
      yAxis: { echartOptions: { axisLabel: { formatter: () => wide } } },
    }
    const chars = widestFlat(PLOT / 4)
    expect(labelsOf(build(repeat(4, chars))).width).toBeUndefined()

    const column = Math.ceil(estimateTextWidth(wide, AXIS_LABEL_FONT_SIZE)) + 8
    expect(labelsOf(build(repeat(4, chars), formatted)).width).toBe(
      Math.floor((WIDTH - 4 - column) / 4 - GAP),
    )
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
    expect(labelsOf(build(repeat(5, chars + 1))).width).toBe(
      Math.floor(slot - GAP),
    )
  })
})

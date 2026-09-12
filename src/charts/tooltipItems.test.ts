import { describe, expect, it, vi } from 'vitest'
import { buildAxisChartOption } from './axisChartOptions'
import { normalizeAxisChartProps } from './seriesData'
import { buildTooltipItems, type TooltipItemsArgs } from './tooltipItems'
import type { ChartTokens } from './tokens'
import type { AxisChartProps, ChartTooltipItem } from './types'

// A rate beside the count behind it: two units, which is the case
// `tooltipColumns` exists for. `orders` is never drawn — it only prints in the
// tooltip.
const ROW = { month: 'Jan', conversion: 12, refund_rate: 3, orders: 1840 }

function items(overrides: Partial<TooltipItemsArgs> = {}): ChartTooltipItem[] {
  return buildTooltipItems({
    row: ROW,
    index: 0,
    series: [{ name: 'conversion' }, { name: 'refund_rate' }],
    hiddenSeries: [],
    colors: { conversion: '#111111', refund_rate: '#222222' },
    formatSeries: (_series, value) => `${value}%`,
    tooltipColumns: [{ name: 'orders', label: 'Orders' }],
    ...overrides,
  })
}

const labels = (rows: ChartTooltipItem[]) => rows.map((row) => row.label)

describe('a tooltip-only column', () => {
  it('prints in the tooltip', () => {
    expect(items().find((row) => row.name === 'orders')).toMatchObject({
      label: 'Orders',
      value: 1840,
      formattedValue: '1,840',
      kind: 'column',
    })
  })

  it('carries no color, so nothing invites the reader to find it on the plot', () => {
    expect(items().find((row) => row.name === 'orders')?.color).toBeUndefined()
  })

  it('prints after every series, whatever its magnitude', () => {
    // 1840 is the largest number in the row. Sorted among the series it would
    // lead the tooltip, which would read as the biggest contributor.
    expect(labels(items())).toEqual(['Conversion', 'Refund Rate', 'Orders'])
  })

  it('holds the order the author gave, rather than being ranked', () => {
    const rows = items({
      tooltipColumns: [
        { name: 'orders', label: 'Orders' },
        { name: 'refunds', label: 'Refunds' },
      ],
      row: { ...ROW, refunds: 9000 },
    })
    expect(labels(rows).slice(-2)).toEqual(['Orders', 'Refunds'])
  })

  it('survives a legend toggle that hides a series', () => {
    const rows = items({ hiddenSeries: ['conversion'] })
    expect(labels(rows)).toEqual(['Refund Rate', 'Orders'])
  })

  it('takes its format from its own config, not from an axis', () => {
    const rows = items({
      tooltipColumns: [
        {
          name: 'orders',
          label: 'Orders',
          format: (value) => `${value} orders`,
        },
      ],
    })
    // `formatSeries` prints a percent, because the series sit on a rate axis.
    // A column sits on no axis, so it never reaches that formatter.
    expect(rows.at(-1)?.formattedValue).toBe('1840 orders')
  })

  it('carries a text attribute as well as a number', () => {
    const rows = items({
      row: { ...ROW, category: 'Outerwear' },
      tooltipColumns: [{ name: 'category', label: 'Category' }],
    })
    expect(rows.at(-1)).toMatchObject({
      value: 'Outerwear',
      formattedValue: 'Outerwear',
    })
  })

  it('drops a blank cell rather than printing an empty row', () => {
    const rows = items({
      row: { ...ROW, orders: null, target: '' },
      tooltipColumns: [
        { name: 'orders', label: 'Orders' },
        { name: 'target', label: 'Target' },
      ],
    })
    expect(labels(rows)).toEqual(['Conversion', 'Refund Rate'])
  })

  it('keeps a zero, which is a reading like any other', () => {
    const rows = items({ row: { ...ROW, orders: 0 } })
    expect(rows.at(-1)?.formattedValue).toBe('0')
  })
})

describe('the series rows are untouched by it', () => {
  it('still ranks the series by magnitude', () => {
    const rows = items({ row: { ...ROW, conversion: 1, refund_rate: 50 } })
    expect(labels(rows)).toEqual(['Refund Rate', 'Conversion', 'Orders'])
  })

  it('marks a series row as one, so a caller can tell the two apart', () => {
    expect(items().map((row) => row.kind)).toEqual([
      'series',
      'series',
      'column',
    ])
  })
})

// The claim these guard is that a column reaches the tooltip and nowhere else.
// `normalizeAxisChartProps` keeps it out of the config, so no option builder
// can read it even by mistake.

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  sequential: ['#000011', '#000022', '#000033', '#000044', '#000055'],
  diverging: ['#001100', '#002200', '#003300'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  gridline: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  backdrop: '#ffffff',
}

function props(overrides: Partial<AxisChartProps> = {}): AxisChartProps {
  return {
    data: [
      { month: 'Jan', conversion: 12, orders: 1840 },
      { month: 'Feb', conversion: 14, orders: 2100 },
    ],
    x: 'month',
    y: ['conversion'],
    ...overrides,
  }
}

function optionFor(overrides: Partial<AxisChartProps> = {}) {
  const { config } = normalizeAxisChartProps(props(overrides))
  return buildAxisChartOption({ ...config, type: 'bar' }, { tokens }) as any
}

describe('what a tooltip-only column is kept out of', () => {
  it('is not a series the config carries', () => {
    const { config, tooltipColumns } = normalizeAxisChartProps(
      props({ tooltipColumns: [{ name: 'orders' }] }),
    )
    expect(config.series.map((series) => series.name)).toEqual(['conversion'])
    expect(tooltipColumns).toEqual([{ name: 'orders', label: 'Orders' }])
  })

  it('is not drawn: the option carries the series alone', () => {
    const drawn = optionFor({ tooltipColumns: [{ name: 'orders' }] })
    expect(drawn.series.map((series: any) => series.name)).toEqual([
      'conversion',
    ])
  })

  it('does not move the value axis', () => {
    // 2100 is an order of magnitude over the largest drawn value. An axis that
    // read it would put every bar in the bottom tenth of the plot.
    const extent = (option: any) => [option.yAxis.min, option.yAxis.max]
    expect(extent(optionFor({ tooltipColumns: [{ name: 'orders' }] }))).toEqual(
      extent(optionFor()),
    )
  })

  it('falls back to the column name when the entry names no label', () => {
    const { tooltipColumns } = normalizeAxisChartProps(
      props({ tooltipColumns: [{ name: 'orders' }] }),
    )
    expect(tooltipColumns[0].label).toBe('Orders')
  })

  it('survives the pivot that long data goes through', () => {
    // `pivot` rebuilds each row as one x plus one column per group, so a column
    // it does not carry is gone before the tooltip ever reads it.
    const { config } = normalizeAxisChartProps({
      data: [
        { month: 'Jan', region: 'North', conversion: 12, orders: 1840 },
        { month: 'Jan', region: 'South', conversion: 9, orders: 1840 },
        { month: 'Feb', region: 'North', conversion: 14, orders: 2100 },
      ],
      x: 'month',
      y: 'conversion',
      series: 'region',
      tooltipColumns: [{ name: 'orders' }],
    })
    expect(config.data.map((row) => row.orders)).toEqual([1840, 2100])
  })

  it('reads a carried column per category, not per group', () => {
    // One tooltip row is printed for the column, so one value per category is
    // all there is room for. The first row to reach a category decides it.
    const { config } = normalizeAxisChartProps({
      data: [
        { month: 'Jan', region: 'North', conversion: 12, orders: 900 },
        { month: 'Jan', region: 'South', conversion: 9, orders: 940 },
      ],
      x: 'month',
      y: 'conversion',
      series: 'region',
      tooltipColumns: [{ name: 'orders' }],
    })
    expect(config.data).toHaveLength(1)
    expect(config.data[0].orders).toBe(900)
  })

  it('drops a column a series name has taken, rather than printing the measure', () => {
    // Long data flattens every group onto one row, so a group value equal to a
    // column's name lands on the same key. Keeping the column would print the
    // plotted measure under the column's label.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { config, tooltipColumns } = normalizeAxisChartProps({
      data: [
        { month: 'Jan', region: 'orders', sales: 12, orders: 1840 },
        { month: 'Jan', region: 'South', sales: 9, orders: 1840 },
      ],
      x: 'month',
      y: 'sales',
      series: 'region',
      tooltipColumns: [{ name: 'orders' }],
    })
    // The plot keeps the key: the series is what the reader can point at.
    expect(config.data[0].orders).toBe(12)
    expect(tooltipColumns).toEqual([])
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it('keeps a column whose name no series has taken', () => {
    const { tooltipColumns } = normalizeAxisChartProps({
      data: [{ month: 'Jan', region: 'North', sales: 12, orders: 1840 }],
      x: 'month',
      y: 'sales',
      series: 'region',
      tooltipColumns: [{ name: 'orders' }],
    })
    expect(tooltipColumns).toEqual([{ name: 'orders', label: 'Orders' }])
  })

  it('takes the label the entry gives', () => {
    const { tooltipColumns } = normalizeAxisChartProps(
      props({ tooltipColumns: [{ name: 'orders', label: 'Orders placed' }] }),
    )
    expect(tooltipColumns[0].label).toBe('Orders placed')
  })
})

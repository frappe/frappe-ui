import { describe, expect, it } from 'vitest'
import { applyAxisFormatters } from './axisFormat'
import { buildAxisChartOption } from './axisChartOptions'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig } from './types'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  sequential: ['#000011', '#000022', '#000033'],
  diverging: ['#001100', '#002200', '#003300'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  gridline: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  backdrop: '#ffffff',
}

function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'bar',
    data: [
      { month: 'Jan', sales: 10, refunds: 2 },
      { month: 'Feb', sales: 20, refunds: 4 },
    ],
    xAxis: { key: 'month', type: 'category' },
    series: [{ name: 'sales' }, { name: 'refunds', axis: 'y2' }],
    ...overrides,
  }
}

const currency = (value: number) => `$${value}`

/** As a chart does it: formats applied to the config, then built. */
function build(
  formats: Parameters<typeof applyAxisFormatters>[1] = {},
  overrides: Partial<AxisChartConfig> = {},
) {
  return buildAxisChartOption(applyAxisFormatters(config(overrides), formats), {
    tokens,
  }) as any
}

describe('applyAxisFormatters', () => {
  it('formats the category axis labels', () => {
    expect(
      build({ x: (value) => `[${value}]` }).xAxis.axisLabel.formatter('Jan'),
    ).toBe('[Jan]')
  })

  describe('on a time axis', () => {
    const dates = [
      { month: '2025-01-01', sales: 10, refunds: 2 },
      { month: '2025-02-01', sales: 20, refunds: 4 },
      { month: '2025-03-01', sales: 15, refunds: 3 },
    ]
    const timeAxis = {
      key: 'month',
      type: 'time' as const,
      timeGrain: 'month' as const,
    }

    it('keeps the levelled tick labels', () => {
      const { formatter } = build(
        { x: (value) => `[${value}]` },
        { data: dates, xAxis: timeAxis },
      ).xAxis.axisLabel
      expect(formatter('2025-02-01')).toBe('Feb')
      expect(formatter('2025-01-01', 0, { level: 1 })).toBe('{primary|2025}')
    })

    it('keeps them when the type is inferred from the dates', () => {
      const { formatter } = build(
        { x: (value) => `[${value}]` },
        { data: dates, xAxis: { key: 'month' } },
      ).xAxis.axisLabel
      expect(formatter('2025-02-01')).toBe('Feb')
    })

    it('still takes the value axis formats', () => {
      const option = build(
        { x: (value) => `[${value}]`, y: currency },
        { data: dates, xAxis: timeAxis },
      )
      expect(option.yAxis[0].axisLabel.formatter(10)).toBe('$10')
    })

    it('lets an explicit echartOptions formatter set the ticks', () => {
      const option = build(
        { x: (value) => `[${value}]` },
        {
          data: dates,
          xAxis: {
            ...timeAxis,
            echartOptions: { axisLabel: { formatter: () => 'override' } },
          },
        },
      )
      expect(option.xAxis.axisLabel.formatter('2025-02-01')).toBe('override')
    })
  })

  it('formats each value axis with its own format', () => {
    const option = build({ y: currency, y2: (v) => `${v}%` })
    expect(option.yAxis[0].axisLabel.formatter(10)).toBe('$10')
    expect(option.yAxis[1].axisLabel.formatter(10)).toBe('10%')
  })

  it('leaves the default axis label formatter in place without a format', () => {
    expect(build().yAxis[0].axisLabel.formatter(1500)).toBe('1.5K')
  })

  it('hands the formatter only the value, not the tick index', () => {
    const option = build({ x: (...args: any[]) => JSON.stringify(args) })
    expect(option.xAxis.axisLabel.formatter('Jan', 3)).toBe('["Jan"]')
  })

  it('lets an explicit echartOptions formatter win over format', () => {
    const option = build(
      { y: currency },
      {
        yAxis: {
          echartOptions: { axisLabel: { formatter: () => 'override' } },
        },
      },
    )
    expect(option.yAxis[0].axisLabel.formatter(10)).toBe('override')
  })

  it('keeps the rest of the axis echartOptions, and the config it was given', () => {
    const base = config({
      yAxis: { echartOptions: { axisLabel: { color: 'red' }, min: 0 } },
    })
    const option = buildAxisChartOption(
      applyAxisFormatters(base, { y: currency }),
      {
        tokens,
      },
    ) as any

    expect(option.yAxis[0].axisLabel.color).toBe('red')
    expect(option.yAxis[0].min).toBe(0)
    // Charts re-apply formats on every render, so the config stays untouched.
    expect(base.yAxis?.echartOptions?.axisLabel.formatter).toBeUndefined()
  })
})

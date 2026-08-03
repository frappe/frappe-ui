import { describe, expect, it } from 'vitest'
import { applyAxisFormatters } from './axisFormat'
import { buildBarChartOption } from './barChartOptions'
import type { ChartTheme } from './theme'
import type { BarChartConfig } from './types'

const theme: ChartTheme = {
  palette: ['#111111', '#222222', '#333333'],
  sequential: ['#000011', '#000022', '#000033'],
  diverging: ['#001100', '#002200', '#003300'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

function config(overrides: Partial<BarChartConfig> = {}): BarChartConfig {
  return {
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

describe('applyAxisFormatters', () => {
  it('returns the config untouched when no axis formats', () => {
    const base = config()
    expect(applyAxisFormatters(base, {})).toBe(base)
  })

  it('sets an axisLabel formatter on each axis that has a format', () => {
    const next = applyAxisFormatters(config(), {
      x: (value) => `x:${value}`,
      y: currency,
      y2: (value) => `${value}%`,
    })
    expect(next.xAxis.echartOptions?.axisLabel.formatter('Jan')).toBe('x:Jan')
    expect(next.yAxis?.echartOptions?.axisLabel.formatter(10)).toBe('$10')
    expect(next.y2Axis?.echartOptions?.axisLabel.formatter(10)).toBe('10%')
  })

  it('creates the axis entry when the config left it out', () => {
    const next = applyAxisFormatters(config(), { y: currency })
    expect(next.yAxis?.echartOptions?.axisLabel.formatter(1)).toBe('$1')
    expect(next.y2Axis).toBeUndefined()
  })

  it('leaves the axes without a format alone', () => {
    const base = config({ xAxis: { key: 'month' } })
    const next = applyAxisFormatters(base, { y: currency })
    expect(next.xAxis).toBe(base.xAxis)
  })

  it('hands the formatter only the value, not the tick index', () => {
    const next = applyAxisFormatters(config(), {
      x: (...args: any[]) => JSON.stringify(args),
    })
    expect(next.xAxis.echartOptions?.axisLabel.formatter('Jan', 3)).toBe(
      '["Jan"]',
    )
  })

  it('keeps other echartOptions on the axis', () => {
    const base = config({
      yAxis: { echartOptions: { axisLabel: { color: 'red' }, min: 0 } },
    })
    const next = applyAxisFormatters(base, { y: currency })
    expect(next.yAxis?.echartOptions?.axisLabel.color).toBe('red')
    expect(next.yAxis?.echartOptions?.min).toBe(0)
    expect(base.yAxis?.echartOptions?.axisLabel.formatter).toBeUndefined()
  })

  it('lets an explicit echartOptions formatter win over format', () => {
    const next = applyAxisFormatters(
      config({
        yAxis: { echartOptions: { axisLabel: { formatter: () => 'override' } } },
      }),
      { y: currency },
    )
    expect(next.yAxis?.echartOptions?.axisLabel.formatter(10)).toBe('override')
  })
})

describe('applyAxisFormatters: through the option builder', () => {
  function build(config: BarChartConfig) {
    return buildBarChartOption(config, { theme }) as any
  }

  it('formats the category axis labels', () => {
    const option = build(
      applyAxisFormatters(config(), { x: (value) => `[${value}]` }),
    )
    expect(option.xAxis.axisLabel.formatter('Jan')).toBe('[Jan]')
  })

  it('formats each value axis with its own format', () => {
    const option = build(
      applyAxisFormatters(config(), { y: currency, y2: (v) => `${v}%` }),
    )
    expect(option.yAxis[0].axisLabel.formatter(10)).toBe('$10')
    expect(option.yAxis[1].axisLabel.formatter(10)).toBe('10%')
  })

  it('leaves the default axis label formatter in place without a format', () => {
    const option = build(config())
    expect(option.yAxis[0].axisLabel.formatter(1500)).toBe('1.5K')
  })
})

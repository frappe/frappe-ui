/**
 * @vitest-environment jsdom
 */
import { createApp, defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { useAxisChart } from './useAxisChart'
import { buildAxisChartOption } from '../axisChartOptions'
import type { AxisChartConfig, ChartDatapointEvent } from '../types'

/**
 * The composable with no plot element under it, so echarts never initialises
 * and what is left is what a reader on the keyboard drives. The pointer path
 * hits the same rows through the option builder.
 */
function setup(config: AxisChartConfig, hiddenSeries?: Ref<string[]>) {
  const selected: ChartDatapointEvent[] = []
  let chart!: ReturnType<typeof useAxisChart>

  createApp(
    defineComponent({
      setup() {
        chart = useAxisChart({
          config: () => config,
          buildOption: buildAxisChartOption,
          hiddenSeries,
          onSelect: (event) => selected.push(event),
        })
        return () => h('div')
      },
    }),
  ).mount(document.createElement('div'))

  const handlers = () => chart.plotAttrs.value as Record<string, any>
  return {
    chart,
    selected,
    focus: () => handlers().onFocus(),
    press: (key: string) =>
      handlers().onKeydown({ key, preventDefault: () => {} }),
  }
}

function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'line',
    data: [
      { month: 'Jan', revenue: 10, orders: 4 },
      { month: 'Feb', revenue: '', orders: 6 },
    ],
    xAxis: { key: 'month' },
    series: [{ name: 'revenue' }],
    ...overrides,
  }
}

describe('select', () => {
  it('fires for the cell under the cursor', () => {
    const plot = setup(config())
    plot.focus()
    plot.press('Enter')
    expect(plot.selected).toEqual([
      {
        name: 'revenue',
        value: 10,
        row: { month: 'Jan', revenue: 10, orders: 4 },
      },
    ])
  })

  it('fires nothing for a cell that does not read as a number', () => {
    const plot = setup(config())
    plot.focus()
    plot.press('End')
    plot.press('Enter')
    expect(plot.selected).toEqual([])
  })

  it('holds the cursor on a series the row has no value for', () => {
    const plot = setup(
      config({ series: [{ name: 'revenue' }, { name: 'orders' }] }),
    )
    plot.focus()
    plot.press('End')
    // Feb has orders but no revenue, so crossing down reaches the series the
    // pointer could hit.
    plot.press('ArrowDown')
    plot.press('Enter')
    expect(plot.selected.map((event) => event.name)).toEqual(['orders'])
  })
})

describe('isEmpty', () => {
  it('is false while a visible series has a number somewhere', () => {
    expect(setup(config()).chart.isEmpty.value).toBe(false)
  })

  it('is true for a column key no row carries', () => {
    const plot = setup(config({ series: [{ name: 'typo' }] }))
    expect(plot.chart.isEmpty.value).toBe(true)
  })

  it('is true once the legend has switched every series off', () => {
    const hidden = ref<string[]>([])
    const plot = setup(config(), hidden)
    expect(plot.chart.isEmpty.value).toBe(false)
    hidden.value = ['revenue']
    expect(plot.chart.isEmpty.value).toBe(true)
  })
})

describe('dir', () => {
  afterEach(() => {
    document.documentElement.dir = ''
  })

  it('follows the document when the page flips direction after mount', async () => {
    const plot = setup(config())
    expect(plot.chart.dir.value).toBe('ltr')

    document.documentElement.dir = 'rtl'
    // The observer reports on a microtask; the computed invalidates after it.
    await Promise.resolve()
    await nextTick()

    expect(plot.chart.dir.value).toBe('rtl')
  })
})

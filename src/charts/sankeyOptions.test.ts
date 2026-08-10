import { describe, expect, it, vi } from 'vitest'
import { buildSankeyGraph, buildSankeyOption } from './sankeyOptions'
import { paletteColors, type ChartTokens } from './tokens'
import type { SankeyChartConfig } from './types'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333', '#444444'],
  sequential: ['#0a0a0a', '#5a5a5a', '#cccccc'],
  diverging: ['#0000ff', '#ffffff', '#ff0000'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

function config(overrides: Partial<SankeyChartConfig> = {}): SankeyChartConfig {
  return {
    data: [
      { from: 'Search', to: 'Trial', signups: 120 },
      { from: 'Referral', to: 'Trial', signups: 80 },
      { from: 'Trial', to: 'Paid', signups: 60 },
      { from: 'Trial', to: 'Churned', signups: 140 },
    ],
    sourceColumn: 'from',
    targetColumn: 'to',
    valueColumn: 'signups',
    ...overrides,
  }
}

function graph(overrides: Partial<SankeyChartConfig> = {}) {
  return buildSankeyGraph(config(overrides), { tokens })
}

function build(overrides: Partial<SankeyChartConfig> = {}) {
  return buildSankeyOption(config(overrides), { tokens }) as any
}

/** Every warning this module raises is dev-only, so every test that expects one
 *  has to silence the console it writes to. */
function captureWarnings(run: () => void) {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  run()
  const calls = warn.mock.calls.map((call) => String(call[0]))
  warn.mockRestore()
  return calls
}

describe('buildSankeyGraph', () => {
  it('takes the nodes as the union of source and target, source first', () => {
    expect(graph().nodes.map((node) => node.name)).toEqual([
      'Search',
      'Trial',
      'Referral',
      'Paid',
      'Churned',
    ])
  })

  it('names a node once however many links touch it', () => {
    const built = graph({
      data: [
        { from: 'A', to: 'B', signups: 1 },
        { from: 'A', to: 'C', signups: 2 },
        { from: 'B', to: 'C', signups: 3 },
      ],
    })

    expect(built.nodes.map((node) => node.name)).toEqual(['A', 'B', 'C'])
  })

  it('keeps one link per row, in row order', () => {
    expect(
      graph().links.map((link) => [link.source, link.target, link.value]),
    ).toEqual([
      ['Search', 'Trial', 120],
      ['Referral', 'Trial', 80],
      ['Trial', 'Paid', 60],
      ['Trial', 'Churned', 140],
    ])
  })

  it('carries the row behind each link, for the click event', () => {
    expect(graph().links[0].row).toEqual({
      from: 'Search',
      to: 'Trial',
      signups: 120,
    })
  })

  it('coerces the value column', () => {
    const built = graph({
      data: [
        { from: 'A', to: 'B', signups: '12' },
        { from: 'A', to: 'C', signups: null },
        { from: 'A', to: 'D', signups: 'nope' },
      ],
    })

    expect(built.links).toHaveLength(1)
    expect(built.links[0].value).toBe(12)
    // A row that drew no band brings no node with it.
    expect(built.nodes.map((node) => node.name)).toEqual(['A', 'B'])
  })

  it('drops a negative flow, which has no band to draw', () => {
    const built = graph({
      data: [
        { from: 'A', to: 'B', signups: -5 },
        { from: 'A', to: 'C', signups: 5 },
      ],
    })

    expect(built.links.map((link) => link.target)).toEqual(['C'])
  })

  it('reads a blank node name as (Blank)', () => {
    const built = graph({ data: [{ from: null, to: 'Trial', signups: 3 }] })

    expect(built.nodes.map((node) => node.name)).toEqual(['(Blank)', 'Trial'])
    expect(built.links[0]).toMatchObject({
      source: '(Blank)',
      target: 'Trial',
    })
  })

  it('measures a node by the larger of what arrives and what leaves', () => {
    const built = graph()
    const byName = new Map(built.nodes.map((node) => [node.name, node.value]))

    expect(byName.get('Search')).toBe(120)
    // 200 in, 200 out.
    expect(byName.get('Trial')).toBe(200)
    expect(byName.get('Paid')).toBe(60)
  })

  it('colors nodes from the categorical palette by default', () => {
    const built = graph()
    const colors = paletteColors('categorical', tokens, built.nodes.length)

    expect(built.nodes.map((node) => node.color)).toEqual(colors)
  })

  it('reads a named palette off the config', () => {
    const built = graph({ palette: 'sequential' })

    expect(built.nodes.map((node) => node.color)).toEqual(
      paletteColors('sequential', tokens, built.nodes.length),
    )
  })

  it('cycles an explicit palette in the order it was written', () => {
    const built = graph({ palette: ['#aaaaaa', '#bbbbbb'] })

    expect(built.nodes.map((node) => node.color)).toEqual([
      '#aaaaaa',
      '#bbbbbb',
      '#aaaaaa',
      '#bbbbbb',
      '#aaaaaa',
    ])
  })

  it('paints a link in its source node color', () => {
    const built = graph()
    const byName = new Map(built.nodes.map((node) => [node.name, node.color]))

    for (const link of built.links) {
      expect(link.color).toBe(byName.get(link.source))
    }
  })

  it('drops a self link and says so', () => {
    let built!: ReturnType<typeof graph>
    const warnings = captureWarnings(() => {
      built = graph({
        data: [
          { from: 'A', to: 'A', signups: 10 },
          { from: 'A', to: 'B', signups: 5 },
        ],
      })
    })

    expect(built.links.map((link) => link.target)).toEqual(['B'])
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('[frappe-ui]')
    expect(warnings[0]).toContain('"A" → "A"')
  })

  it('drops the link that closes a cycle, keeping the ones before it', () => {
    let built!: ReturnType<typeof graph>
    const warnings = captureWarnings(() => {
      built = graph({
        data: [
          { from: 'A', to: 'B', signups: 1 },
          { from: 'B', to: 'C', signups: 2 },
          { from: 'C', to: 'A', signups: 3 },
        ],
      })
    })

    expect(built.links.map((link) => [link.source, link.target])).toEqual([
      ['A', 'B'],
      ['B', 'C'],
    ])
    expect(warnings[0]).toContain('"C" → "A"')
  })

  it('leaves a diamond alone: two paths are not a cycle', () => {
    const warnings = captureWarnings(() => {
      const built = graph({
        data: [
          { from: 'A', to: 'B', signups: 1 },
          { from: 'A', to: 'C', signups: 2 },
          { from: 'B', to: 'D', signups: 3 },
          { from: 'C', to: 'D', signups: 4 },
        ],
      })
      expect(built.links).toHaveLength(4)
    })

    expect(warnings).toHaveLength(0)
  })

  it('says nothing about data that flows one way', () => {
    expect(captureWarnings(() => graph())).toHaveLength(0)
  })

  it('has nothing to draw for no rows', () => {
    const built = graph({ data: [] })

    expect(built.nodes).toEqual([])
    expect(built.links).toEqual([])
  })

  it('keeps a zero flow as a link worth nothing', () => {
    const built = graph({
      data: [
        { from: 'A', to: 'B', signups: 0 },
        { from: 'A', to: 'C', signups: 0 },
      ],
    })

    // The component reads this as its empty state: bands of no width.
    expect(built.links.every((link) => link.value === 0)).toBe(true)
    expect(built.nodes.every((node) => node.value === 0)).toBe(true)
  })
})

describe('buildSankeyOption', () => {
  it('draws one sankey series, nodes and links from the graph', () => {
    const series = build().series[0]
    const built = graph()

    expect(series.type).toBe('sankey')
    expect(series.data.map((node: any) => node.name)).toEqual(
      built.nodes.map((node) => node.name),
    )
    expect(series.links).toEqual(
      built.links.map((link) => ({
        source: link.source,
        target: link.target,
        value: link.value,
      })),
    )
  })

  it('runs left to right, ends justified, by default', () => {
    const series = build().series[0]

    expect(series.orient).toBe('horizontal')
    expect(series.nodeAlign).toBe('justify')
    // Room on the arrival end for the labels that hang off it.
    expect(series.right).toBe('10%')
    expect(series.label.position).toBe('right')
  })

  it('turns the flow downwards and the labels with it', () => {
    const series = build({ orient: 'vertical' }).series[0]

    expect(series.orient).toBe('vertical')
    // A vertical node is a wide bar, so a label beside it lands on a neighbour.
    expect(series.label.position).toBe('top')
    expect(series.right).toBe('5%')
  })

  it('pins the nodes to the end the config names', () => {
    expect(build({ nodeAlign: 'left' }).series[0].nodeAlign).toBe('left')
    expect(build({ nodeAlign: 'right' }).series[0].nodeAlign).toBe('right')
  })

  it('paints each node from the palette and holds the layout still', () => {
    const series = build().series[0]
    const built = graph()

    expect(series.data.map((node: any) => node.itemStyle.color)).toEqual(
      built.nodes.map((node) => node.color),
    )
    expect(series.draggable).toBe(false)
  })

  it('takes a link color from its source node and keeps the bands readable', () => {
    const { lineStyle } = build().series[0]

    expect(lineStyle).toMatchObject({ color: 'source', opacity: 0.4 })
    expect(lineStyle.curveness).toBeGreaterThan(0)
  })

  it('follows the whole path a hovered band belongs to', () => {
    expect(build().series[0].emphasis).toEqual({ focus: 'adjacency' })
  })

  it('labels a node with its name and what passes through it', () => {
    const series = build().series[0]

    expect(series.label.show).toBe(true)
    expect(series.label.color).toBe(tokens.dataLabel)
    expect(series.label.formatter({ name: 'Trial', value: 12400 })).toBe(
      'Trial · 12.4K',
    )
  })

  it('prints a node value through `format` when one is given', () => {
    const option = buildSankeyOption(config(), {
      tokens,
      format: (value: number) => `${value} signups`,
    }) as any

    expect(
      option.series[0].label.formatter({ name: 'Trial', value: 200 }),
    ).toBe('Trial · 200 signups')
  })

  it('merges the echarts escape hatch over the built option', () => {
    const option = build({ echartOptions: { series: [{ nodeWidth: 40 }] } })

    expect(option.series).toEqual([{ nodeWidth: 40 }])
    expect(option.animation).toBe(true)
  })

  it('merges a top-level override without touching the series', () => {
    const option = build({ echartOptions: { animation: false } })

    expect(option.animation).toBe(false)
    expect(option.series[0].type).toBe('sankey')
  })
})

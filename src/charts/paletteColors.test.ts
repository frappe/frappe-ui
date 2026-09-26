import { describe, expect, it } from 'vitest'
import { paletteColors, rampStops, type ChartTokens } from './tokens'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  // Nine stops, dark to light, like the shipped ramp.
  sequential: [
    '#0a0a0a',
    '#1a1a1a',
    '#3a3a3a',
    '#5a5a5a',
    '#8a8a8a',
    '#aaaaaa',
    '#cccccc',
    '#e0e0e0',
    '#f5f5f5',
  ],
  diverging: ['#0000ff', '#8888ff', '#ffffff', '#ff8888', '#ff0000'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  gridline: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  backdrop: '#ffffff',
}

describe('paletteColors: precedence', () => {
  it("draws in the caller's own colors when they passed a list", () => {
    expect(
      paletteColors(['#aaaaaa', '#bbbbbb'], tokens, 2, 'categorical'),
    ).toEqual(['#aaaaaa', '#bbbbbb'])
  })

  it('reads the ramp the caller named over the family default', () => {
    expect(paletteColors('categorical', tokens, 3, 'sequential')).toEqual(
      tokens.categorical,
    )
  })

  it('falls back to the ramp the chart family picked', () => {
    expect(paletteColors(undefined, tokens, 3, 'categorical')).toEqual(
      tokens.categorical,
    )
  })

  it('reads an empty list as no palette at all', () => {
    expect(paletteColors([], tokens, 2, 'categorical')).toEqual(
      tokens.categorical.slice(0, 2),
    )
    expect(rampStops([], tokens, 'sequential')).toEqual(tokens.sequential)
  })
})

describe('paletteColors: one color per thing drawn', () => {
  it("cycles the caller's list once it runs out", () => {
    expect(
      paletteColors(['#aaaaaa', '#bbbbbb'], tokens, 5, 'categorical'),
    ).toEqual(['#aaaaaa', '#bbbbbb', '#aaaaaa', '#bbbbbb', '#aaaaaa'])
  })

  it('draws nothing when there is nothing to draw', () => {
    expect(paletteColors('sequential', tokens, 0, 'categorical')).toEqual([])
    expect(paletteColors(['#aaaaaa'], tokens, 0, 'categorical')).toEqual([])
  })
})

describe('paletteColors: how a sequential ramp is spent', () => {
  const stops = (count: number) =>
    paletteColors('sequential', tokens, count).map(
      (color) => tokens.sequential.indexOf(color) + 1,
    )

  it('gives a lone series the deep end', () => {
    expect(stops(1)).toEqual([1])
  })

  it('keeps a small chart a prefix of the next size up', () => {
    expect(stops(2)).toEqual([1, 4])
    expect(stops(3)).toEqual([1, 4, 7])
  })

  it('stays inside the first seven stops up to seven series', () => {
    expect(stops(4)).toEqual([1, 3, 5, 7])
    expect(stops(5)).toEqual([1, 3, 4, 6, 7])
    expect(stops(6)).toEqual([1, 2, 3, 5, 6, 7])
    expect(stops(7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('reaches the pale stops only once the series outnumber the span', () => {
    expect(stops(8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(stops(9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('cycles once there are more series than stops', () => {
    expect(stops(10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 1])
  })

  it('runs the ramp deep to pale', () => {
    expect(paletteColors('sequential', tokens, 3)).toEqual([
      '#0a0a0a',
      '#5a5a5a',
      '#cccccc',
    ])
  })
})

describe('rampStops: the ramp itself', () => {
  it('gives the stops rather than a slot each', () => {
    expect(rampStops('sequential', tokens)).toEqual(tokens.sequential)
  })

  it('takes a diverging ramp end to end', () => {
    expect(rampStops('diverging', tokens)).toEqual(tokens.diverging)
  })

  it("takes the caller's list as the ramp, uncycled", () => {
    const colors = ['#ffffff', '#000000']
    const ramp = rampStops(colors, tokens)
    expect(ramp).toEqual(colors)
    expect(ramp).not.toBe(colors)
  })
})

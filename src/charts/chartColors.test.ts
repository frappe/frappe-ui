import { describe, expect, it } from 'vitest'
import { chartColors, paletteColors, type ChartTokens } from './tokens'

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
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

/** The sequential ramp minus the two palest stops, as every chart reads it. */
const USABLE_SEQUENTIAL = tokens.sequential.slice(0, 7)

describe('chartColors: precedence', () => {
  it("draws in the caller's own colors when they passed a list", () => {
    expect(
      chartColors(['#aaaaaa', '#bbbbbb'], tokens, {
        fallback: 'categorical',
        count: 2,
      }),
    ).toEqual(['#aaaaaa', '#bbbbbb'])
  })

  it('reads the ramp the caller named over the family default', () => {
    expect(
      chartColors('categorical', tokens, { fallback: 'sequential', count: 3 }),
    ).toEqual(tokens.categorical)
  })

  it('falls back to the ramp the chart family picked', () => {
    expect(
      chartColors(undefined, tokens, { fallback: 'categorical', count: 3 }),
    ).toEqual(tokens.categorical)
  })

  it('reads an empty list as no palette at all', () => {
    expect(
      chartColors([], tokens, { fallback: 'categorical', count: 2 }),
    ).toEqual(tokens.categorical.slice(0, 2))
    expect(
      chartColors([], tokens, { fallback: 'sequential', count: 'ramp' }),
    ).toEqual(USABLE_SEQUENTIAL)
  })
})

describe('chartColors: one color per thing drawn', () => {
  it("cycles the caller's list once it runs out", () => {
    expect(
      chartColors(['#aaaaaa', '#bbbbbb'], tokens, {
        fallback: 'categorical',
        count: 5,
      }),
    ).toEqual(['#aaaaaa', '#bbbbbb', '#aaaaaa', '#bbbbbb', '#aaaaaa'])
  })

  it('hands a named ramp out the way paletteColors does', () => {
    for (const name of ['categorical', 'sequential', 'diverging'] as const) {
      for (const count of [1, 2, 5, 12]) {
        expect(
          chartColors(name, tokens, { fallback: 'categorical', count }),
        ).toEqual(paletteColors(name, tokens, count))
      }
    }
  })

  it('draws nothing when there is nothing to draw', () => {
    expect(
      chartColors('sequential', tokens, { fallback: 'categorical', count: 0 }),
    ).toEqual([])
    expect(
      chartColors(['#aaaaaa'], tokens, { fallback: 'categorical', count: 0 }),
    ).toEqual([])
  })
})

describe('chartColors: the ramp itself', () => {
  it('gives the stops rather than a slot each', () => {
    expect(
      chartColors('sequential', tokens, {
        fallback: 'sequential',
        count: 'ramp',
      }),
    ).toEqual(USABLE_SEQUENTIAL)
  })

  it('trims the sequential stops that vanish against a card', () => {
    const ramp = chartColors(undefined, tokens, {
      fallback: 'sequential',
      count: 'ramp',
    })
    expect(ramp).not.toContain('#f5f5f5')
    expect(ramp).not.toContain('#e0e0e0')
  })

  it('takes a diverging ramp end to end', () => {
    expect(
      chartColors('diverging', tokens, {
        fallback: 'sequential',
        count: 'ramp',
      }),
    ).toEqual(tokens.diverging)
  })

  it("takes the caller's list as the ramp, uncycled", () => {
    const colors = ['#ffffff', '#000000']
    const ramp = chartColors(colors, tokens, {
      fallback: 'sequential',
      count: 'ramp',
    })
    expect(ramp).toEqual(colors)
    expect(ramp).not.toBe(colors)
  })
})

describe('chartColors: which end of the ramp leads', () => {
  it('runs a sequential ramp deep to pale by default', () => {
    expect(
      chartColors('sequential', tokens, { fallback: 'sequential', count: 3 }),
    ).toEqual(['#0a0a0a', '#5a5a5a', '#cccccc'])
  })

  it('flips a sequential ramp for a plot whose color runs with the value', () => {
    expect(
      chartColors('sequential', tokens, {
        fallback: 'sequential',
        count: 3,
        deepEnd: 'last',
      }),
    ).toEqual(['#cccccc', '#5a5a5a', '#0a0a0a'])

    expect(
      chartColors(undefined, tokens, {
        fallback: 'sequential',
        count: 'ramp',
        deepEnd: 'last',
      }),
    ).toEqual([...USABLE_SEQUENTIAL].reverse())
  })

  it('leaves a categorical set alone, having no order to reverse', () => {
    expect(
      chartColors('categorical', tokens, {
        fallback: 'sequential',
        count: 3,
        deepEnd: 'last',
      }),
    ).toEqual(tokens.categorical)
  })

  it('leaves a diverging ramp alone, its direction being its meaning', () => {
    expect(
      chartColors('diverging', tokens, {
        fallback: 'sequential',
        count: 'ramp',
        deepEnd: 'last',
      }),
    ).toEqual(tokens.diverging)
  })

  it("leaves the caller's list in the order it was written", () => {
    const colors = ['#aaaaaa', '#bbbbbb', '#cccccc']
    expect(
      chartColors(colors, tokens, {
        fallback: 'sequential',
        count: 3,
        deepEnd: 'last',
      }),
    ).toEqual(colors)
  })
})

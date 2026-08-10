import { describe, expect, it } from 'vitest'
import {
  clampToGamut,
  hexToOklch,
  inGamut,
  interpolateRamp,
  maxChroma,
  mixHue,
  normalizeHue,
  oklchToHex,
  parseHex,
  toHex,
} from './colorMath'

/** Perceptual distance between two colors, to measure banding in a ramp. */
function deltaEOk(a: string, b: string): number {
  const x = hexToOklch(a)
  const y = hexToOklch(b)
  const rad = (deg: number) => (deg * Math.PI) / 180
  return Math.hypot(
    x.l - y.l,
    x.c * Math.cos(rad(x.h)) - y.c * Math.cos(rad(y.h)),
    x.c * Math.sin(rad(x.h)) - y.c * Math.sin(rad(y.h)),
  )
}

const SAMPLES = [
  '#000000',
  '#ffffff',
  '#2283c3',
  '#6fb4e4',
  '#e8d759',
  '#ed8176',
  '#b6b6b6',
  '#0a3d18',
]

describe('hex parsing', () => {
  it('expands the three-digit form', () => {
    expect(parseHex('#0af')).toEqual(parseHex('#00aaff'))
  })

  it('accepts a missing hash', () => {
    expect(parseHex('2283c3')).toEqual(parseHex('#2283c3'))
  })

  it('rejects anything that is not a color', () => {
    expect(() => parseHex('#12345')).toThrow()
    expect(() => parseHex('rebeccapurple')).toThrow()
  })

  it('round-trips through rgb', () => {
    for (const hex of SAMPLES) expect(toHex(parseHex(hex))).toBe(hex)
  })
})

describe('oklch conversion', () => {
  it('round-trips every sample exactly at 8-bit precision', () => {
    for (const hex of SAMPLES) expect(oklchToHex(hexToOklch(hex))).toBe(hex)
  })

  it('places white and black at the ends of the lightness axis', () => {
    expect(hexToOklch('#ffffff').l).toBeCloseTo(1, 3)
    expect(hexToOklch('#000000').l).toBeCloseTo(0, 3)
  })

  it('reads greys as chroma-free, with no stray hue', () => {
    const grey = hexToOklch('#b6b6b6')
    expect(grey.c).toBeLessThan(0.001)
    expect(grey.h).toBe(0)
  })

  it('matches the published oklch of sRGB red', () => {
    const red = hexToOklch('#ff0000')
    expect(red.l).toBeCloseTo(0.6279, 3)
    expect(red.c).toBeCloseTo(0.2577, 3)
    expect(red.h).toBeCloseTo(29.23, 1)
  })
})

describe('normalizeHue', () => {
  it('wraps both ways into 0..360', () => {
    expect(normalizeHue(370)).toBeCloseTo(10)
    expect(normalizeHue(-30)).toBeCloseTo(330)
    expect(normalizeHue(360)).toBe(0)
  })
})

describe('mixHue', () => {
  it('takes the short way round the circle', () => {
    expect(mixHue(350, 10, 0.5)).toBeCloseTo(0)
    expect(mixHue(10, 350, 0.5)).toBeCloseTo(0)
  })

  it('returns the ends untouched', () => {
    expect(mixHue(200, 40, 0)).toBeCloseTo(200)
    expect(mixHue(200, 40, 1)).toBeCloseTo(40)
  })
})

describe('gamut clamping', () => {
  it('leaves an in-gamut color alone', () => {
    const blue = hexToOklch('#2283c3')
    expect(clampToGamut(blue)).toEqual(blue)
  })

  it('brings an impossible chroma back inside sRGB, holding L and H', () => {
    const wild = { l: 0.6, c: 0.4, h: 250 }
    const fixed = clampToGamut(wild)

    expect(inGamut(fixed)).toBe(true)
    expect(fixed.l).toBe(wild.l)
    expect(fixed.h).toBe(wild.h)
    expect(fixed.c).toBeLessThan(wild.c)
  })

  it('lands within a hair of the boundary, not well inside it', () => {
    const max = maxChroma(0.6, 250)
    expect(inGamut({ l: 0.6, c: max, h: 250 })).toBe(true)
    expect(inGamut({ l: 0.6, c: max + 0.002, h: 250 })).toBe(false)
  })

  it('has no room at either end of the lightness axis', () => {
    expect(maxChroma(0, 120)).toBe(0)
    expect(maxChroma(1, 120)).toBe(0)
  })

  it('reaches much further in red than in blue at the same lightness', () => {
    expect(maxChroma(0.6, 29)).toBeGreaterThan(maxChroma(0.6, 250))
  })
})

describe('interpolateRamp', () => {
  const ramp = ['#349b7a', '#efeae2', '#db432a']

  it('hands back the stops themselves at their own positions', () => {
    expect(interpolateRamp(ramp, 0)).toBe('#349b7a')
    expect(interpolateRamp(ramp, 0.5)).toBe('#efeae2')
    expect(interpolateRamp(ramp, 1)).toBe('#db432a')
  })

  it('lands a midpoint between the two stops it sits between', () => {
    const mid = hexToOklch(interpolateRamp(ramp, 0.25))
    const low = hexToOklch(ramp[0])
    const high = hexToOklch(ramp[1])

    expect(mid.l).toBeGreaterThan(low.l)
    expect(mid.l).toBeLessThan(high.l)
  })

  it('fades between families through grey, not through a third hue', () => {
    // The pale blue and pale yellow either side of an RdYlBu middle. Rotating
    // the hue between them would paint a band of green nobody put in the ramp.
    const crossing = ['#9fccf9', '#fbf1c7']
    const chroma = Array.from(
      { length: 9 },
      (_, i) => hexToOklch(interpolateRamp(crossing, i / 8)).c,
    )

    expect(Math.min(...chroma)).toBeLessThan(chroma[0])
    expect(Math.min(...chroma)).toBeLessThan(chroma[8])
    // Whatever hue the crossing carries, it must not read as a color.
    expect(hexToOklch(interpolateRamp(crossing, 0.5)).c).toBeLessThan(0.04)
  })

  it('moves in small steps rather than in bands', () => {
    const steps = Array.from({ length: 40 }, (_, i) =>
      interpolateRamp(ramp, i / 39),
    )
    const jumps = steps
      .slice(1)
      .map((hex, i) => deltaEOk(steps[i], hex))
      .sort((a, b) => b - a)

    // A banded ramp would show a handful of large jumps and nothing between.
    expect(jumps[0]).toBeLessThan(0.03)
  })

  it('clamps outside 0..1 instead of extrapolating', () => {
    expect(interpolateRamp(ramp, -2)).toBe('#349b7a')
    expect(interpolateRamp(ramp, 7)).toBe('#db432a')
  })

  it('fades through the grey of a near-neutral stop, not through a third hue', () => {
    const greyMiddle = ['#2283c3', '#f0f0f0', '#db432a']
    const quarter = hexToOklch(interpolateRamp(greyMiddle, 0.25))

    // Still blue, on its way to grey — not drifting toward the red end's hue.
    expect(Math.abs(quarter.h - hexToOklch('#2283c3').h)).toBeLessThan(12)
    expect(quarter.c).toBeLessThan(hexToOklch('#2283c3').c)
  })

  it('takes a single-stop ramp as a constant', () => {
    expect(interpolateRamp(['#2283c3'], 0.4)).toBe('#2283c3')
  })
})

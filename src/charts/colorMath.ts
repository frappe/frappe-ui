/**
 * OKLCH color math behind the chart ramps: the ramps in style.css were derived
 * with these, and `interpolateRamp` reads them back at runtime.
 *
 * OKLCH rather than HSL because lightness there is perceptual, so blending two
 * stops holds the perceived weight the ramp was authored with — something HSL
 * never manages.
 *
 * Hand-rolled rather than a color dependency: this is well-known math
 * (Ottosson's OKLab matrices) and the package ships no color library today.
 */

export type Rgb = { r: number; g: number; b: number }
/** L in 0..1, C in 0..~0.4, H in degrees 0..360. */
export type Oklch = { l: number; c: number; h: number }

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function normalizeHue(h: number): number {
  const wrapped = h % 360
  return wrapped < 0 ? wrapped + 360 : wrapped
}

export function parseHex(hex: string): Rgb {
  let value = hex.trim().replace(/^#/, '')
  if (value.length === 3) {
    value = value
      .split('')
      .map((ch) => ch + ch)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Not a hex color: ${hex}`)
  }
  const int = parseInt(value, 16)
  return {
    r: ((int >> 16) & 0xff) / 255,
    g: ((int >> 8) & 0xff) / 255,
    b: (int & 0xff) / 255,
  }
}

export function toHex({ r, g, b }: Rgb): string {
  const channel = (v: number) =>
    Math.round(clamp01(v) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)

const toGamma = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = toLinear(rgb.r)
  const g = toLinear(rgb.g)
  const b = toLinear(rgb.b)

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const c = Math.sqrt(A * A + B * B)
  // Hue is meaningless once chroma rounds to nothing; pin it at 0 so greys
  // don't carry a random hue into a blend.
  const h = c < 1e-6 ? 0 : normalizeHue((Math.atan2(B, A) * 180) / Math.PI)
  return { l: L, c, h }
}

/** May land outside sRGB; check with `inGamut` or go through `oklchToHex`. */
export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const rad = (h * Math.PI) / 180
  const A = c * Math.cos(rad)
  const B = c * Math.sin(rad)

  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3

  return {
    r: toGamma(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    g: toGamma(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    b: toGamma(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  }
}

const GAMUT_EPSILON = 1e-4

export function inGamut(color: Oklch): boolean {
  const { r, g, b } = oklchToRgb(color)
  const ok = (v: number) => v >= -GAMUT_EPSILON && v <= 1 + GAMUT_EPSILON
  return ok(r) && ok(g) && ok(b)
}

/**
 * The largest chroma sRGB can hold at this lightness and hue, by bisection.
 * The gamut boundary is a single crossing along C for fixed L and H, so 24
 * halvings land within ~1e-7 of it — far finer than an 8-bit channel.
 */
export function maxChroma(l: number, h: number): number {
  if (l <= 0 || l >= 1) return 0
  let low = 0
  let high = 0.5
  if (inGamut({ l, c: high, h })) return high
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    if (inGamut({ l, c: mid, h })) low = mid
    else high = mid
  }
  return low
}

/** Pulls chroma down until the color fits sRGB, keeping L and H exactly. */
export function clampToGamut(color: Oklch): Oklch {
  if (inGamut(color)) return color
  return { ...color, c: maxChroma(color.l, color.h) }
}

export function oklchToHex(color: Oklch): string {
  return toHex(oklchToRgb(clampToGamut(color)))
}

export function hexToOklch(hex: string): Oklch {
  return rgbToOklch(parseHex(hex))
}

/**
 * Past this much hue between two stops, they are different color families and
 * the route between them runs through a third one.
 */
const MAX_HUE_TRAVEL = 90

/** Degrees between two hues, the short way round: 0..180. */
function hueDistance(a: number, b: number): number {
  const delta = Math.abs(normalizeHue(a) - normalizeHue(b))
  return delta > 180 ? 360 - delta : delta
}

/**
 * Reads a ramp as a continuous scale: `t` in 0..1 lands between two stops and
 * gets the OKLCH blend of them. A nine-stop ramp painted straight onto a matrix
 * quantises the data into nine bands the eye reads as structure; interpolating
 * removes the edges and leaves the stops themselves at t = i / (n - 1).
 *
 * Two stops from different color families — the pale blue and pale yellow either
 * side of an RdYlBu middle — blend through OKLab instead, which fades through
 * low chroma. Rotating the hue would paint a band of green nobody put in the ramp.
 */
export function interpolateRamp(stops: string[], t: number): string {
  if (stops.length === 0) throw new Error('A ramp needs at least one stop')
  if (stops.length === 1) return stops[0]

  const position = clamp01(t) * (stops.length - 1)
  const low = Math.floor(position)
  const high = Math.ceil(position)
  if (low === high) return stops[low]

  const a = hexToOklch(stops[low])
  const b = hexToOklch(stops[high])
  const f = position - low
  const l = a.l + (b.l - a.l) * f

  if (a.c > 1e-4 && b.c > 1e-4 && hueDistance(a.h, b.h) > MAX_HUE_TRAVEL) {
    return oklchToHex(clampToGamut({ ...mixOklab(a, b, f), l }))
  }

  return oklchToHex(
    clampToGamut({
      l,
      // Chroma and hue are blended in polar form, so a stop pair either side of
      // a near-grey middle fades through grey instead of through a third hue.
      c: a.c + (b.c - a.c) * f,
      h: a.c < 1e-4 ? b.h : b.c < 1e-4 ? a.h : mixHue(a.h, b.h, f),
    }),
  )
}

/** Chroma and hue blended in rectangular OKLab, i.e. across the grey axis. */
function mixOklab(a: Oklch, b: Oklch, t: number): Oklch {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const x =
    a.c * Math.cos(rad(a.h)) +
    (b.c * Math.cos(rad(b.h)) - a.c * Math.cos(rad(a.h))) * t
  const y =
    a.c * Math.sin(rad(a.h)) +
    (b.c * Math.sin(rad(b.h)) - a.c * Math.sin(rad(a.h))) * t
  const c = Math.hypot(x, y)
  return {
    l: a.l,
    c,
    h: c < 1e-6 ? a.h : normalizeHue((Math.atan2(y, x) * 180) / Math.PI),
  }
}

/** Interpolates hue the short way round the circle. */
export function mixHue(from: number, to: number, t: number): number {
  let delta = normalizeHue(to) - normalizeHue(from)
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return normalizeHue(from + delta * t)
}

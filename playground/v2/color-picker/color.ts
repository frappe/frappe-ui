// Colour maths for the picker. The picker thinks in HSV — hue on the bar,
// saturation and value on the square — and everything the fields show is
// derived from that, so a colour never drifts as it round-trips.

/** Channels are kept unrounded; round them only to show them. */
export interface HSV {
  /** 0–360 */
  h: number
  /** 0–100 */
  s: number
  /** 0–100 */
  v: number
}
export interface RGB {
  r: number
  g: number
  b: number
}
export interface HSL {
  h: number
  s: number
  l: number
}

export type Format = 'hex' | 'rgb' | 'hsl' | 'hsb'

export const FORMATS: { value: Format; label: string }[] = [
  { value: 'hex', label: 'Hex' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'hsb', label: 'HSB' },
]

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n))

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const sat = s / 100
  const val = v / 100
  const c = val * sat
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = val - c
  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

export function rgbToHsv({ r, g, b }: RGB, keepHue = 0): HSV {
  const rr = r / 255
  const gg = g / 255
  const bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const d = max - min
  let h = keepHue
  if (d > 0) {
    if (max === rr) h = 60 * (((gg - bb) / d) % 6)
    else if (max === gg) h = 60 * ((bb - rr) / d + 2)
    else h = 60 * ((rr - gg) / d + 4)
    if (h < 0) h += 360
  }
  // unrounded, so a hex typed in comes back out as itself
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 }
}

export function hsvToHsl({ h, s, v }: HSV): HSL {
  const sat = s / 100
  const val = v / 100
  const l = val * (1 - sat / 2)
  const sl = l === 0 || l === 1 ? 0 : (val - l) / Math.min(l, 1 - l)
  return { h, s: sl * 100, l: l * 100 }
}

export function hslToHsv({ h, s, l }: HSL): HSV {
  const sl = s / 100
  const ll = l / 100
  const v = ll + sl * Math.min(ll, 1 - ll)
  const sv = v === 0 ? 0 : 2 * (1 - ll / v)
  return { h, s: sv * 100, v: v * 100 }
}

const hex2 = (n: number) => n.toString(16).padStart(2, '0').toUpperCase()

/** `RRGGBB`, upper case, no `#` — as the fields show it */
export function rgbToHex({ r, g, b }: RGB): string {
  return hex2(r) + hex2(g) + hex2(b)
}

/** `#RGB`, `RGB`, `#RRGGBB` or `RRGGBB`, any case; null for anything else */
export function parseHex(text: string): RGB | null {
  const m = text.trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(m)) {
    const [r, g, b] = m.split('').map((c) => parseInt(c + c, 16))
    return { r, g, b }
  }
  if (/^[0-9a-f]{6}$/i.test(m)) {
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
    }
  }
  return null
}

/** the whole number in a field, or null when there is none */
export function parseNumber(text: string): number | null {
  const m = text.match(/-?\d+(\.\d+)?/)
  return m ? Math.round(parseFloat(m[0])) : null
}

/** a CSS colour for the hsv, with its alpha */
export function toCss(hsv: HSV, alpha = 100): string {
  const { r, g, b } = hsvToRgb(hsv)
  return alpha >= 100
    ? `#${rgbToHex({ r, g, b })}`
    : `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`
}

export type Mode = 'solid' | 'gradient' | 'image'

/** the checkerboard under anything translucent — layers for `background` */
export const CHECKER =
  'linear-gradient(45deg, var(--surface-gray-2) 25%, transparent 25%, transparent 75%, var(--surface-gray-2) 75%) 0 0 / 16px 16px, linear-gradient(45deg, var(--surface-gray-2) 25%, transparent 25%, transparent 75%, var(--surface-gray-2) 75%) 8px 8px / 16px 16px, var(--surface-elevation-2)'

/** a value as a `background` layer: a bare colour cannot sit over another
 *  layer, so it is wrapped as a flat gradient */
export function layer(css: string): string {
  return /^(linear-gradient|url)\(/.test(css)
    ? css
    : `linear-gradient(${css}, ${css})`
}

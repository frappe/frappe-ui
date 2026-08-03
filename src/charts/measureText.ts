/**
 * Text measured by the thing that draws it.
 *
 * zrender sizes every label on a detached 2d canvas (`platformApi.measureText`)
 * and keeps the result in a module LRU for the life of the page. The charts
 * render as SVG in the DOM, and a canvas cannot see the CSS the DOM applies —
 * `font-variant-numeric` above all — so the number it reports is not the width
 * the browser will lay out. Every consumer of that number then under-reserves:
 * `containLabel` cuts the axis column too narrow and the labels clip.
 *
 * Measuring in a hidden DOM element instead makes the measurement and the
 * rendering the same operation on the same engine.
 */

/** zrender's fallback when a text has no font of its own (core/platform.js). */
const DEFAULT_FONT = '12px sans-serif'

/** What the charts set as `textStyle.fontFamily`; every label inherits it. */
export const CHART_FONT_FAMILY = 'InterVar, Inter, sans-serif'

/**
 * The CSS font a label of `fontSize` is drawn with. Measuring and rendering
 * have to agree on the string, not just on the size.
 */
export function chartFont(fontSize: number): string {
  return `${fontSize}px ${CHART_FONT_FAMILY}`
}

/**
 * Beyond this the cache is dropped whole rather than evicted one entry at a
 * time: the keys of a chart that has been rebuilt that many times are a past
 * dataset, not a working set worth ranking.
 */
const CACHE_LIMIT = 4000

const cache = new Map<string, number>()

let element: HTMLElement | undefined

function measuringElement(): HTMLElement {
  if (element?.isConnected) return element
  element = document.createElement('div')
  const style = element.style
  style.position = 'absolute'
  style.top = '-9999px'
  style.left = '-9999px'
  style.visibility = 'hidden'
  style.whiteSpace = 'pre'
  style.margin = '0'
  style.padding = '0'
  // The element hangs off `body`, so it inherits whatever the app sets there —
  // including the tabular figures the chart card turns on for its HTML chrome.
  // Plot text renders with them off (see style.css), so measuring has to too.
  style.fontVariantNumeric = 'normal'
  document.body.appendChild(element)
  return element
}

/**
 * The width `text` occupies when drawn in `font`, or `null` where there is no
 * DOM to draw it in (SSR, pure option builders under node). A caller that gets
 * `null` has to estimate instead.
 *
 * zrender caches through its own LRU, but the platform override is also called
 * directly by anything that measures once per label per render, so repeats are
 * answered from a Map rather than from the layout engine.
 */
export function measureTextWidth(text: string, font?: string): number | null {
  if (typeof document === 'undefined') return null

  const resolvedFont = font || DEFAULT_FONT
  const key = `${resolvedFont} ${text}`
  const cached = cache.get(key)
  if (cached !== undefined) return cached

  const el = measuringElement()
  el.style.font = resolvedFont
  // The `font` shorthand resets `font-variant-numeric`, so it is re-applied.
  el.style.fontVariantNumeric = 'normal'
  el.textContent = text
  // Ceiled: a reservation computed from this number must never under-read, and
  // echarts rounds fractional widths away at several layout steps.
  const width = Math.ceil(el.getBoundingClientRect().width)

  if (cache.size >= CACHE_LIMIT) cache.clear()
  cache.set(key, width)
  return width
}

type PlatformApiSetter = (api: {
  measureText: (text: string, font?: string) => { width: number }
}) => void

let installed = false

/**
 * Points zrender's text measurement at the DOM. Takes the setter rather than
 * importing it so this module stays free of echarts — the option builders
 * import it, and they must not pull the renderer in with them.
 *
 * Called from chart init: it has to be in place before the first chart
 * measures anything, and must not run while a module is being evaluated on a
 * server. Installing twice is a no-op, and without a DOM it does nothing at
 * all — zrender keeps its canvas path.
 */
export function installTextMeasurer(setPlatformAPI: PlatformApiSetter): void {
  if (installed || typeof document === 'undefined') return
  installed = true
  setPlatformAPI({
    measureText: (text, font) => ({
      width: measureTextWidth(text ?? '', font) ?? 0,
    }),
  })
}

/** Test seam: drops the cache and the element so a case starts from nothing. */
export function resetTextMeasurer(): void {
  cache.clear()
  element?.remove()
  element = undefined
  installed = false
}

// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CHART_FONT_FAMILY,
  chartFont,
  installTextMeasurer,
  measureTextWidth,
  resetTextMeasurer,
} from './measureText'
import { estimateTextWidth } from './format'

// jsdom has no layout engine, so every rect it returns is zero. Widths come
// from a stub instead; what the tests are about is which text reaches the
// element, in what font, and how often.
function stubLayout() {
  return vi
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: Element) {
      const width = (this.textContent ?? '').length * 7
      return { width, height: 11 } as DOMRect
    })
}

afterEach(() => {
  resetTextMeasurer()
  vi.restoreAllMocks()
})

describe('measureTextWidth', () => {
  it('measures the text in a hidden element off the page', () => {
    stubLayout()
    expect(measureTextWidth('Direct', chartFont(11))).toBe(42)

    const el = document.body.lastElementChild as HTMLElement
    expect(el.textContent).toBe('Direct')
    expect(el.style.visibility).toBe('hidden')
    expect(el.style.position).toBe('absolute')
    expect(el.style.whiteSpace).toBe('pre')
    // Tabular figures are on for the chart's HTML chrome and off in the plot;
    // measuring with them on is what made numeric labels clip.
    expect(el.style.fontVariantNumeric).toBe('normal')
  })

  it('draws the label in the font the plot renders it in', () => {
    stubLayout()
    measureTextWidth('Direct', chartFont(11))

    const el = document.body.lastElementChild as HTMLElement
    expect(chartFont(11)).toBe(`11px ${CHART_FONT_FAMILY}`)
    expect(el.style.fontSize).toBe('11px')
    expect(el.style.fontFamily).toBe(CHART_FONT_FAMILY)
  })

  it('answers a repeat from the cache instead of the layout engine', () => {
    const rect = stubLayout()
    const first = measureTextWidth('Referral Partners', chartFont(11))
    const second = measureTextWidth('Referral Partners', chartFont(11))

    expect(second).toBe(first)
    expect(rect).toHaveBeenCalledTimes(1)
  })

  it('keys the cache by font as well as text', () => {
    stubLayout()
    measureTextWidth('Direct', chartFont(11))
    measureTextWidth('Direct', chartFont(22))
    const el = document.body.lastElementChild as HTMLElement
    expect(el.style.fontSize).toBe('22px')
  })

  it('reuses one element across measurements', () => {
    stubLayout()
    const before = document.body.children.length
    measureTextWidth('Direct', chartFont(11))
    measureTextWidth('Organic', chartFont(11))
    expect(document.body.children.length).toBe(before + 1)
  })

  it('backs the width truncation works against', () => {
    stubLayout()
    // 6 chars at the stub's 7px each: the cap fits the label whole.
    expect(estimateTextWidth('Direct', 11)).toBe(42)
  })
})

describe('installTextMeasurer', () => {
  it('hands zrender a measureText of the same shape it replaces', () => {
    stubLayout()
    const setPlatformAPI = vi.fn()
    installTextMeasurer(setPlatformAPI)

    expect(setPlatformAPI).toHaveBeenCalledTimes(1)
    const { measureText } = setPlatformAPI.mock.calls[0][0]
    expect(measureText('Direct', chartFont(11))).toEqual({ width: 42 })
    // zrender calls through with no font for text that has none of its own.
    expect(measureText('Direct', undefined)).toEqual({ width: 42 })
  })

  it('installs once, however many charts are built', () => {
    const setPlatformAPI = vi.fn()
    installTextMeasurer(setPlatformAPI)
    installTextMeasurer(setPlatformAPI)
    expect(setPlatformAPI).toHaveBeenCalledTimes(1)
  })
})

/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { resolveChartTokens, resolveCssVariables } from './tokens'

/** A chart element inside `depth` wrappers, appended to the document. */
function mount(...backgrounds: (string | undefined)[]) {
  let parent: HTMLElement = document.body
  for (const background of backgrounds) {
    const el = document.createElement('div')
    if (background) el.style.backgroundColor = background
    parent.appendChild(el)
    parent = el
  }
  return parent
}

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.style.backgroundColor = ''
  document.documentElement.style.removeProperty('--chart-backdrop')
})

describe('the surface behind the plot', () => {
  it('takes the painted background of the chart itself', () => {
    const el = mount('rgb(20, 20, 20)')
    expect(resolveChartTokens(el).backdrop).toBe('rgb(20, 20, 20)')
  })

  it('walks past see-through ancestors to the one that paints', () => {
    // The card is what a viewer sees behind the plot; the wrappers between the
    // chart and it are painted by nobody.
    const el = mount('rgb(40, 40, 40)', undefined, undefined)
    expect(resolveChartTokens(el).backdrop).toBe('rgb(40, 40, 40)')
  })

  it('reaches the page when nothing between paints', () => {
    document.documentElement.style.backgroundColor = 'rgb(10, 10, 10)'
    expect(resolveChartTokens(mount(undefined)).backdrop).toBe(
      'rgb(10, 10, 10)',
    )
  })

  it('lets the token override the walk, for a background it cannot read', () => {
    const el = mount('rgb(20, 20, 20)')
    // Set on the element rather than the root: a custom property inherits in a
    // browser, but jsdom's getComputedStyle does not walk up for one.
    el.style.setProperty('--chart-backdrop', '#abcdef')
    expect(resolveChartTokens(el).backdrop).toBe('#abcdef')
  })

  it('falls back to the scheme when no ancestor paints at all', () => {
    expect(resolveChartTokens(mount(undefined)).backdrop).toBe('#ffffff')
  })
})

describe('CSS variables in a caller’s colors', () => {
  function chartWith(variables: Record<string, string>) {
    const el = mount(undefined)
    for (const [name, value] of Object.entries(variables)) {
      el.style.setProperty(name, value)
    }
    return el
  }

  it('swaps each variable for the value the chart element computes', () => {
    const el = chartWith({ '--brand': '#ff0000', '--muted': ' #cccccc ' })
    const option = {
      color: ['var(--brand)', '#00ff00'],
      series: [
        { itemStyle: { color: 'var( --muted )' } },
        {
          lineStyle: {
            color: 'color-mix(in srgb, var(--brand) 20%, transparent)',
          },
        },
      ],
    }
    expect(resolveCssVariables(option, el)).toEqual({
      color: ['#ff0000', '#00ff00'],
      series: [
        { itemStyle: { color: '#cccccc' } },
        {
          lineStyle: { color: 'color-mix(in srgb, #ff0000 20%, transparent)' },
        },
      ],
    })
  })

  it('hands an oklch() value over as sRGB, which echarts can parse', () => {
    const el = chartWith({ '--overdue': 'oklch(1 0 0)' })
    expect(resolveCssVariables('var(--overdue)', el)).toBe('#ffffff')
  })

  it('takes the fallback for a name the element does not define, else leaves it', () => {
    const el = chartWith({})
    expect(
      resolveCssVariables(['var(--nope, #123456)', 'var(--nope)'], el),
    ).toEqual(['#123456', 'var(--nope)'])
  })

  it('returns what it changed nothing in as it was, Dates and functions included', () => {
    const el = chartWith({ '--brand': '#ff0000' })
    const when = new Date(2024, 0, 1)
    const formatter = () => 'x'
    const untouched = { data: [[when, 1]], formatter }
    const option: Record<string, any> = {
      series: [untouched, { color: 'var(--brand)' }],
    }
    const resolved = resolveCssVariables(option, el)
    expect(resolved.series[0]).toBe(untouched)
    expect(resolved.series[0].data[0][0]).toBe(when)
    expect(resolved.series[1].color).toBe('#ff0000')
    expect(option.series[1].color).toBe('var(--brand)')
  })

  it('leaves everything as written without an element to read from', () => {
    const option = { color: ['var(--brand)'] }
    expect(resolveCssVariables(option, undefined)).toBe(option)
  })
})

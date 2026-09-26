/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { resolveChartTokens } from './tokens'

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

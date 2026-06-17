/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest'
import { lockScroll } from './link-popup-controller'

describe('lockScroll', () => {
  // Regression: opening the link popup over a scrolled editor used to drop the
  // container's `overflow-y` on close, so long content overflowed its box and
  // painted over the toolbar/Submit. The lock must restore the exact prior
  // overflow, even when it was authored as the `overflow-y` longhand.
  it('restores an `overflow-y` longhand after lock/unlock', () => {
    const el = document.createElement('div')
    el.style.overflowY = 'auto'

    const unlock = lockScroll(el)
    expect(el.style.overflowY).toBe('hidden')
    expect(el.style.overflowX).toBe('hidden')

    unlock()
    expect(el.style.overflowY).toBe('auto')
  })

  it('restores each axis independently after lock/unlock', () => {
    const el = document.createElement('div')
    el.style.overflowX = 'hidden'
    el.style.overflowY = 'auto'

    lockScroll(el)()

    expect(el.style.overflowX).toBe('hidden')
    expect(el.style.overflowY).toBe('auto')
  })

  it('leaves no inline overflow when the element had none', () => {
    const el = document.createElement('div')

    lockScroll(el)()

    expect(el.style.overflowX).toBe('')
    expect(el.style.overflowY).toBe('')
    expect(el.getAttribute('style')).toBeFalsy()
  })

  it('is a no-op for a null scroll parent', () => {
    expect(() => lockScroll(null)()).not.toThrow()
  })
})

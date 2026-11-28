// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { clientPoint } from './clientPoint'

describe('clientPoint', () => {
  it('reads a mouse event', () => {
    const event = new MouseEvent('mousemove', { clientX: 10, clientY: 20 })
    expect(clientPoint(event)).toEqual({ x: 10, y: 20 })
  })

  // zrender listens for touch events where the browser has them.
  it('reads the finger on the plot, not one resting elsewhere', () => {
    const event = Object.assign(new Event('touchstart'), {
      touches: [
        { clientX: 1, clientY: 2 },
        { clientX: 30, clientY: 40 },
      ],
      targetTouches: [{ clientX: 30, clientY: 40 }],
      changedTouches: [{ clientX: 30, clientY: 40 }],
    })
    expect(clientPoint(event)).toEqual({ x: 30, y: 40 })
  })

  it('reads the lifted finger of a touchend', () => {
    const event = Object.assign(new Event('touchend'), {
      touches: [],
      targetTouches: [],
      changedTouches: [{ clientX: 50, clientY: 60 }],
    })
    expect(clientPoint(event)).toEqual({ x: 50, y: 60 })
  })

  it('has no point without an event', () => {
    expect(clientPoint(undefined)).toBeUndefined()
  })
})

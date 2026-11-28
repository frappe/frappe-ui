// @vitest-environment jsdom
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { useTooltipDismiss } from './useTooltipDismiss'

function pointer(type: string, pointerType: string, pointerId = 1) {
  return Object.assign(new Event(type, { bubbles: true }), {
    pointerType,
    pointerId,
  })
}

function lift(touches: unknown[] = [], type = 'touchend') {
  document.dispatchEvent(
    Object.assign(new Event(type, { bubbles: true }), { touches }),
  )
}

/** A tap as a browser sends it: down, then up, then the touch ends. */
function tap(el: Element) {
  el.dispatchEvent(pointer('pointerdown', 'touch'))
  document.dispatchEvent(pointer('pointerup', 'touch'))
  lift()
}

function setup() {
  let closed = 0
  let cleared = 0
  const plot = ref<HTMLElement>()
  const outside = ref<HTMLElement>()
  const root = document.createElement('div')
  document.body.append(root)
  const app = createApp(
    defineComponent({
      setup() {
        useTooltipDismiss({
          plot,
          data: () => [],
          close: () => closed++,
          clearHover: () => cleared++,
        })
        return () =>
          h('div', [h('div', { ref: plot }), h('button', { ref: outside })])
      },
    }),
  )
  app.mount(root)
  return {
    unmount: () => {
      app.unmount()
      root.remove()
    },
    closed: () => closed,
    cleared: () => cleared,
    plot: () => plot.value!,
    // The container swapping its loading state in and the plot back out.
    swapPlot: () => {
      plot.value = document.createElement('div')
    },
    outside: () => outside.value!,
  }
}

let mounted: ReturnType<typeof setup> | undefined
afterEach(() => mounted?.unmount())

describe('useTooltipDismiss', () => {
  it('closes the reading when a mouse leaves the plot', async () => {
    mounted = setup()
    await nextTick()
    const before = mounted.closed()
    mounted.plot().dispatchEvent(pointer('pointerleave', 'mouse'))
    expect(mounted.closed()).toBe(before + 1)
  })

  // A finger leaves the plot when it lifts: that is the end of the tap that
  // opened the reading.
  it('keeps the reading when a finger lifts off the plot', async () => {
    mounted = setup()
    await nextTick()
    const before = mounted.closed()
    mounted.plot().dispatchEvent(pointer('pointerleave', 'touch'))
    expect(mounted.closed()).toBe(before)
  })

  it('closes the reading when a touch lands outside the plot', async () => {
    mounted = setup()
    await nextTick()
    const before = mounted.closed()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.closed()).toBe(before)
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.closed()).toBe(before + 1)
  })

  it('leaves a mouse press outside to the rest of the page', async () => {
    mounted = setup()
    await nextTick()
    const before = mounted.closed()
    mounted.outside().dispatchEvent(pointer('pointerdown', 'mouse'))
    expect(mounted.closed()).toBe(before)
  })

  // A mouse leaving takes the hover off; a finger never leaves.
  it('takes the hover off once when a touch lands outside after a tap', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerleave', 'mouse'))
    window.dispatchEvent(new Event('scroll'))
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(0)
    tap(mounted.plot())
    expect(mounted.cleared()).toBe(0)
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(1)
    // Cleared with the finger up: nothing on the plot is a finger's any more.
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(1)
  })

  it('takes the hover off once when a scroll closes a tapped reading', async () => {
    mounted = setup()
    await nextTick()
    tap(mounted.plot())
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(1)
  })

  // A finger that scrolls the page from the plot hovers the marks again as it
  // goes, so each scroll takes the hover off until the finger has lifted.
  it('keeps taking the hover off while a swipe from the plot scrolls', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(2)
    lift()
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(3)
  })

  // A mouse back over the plot owns the hover, and takes it off itself.
  it('leaves a mouse hover alone after a tap', async () => {
    mounted = setup()
    await nextTick()
    tap(mounted.plot())
    mounted.plot().dispatchEvent(pointer('pointermove', 'mouse'))
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(0)
  })

  // Finger A rests on the plot while finger B taps elsewhere: B's lift is not
  // A's, and A's swipe goes on hovering the marks.
  it('keeps taking the hover off while another finger is down', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch', 1))
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch', 2))
    document.dispatchEvent(pointer('pointerup', 'touch', 2))
    lift([{}])
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(3)
  })

  // A browser that sends no touch events still ends a tap in a pointerup.
  it('takes a tap as lifted on its pointerup alone', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    document.dispatchEvent(pointer('pointerup', 'touch'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(1)
  })

  it('takes a cancelled touch as lifted', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    lift([], 'touchcancel')
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(1)
  })

  // Where the browser sends no touch events, nothing but the cancel ends a
  // swipe.
  it('takes a cancelled swipe as lifted where there are no touch events', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ontouchstart')
    delete (window as any).ontouchstart
    try {
      mounted = setup()
      await nextTick()
      mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
      document.dispatchEvent(pointer('pointercancel', 'touch'))
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('scroll'))
      expect(mounted.cleared()).toBe(1)
    } finally {
      if (descriptor) Object.defineProperty(window, 'ontouchstart', descriptor)
    }
  })

  // With touch events, the touch goes on after the cancel, until it ends.
  it('waits for the touch to end after a cancelled swipe', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    document.dispatchEvent(pointer('pointercancel', 'touch'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(2)
  })

  // A finger on a plot that has gone ends its touch out of the page's reach.
  it('drops the fingers on a plot that has been swapped out', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    mounted.swapPlot()
    await nextTick()
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(1)
  })
})

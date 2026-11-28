// @vitest-environment jsdom
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { useTooltipDismiss } from './useTooltipDismiss'

function pointer(type: string, pointerType: string) {
  return Object.assign(new Event(type, { bubbles: true }), { pointerType })
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
  it('takes the hover off when a touch lands outside a touched plot', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerleave', 'mouse'))
    window.dispatchEvent(new Event('scroll'))
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(0)
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(0)
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(1)
    // Still a finger's hover, until a mouse moves over the plot.
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(2)
    mounted.plot().dispatchEvent(pointer('pointermove', 'mouse'))
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(2)
  })

  it('takes the hover off when anything else closes a tapped reading', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(1)
    // A finger that scrolls from the plot hovers it again as it goes.
    window.dispatchEvent(new Event('scroll'))
    expect(mounted.cleared()).toBe(2)
  })

  // A mouse back over the plot owns the hover, and takes it off itself.
  it('leaves a mouse hover alone after a tap', async () => {
    mounted = setup()
    await nextTick()
    mounted.plot().dispatchEvent(pointer('pointerdown', 'touch'))
    mounted.plot().dispatchEvent(pointer('pointermove', 'mouse'))
    mounted.outside().dispatchEvent(pointer('pointerdown', 'touch'))
    expect(mounted.cleared()).toBe(0)
  })
})

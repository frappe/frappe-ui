// @vitest-environment jsdom
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { useTooltipDismiss } from './useTooltipDismiss'

function pointer(type: string, pointerType: string) {
  return Object.assign(new Event(type, { bubbles: true }), { pointerType })
}

function setup() {
  let closed = 0
  const plot = ref<HTMLElement>()
  const outside = ref<HTMLElement>()
  const root = document.createElement('div')
  document.body.append(root)
  const app = createApp(
    defineComponent({
      setup() {
        useTooltipDismiss({ plot, data: () => [], close: () => closed++ })
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
})

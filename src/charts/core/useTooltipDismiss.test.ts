// @vitest-environment jsdom
import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useTooltipDismiss } from './useTooltipDismiss'

async function setup() {
  const plot = ref<HTMLElement>()
  const el = document.createElement('div')
  let closed = 0
  const scope = effectScope()
  scope.run(() => {
    useTooltipDismiss({ plot, data: () => null, close: () => closed++ })
  })
  plot.value = el
  await nextTick()
  return {
    leave: (pointerType: string) =>
      el.dispatchEvent(new PointerEvent('pointerleave', { pointerType })),
    closedCount: () => closed,
  }
}

describe('useTooltipDismiss', () => {
  it('dismisses on a mouse pointer leaving the plot', async () => {
    const plot = await setup()
    plot.leave('mouse')
    expect(plot.closedCount()).toBe(1)
  })

  // A touch pointer fires `pointerleave` the instant contact ends, before the
  // tap's own tooltip has had a chance to show.
  it('ignores a touch pointer leaving the plot', async () => {
    const plot = await setup()
    plot.leave('touch')
    expect(plot.closedCount()).toBe(0)
  })
})

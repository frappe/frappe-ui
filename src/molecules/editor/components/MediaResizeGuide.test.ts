/**
 * @vitest-environment jsdom
 *
 * The resize label sits inside the media, which clips its overflow, so on
 * small media it hides instead of showing a cut-off name. jsdom computes no
 * layout, so `offsetWidth` is stubbed to grow with the label text.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import MediaResizeGuide from './MediaResizeGuide.vue'
import type { ResizeGuide } from '#molecules/editor/composables/useNodeViewResize'

const CHAR_WIDTH = 7

function snap(label: string): ResizeGuide['snap'] {
  return { width: 0, label, line: { x: 0, top: 0, height: 100 } }
}

function mount(initial: ResizeGuide) {
  const guide = ref<ResizeGuide | null>(initial)
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render: () => h(MediaResizeGuide, { guide: () => guide.value }),
  })
  app.mount(root)
  return {
    guide,
    label: () => root.querySelector<HTMLElement>('.tabular-nums')!,
    unmount: () => {
      app.unmount()
      root.remove()
    },
  }
}

describe('MediaResizeGuide label', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
      function (this: HTMLElement) {
        return (this.textContent ?? '').trim().length * CHAR_WIDTH
      },
    )
  })
  afterEach(() => vi.restoreAllMocks())

  it('hides while it would be clipped or reach the grip, and shows once it fits', async () => {
    // "Original size" measures 91px: too wide for a 64px icon.
    const ctx = mount({ width: 64, snap: snap('Original size') })
    await nextTick()
    expect(ctx.label().textContent?.trim()).toBe('Original size')
    expect(ctx.label().classList.contains('invisible')).toBe(true)

    // On 160px media the 91px pill would still reach the corner grip.
    ctx.guide.value = { width: 160, snap: snap('Original size') }
    await nextTick()
    expect(ctx.label().classList.contains('invisible')).toBe(true)

    // A free drag shortens the text to "120px" (35px), which clears the grip.
    ctx.guide.value = { width: 120, snap: null }
    await nextTick()
    expect(ctx.label().textContent?.trim()).toBe('120px')
    expect(ctx.label().classList.contains('invisible')).toBe(false)

    // The same snap on wider media fits.
    ctx.guide.value = { width: 200, snap: snap('Original size') }
    await nextTick()
    expect(ctx.label().classList.contains('invisible')).toBe(false)

    ctx.unmount()
  })
})

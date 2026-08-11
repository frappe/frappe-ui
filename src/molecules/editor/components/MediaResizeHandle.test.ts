/**
 * @vitest-environment jsdom
 *
 * The two placements of the resize handle. Images and embeds get the corner
 * grip; videos keep the edge pills, because their playback bar owns the bottom
 * of the frame.
 */
import { describe, it, expect } from 'vitest'
import { createApp, h } from 'vue'
import MediaResizeHandle from './MediaResizeHandle.vue'

type HandleProps = InstanceType<typeof MediaResizeHandle>['$props']

function mount(props: Partial<HandleProps> & { label: string }) {
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render: () => h(MediaResizeHandle, props),
  })
  app.mount(root)
  return {
    root,
    buttons: () => Array.from(root.querySelectorAll('button')),
    unmount: () => {
      app.unmount()
      root.remove()
    },
  }
}

describe('MediaResizeHandle', () => {
  it('renders one labelled corner grip carrying the resize glyph', () => {
    const ctx = mount({ label: 'Resize media' })

    const buttons = ctx.buttons()
    expect(buttons).toHaveLength(1)
    expect(buttons[0].getAttribute('aria-label')).toBe('Resize media')
    expect(buttons[0].className).toContain('cursor-nwse-resize')
    expect(buttons[0].querySelector('.lucide-move-diagonal-2')).not.toBeNull()

    ctx.unmount()
  })

  it('renders both edge pills when placement is "edges"', () => {
    const ctx = mount({ label: 'Resize media', placement: 'edges' })

    const labels = ctx.buttons().map((b) => b.getAttribute('aria-label'))
    expect(labels).toEqual([
      'Resize media from left edge',
      'Resize media from right edge',
    ])
    expect(ctx.buttons()[0].className).toContain('cursor-ew-resize')

    ctx.unmount()
  })

  it('reports which handle started the drag', () => {
    const started: string[] = []
    const onResizeStart = (_event: PointerEvent, edge: string) =>
      started.push(edge)

    const corner = mount({
      label: 'Resize media',
      'onResize-start': onResizeStart,
    })
    corner.buttons()[0].dispatchEvent(new MouseEvent('pointerdown'))
    corner.unmount()

    const edges = mount({
      label: 'Resize media',
      placement: 'edges',
      'onResize-start': onResizeStart,
    })
    edges
      .buttons()
      .forEach((b) => b.dispatchEvent(new MouseEvent('pointerdown')))
    edges.unmount()

    expect(started).toEqual(['corner', 'left', 'right'])
  })
})

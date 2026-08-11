/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import type { Editor } from '@tiptap/core'
import { useNodeViewResize, type ResizeArgs } from './useNodeViewResize'

/** Mount a component that runs `useNodeViewResize`, exposing its API + unmount. */
function mountResize(editor: Editor, args: ResizeArgs) {
  let api!: ReturnType<typeof useNodeViewResize>
  const Comp = defineComponent({
    setup() {
      api = useNodeViewResize(editor, args)
      return () => h('div')
    },
  })
  const host = document.createElement('div')
  document.body.appendChild(host)
  const app = createApp(Comp)
  app.mount(host)
  return {
    api,
    unmount: () => {
      app.unmount()
      host.remove()
    },
  }
}

function makeEditor(editable = true): Editor {
  return {
    isEditable: editable,
    view: { dom: { clientWidth: 1000 } },
  } as unknown as Editor
}

function makeEl(width = 200, height = 100): HTMLElement {
  const el = document.createElement('img')
  Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true })
  Object.defineProperty(el, 'offsetHeight', {
    value: height,
    configurable: true,
  })
  return el
}

beforeEach(() => {
  vi.restoreAllMocks()
  document.body.style.cursor = ''
})

describe('useNodeViewResize', () => {
  it('removes window listeners and resets cursor on stop (pointerup)', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const el = makeEl()
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 0.5,
      getPos: () => 0,
      onCommit: vi.fn(),
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    expect(api.isResizing.value).toBe(true)

    // jsdom has no PointerEvent constructor; type string is all that matters.
    window.dispatchEvent(new MouseEvent('pointerup'))
    expect(api.isResizing.value).toBe(false)
    expect(remove).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointerup', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointercancel', expect.any(Function))
    expect(document.body.style.cursor).toBe('')
    unmount()
  })

  it('removes window listeners on unmount mid-drag (leak fix)', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const el = makeEl()
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 1,
      getPos: () => 0,
      onCommit: vi.fn(),
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    unmount()

    expect(remove).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointerup', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointercancel', expect.any(Function))
    expect(document.body.style.cursor).toBe('')
  })

  it('does not commit when getPos is invalid (null guard)', () => {
    const onCommit = vi.fn()
    const el = makeEl()
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 1,
      getPos: () => undefined,
      onCommit,
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    window.dispatchEvent(new MouseEvent('pointerup'))

    expect(onCommit).not.toHaveBeenCalled()
    unmount()
  })

  it('commits final dimensions when getPos is valid', () => {
    const onCommit = vi.fn()
    const el = makeEl()
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 1,
      getPos: () => 3,
      onCommit,
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    window.dispatchEvent(new MouseEvent('pointerup'))

    expect(onCommit).toHaveBeenCalledWith({ width: 200, height: 100 })
    unmount()
  })

  it('locks the aspect to the rendered box, not getAspectRatio', () => {
    // Element paints 3:1 tall (200×600); the supplied ratio is a WRONG 1:1 —
    // the case where a node stores only width and the height comes from CSS
    // `height: auto`. The drag must preserve the painted shape (3), so a width
    // grown to 300 yields height 900, never the 300 that ratio 1 would give.
    const el = makeEl(200, 600)
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 1,
      getPos: () => 0,
      onCommit: vi.fn(),
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    // Dragging the corner along the 1:3 diagonal: +100 across, +300 down.
    window.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 100, clientY: 300 }),
    )

    expect(el.style.width).toBe('300px')
    expect(el.style.height).toBe('900px')
    window.dispatchEvent(new MouseEvent('pointerup'))
    unmount()
  })

  it('falls back to getAspectRatio when the element has no rendered size', () => {
    // Pre-layout element (offsetWidth 0): the rendered ratio is unavailable, so
    // the supplied aspect (0.5) drives the drag instead.
    const el = makeEl(0, 0)
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 0.5,
      getPos: () => 0,
      onCommit: vi.fn(),
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    window.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 100, clientY: 50 }),
    )

    // Projected onto the locked 2:1 diagonal: (100 + 50*0.5) / (1 + 0.25) = 100.
    // newWidth = max(50, 0 + 100) = 100; height = 100 * 0.5 = 50.
    expect(el.style.width).toBe('100px')
    expect(el.style.height).toBe('50px')
    window.dispatchEvent(new MouseEvent('pointerup'))
    unmount()
  })

  it('resizes from a vertical-only drag (corner handle, not an edge)', () => {
    // The old left/right edge handles read clientX alone, so a straight-down
    // drag did nothing. The corner handle answers both axes.
    const el = makeEl(200, 100)
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 0.5,
      getPos: () => 0,
      onCommit: vi.fn(),
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    window.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 0, clientY: 100 }),
    )

    // deltaWidth = (0 + 100*0.5) / 1.25 = 40 → 240 wide, 120 tall.
    expect(el.style.width).toBe('240px')
    expect(el.style.height).toBe('120px')
    window.dispatchEvent(new MouseEvent('pointerup'))
    unmount()
  })

  it('trades horizontal gain for keeping the grip under the cursor on tall media', () => {
    // A 1:2 portrait. The corner is locked to the line (1, 2), so a purely
    // horizontal drag only buys a fifth of its travel — deliberately: any more
    // and the grip slides away from the pointer down the diagonal. Dragging
    // down, which is what a corner invites on a tall image, pays four times as
    // well.
    const el = makeEl(240, 480)
    const args = {
      mediaEl: () => el,
      getAspectRatio: () => 2,
      getPos: () => 0,
      onCommit: vi.fn(),
    }

    const across = mountResize(makeEditor(), args)
    across.api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    window.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 150, clientY: 0 }),
    )
    expect(el.style.width).toBe('270px') // 240 + 150/5
    window.dispatchEvent(new MouseEvent('pointerup'))
    across.unmount()

    el.style.width = ''
    el.style.height = ''
    const down = mountResize(makeEditor(), args)
    down.api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    window.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 0, clientY: 150 }),
    )
    expect(el.style.width).toBe('300px') // 240 + 150*2/5
    expect(el.style.height).toBe('600px') // the drag's own 120px of height
    window.dispatchEvent(new MouseEvent('pointerup'))
    down.unmount()
  })

  it('shows the corner resize cursor for the duration of the drag', () => {
    const el = makeEl()
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 1,
      getPos: () => 0,
      onCommit: vi.fn(),
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    expect(document.body.style.cursor).toBe('nwse-resize')

    window.dispatchEvent(new MouseEvent('pointerup'))
    expect(document.body.style.cursor).toBe('')
    unmount()
  })

  it('reads X alone from an edge pill, and inverts it for the left one', () => {
    // Videos keep the edge pills (their playback bar owns the bottom of the
    // frame), so the X-only math has to survive alongside the corner's.
    const el = makeEl(200, 100)
    const { api, unmount } = mountResize(makeEditor(), {
      mediaEl: () => el,
      getAspectRatio: () => 0.5,
      getPos: () => 0,
      onCommit: vi.fn(),
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent, 'right')
    expect(document.body.style.cursor).toBe('ew-resize')
    // Vertical travel is ignored; +100 across is +100 wide.
    window.dispatchEvent(
      new MouseEvent('pointermove', { clientX: 100, clientY: 300 }),
    )
    expect(el.style.width).toBe('300px')
    window.dispatchEvent(new MouseEvent('pointerup'))

    // Dragging the LEFT pill outward moves the pointer left but grows the node.
    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent, 'left')
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: -50 }))
    expect(el.style.width).toBe('250px')
    window.dispatchEvent(new MouseEvent('pointerup'))
    unmount()
  })

  it('no-ops startResize when the editor is not editable', () => {
    const onCommit = vi.fn()
    const { api, unmount } = mountResize(makeEditor(false), {
      mediaEl: () => makeEl(),
      getAspectRatio: () => 1,
      getPos: () => 0,
      onCommit,
    })

    api.startResize({ clientX: 0, clientY: 0 } as MouseEvent)
    expect(api.isResizing.value).toBe(false)
    unmount()
  })
})

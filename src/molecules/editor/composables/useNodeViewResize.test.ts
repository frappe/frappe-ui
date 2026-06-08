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

    api.startResize({ clientX: 0 } as MouseEvent)
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

    api.startResize({ clientX: 0 } as MouseEvent)
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

    api.startResize({ clientX: 0 } as MouseEvent)
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

    api.startResize({ clientX: 0 } as MouseEvent)
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

    api.startResize({ clientX: 0 } as MouseEvent)
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 100 }))

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

    api.startResize({ clientX: 0 } as MouseEvent)
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 100 }))

    // newWidth = max(50, 0 + 100) = 100; height = 100 * 0.5 = 50.
    expect(el.style.width).toBe('100px')
    expect(el.style.height).toBe('50px')
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

    api.startResize({ clientX: 0 } as MouseEvent)
    expect(api.isResizing.value).toBe(false)
    unmount()
  })
})

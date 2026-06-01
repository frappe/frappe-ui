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

function makeEl(): HTMLElement {
  const el = document.createElement('img')
  Object.defineProperty(el, 'offsetWidth', { value: 200, configurable: true })
  Object.defineProperty(el, 'offsetHeight', { value: 100, configurable: true })
  return el
}

beforeEach(() => {
  vi.restoreAllMocks()
  document.body.style.cursor = ''
})

describe('useNodeViewResize', () => {
  it('removes window listeners and resets cursor on stop (mouseup)', () => {
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

    window.dispatchEvent(new MouseEvent('mouseup'))
    expect(api.isResizing.value).toBe(false)
    expect(remove).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('mouseup', expect.any(Function))
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

    expect(remove).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('mouseup', expect.any(Function))
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
    window.dispatchEvent(new MouseEvent('mouseup'))

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
    window.dispatchEvent(new MouseEvent('mouseup'))

    expect(onCommit).toHaveBeenCalledWith({ width: 200, height: 100 })
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

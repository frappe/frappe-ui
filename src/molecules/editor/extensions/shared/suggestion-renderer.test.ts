/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type {
  SuggestionProps,
  SuggestionKeyDownProps,
} from '@tiptap/suggestion'
import { computePosition } from '@floating-ui/dom'
import { createSuggestionRenderer } from './suggestion-renderer'

// Every `new VueRenderer(...)` the renderer creates lands here so tests can
// inspect the real wrapper element it mounted.
interface FakeRenderer {
  el: HTMLElement | null
  element: Element | null
  props: Record<string, any>
  destroyed: boolean
  onKeyDownSpy: ReturnType<typeof vi.fn>
}
const instances = vi.hoisted(() => [] as FakeRenderer[])

// Fake VueRenderer that reproduces the regression this file fixes: `element`
// (the firstElementChild) is null — as it is for the reka `FocusScope`-based
// popup — while `el` (the wrapper div tiptap always creates) is present. Defined
// inside the factory because `vi.mock` is hoisted above the module body.
vi.mock('@tiptap/vue-3', () => {
  class FakeVueRenderer {
    el: HTMLElement | null
    props: Record<string, any>
    editor: unknown
    destroyed = false
    onKeyDownSpy = vi.fn(() => true)

    constructor(_component: unknown, { props, editor }: any) {
      this.el = document.createElement('div')
      this.props = props
      this.editor = editor
      instances.push(this as unknown as FakeRenderer)
    }

    get element(): Element | null {
      // Empty wrapper -> no first child, mirroring the broken case.
      return this.el ? this.el.firstElementChild : null
    }

    get ref() {
      return { onKeyDown: this.onKeyDownSpy }
    }

    updateProps(props: Record<string, any>) {
      Object.assign(this.props, props)
    }

    destroy() {
      this.destroyed = true
      this.el = null
    }
  }
  return { VueRenderer: FakeVueRenderer }
})

// `deferred` parks each computePosition resolver so a test can settle
// overlapping runs out of order; off by default so other tests stay synchronous.
const position = vi.hoisted(() => ({
  deferred: false,
  resolvers: [] as ((value: { x: number; y: number }) => void)[],
}))

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn(() =>
    position.deferred
      ? new Promise<{ x: number; y: number }>((resolve) => {
          position.resolvers.push(resolve)
        })
      : Promise.resolve({ x: 10, y: 20 }),
  ),
  flip: vi.fn(() => ({})),
  offset: vi.fn(() => ({})),
  shift: vi.fn(() => ({})),
}))

// jsdom has no ResizeObserver, so the renderer's feature check would skip the
// observer entirely without this.
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = []
  observe = vi.fn()
  disconnect = vi.fn()
  constructor(public callback: () => void) {
    FakeResizeObserver.instances.push(this)
  }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const FakeComponent = {} as never

function makeProps(overrides: Partial<SuggestionProps> = {}): SuggestionProps {
  return {
    editor: { appContext: {} },
    clientRect: () => ({ top: 0, left: 0, bottom: 0, right: 0 }) as DOMRect,
    ...overrides,
  } as unknown as SuggestionProps
}

function keyDown(key: string): SuggestionKeyDownProps {
  return {
    event: new KeyboardEvent('keydown', { key }),
  } as SuggestionKeyDownProps
}

describe('createSuggestionRenderer', () => {
  beforeEach(() => {
    instances.length = 0
    document.body.innerHTML = ''
    position.deferred = false
    position.resolvers.length = 0
    FakeResizeObserver.instances.length = 0
    vi.mocked(computePosition).mockClear()
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)
  })

  it('mounts the VueRenderer wrapper (renderer.el), not its null firstElementChild', () => {
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps())

    const renderer = instances[0]
    // Precondition: the regression case — `.element` is null...
    expect(renderer.element).toBeNull()
    // ...yet the popup is still appended via the always-present wrapper.
    expect(document.body.contains(renderer.el)).toBe(true)
    expect(renderer.el?.style.position).toBe('absolute')
  })

  it('removes the wrapper and destroys the renderer on exit', () => {
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps())
    const renderer = instances[0]
    const wrapper = renderer.el

    api.onExit()

    expect(document.body.contains(wrapper)).toBe(false)
    expect(renderer.destroyed).toBe(true)
  })

  it('late-attaches on update when onStart had no caret rect yet', () => {
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps({ clientRect: null }))
    const renderer = instances[0]
    expect(document.body.contains(renderer.el)).toBe(false)

    api.onUpdate(makeProps())

    expect(document.body.contains(renderer.el)).toBe(true)
  })

  it('keeps previous items during a transient loading update', () => {
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps({ items: [{ label: 'a' }] } as never))
    const renderer = instances[0]

    api.onUpdate(makeProps({ items: [], loading: true } as never))

    expect(renderer.props.items).toEqual([{ label: 'a' }])

    api.onUpdate(
      makeProps({ items: [{ label: 'b' }], loading: false } as never),
    )

    expect(renderer.props.items).toEqual([{ label: 'b' }])
  })

  it('returns false on Escape so the suggestion plugin runs onExit', () => {
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps())
    expect(api.onKeyDown(keyDown('Escape'))).toBe(false)
    expect(instances[0].onKeyDownSpy).not.toHaveBeenCalled()
  })

  it('delegates other keys to the suggestion list', () => {
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps())
    expect(api.onKeyDown(keyDown('ArrowDown'))).toBe(true)
    expect(instances[0].onKeyDownSpy).toHaveBeenCalled()
  })

  it('ignores a computePosition run that settles after a newer one', async () => {
    position.deferred = true
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps())
    api.onUpdate(makeProps())
    const wrapper = instances[0].el

    expect(position.resolvers).toHaveLength(2)
    // Newer run lands first, then the superseded one tries to overwrite it.
    position.resolvers[1]({ x: 99, y: 99 })
    await flush()
    position.resolvers[0]({ x: 10, y: 20 })
    await flush()

    expect(wrapper?.style.left).toBe('99px')
    expect(wrapper?.style.top).toBe('99px')
  })

  it('repositions when the popup resizes and disconnects on exit', () => {
    const api = createSuggestionRenderer(FakeComponent)
    api.onStart(makeProps())

    const observer = FakeResizeObserver.instances[0]
    expect(observer.observe).toHaveBeenCalledWith(instances[0].el)

    const before = vi.mocked(computePosition).mock.calls.length
    observer.callback()
    expect(vi.mocked(computePosition).mock.calls.length).toBe(before + 1)

    api.onExit()
    expect(observer.disconnect).toHaveBeenCalled()
  })
})

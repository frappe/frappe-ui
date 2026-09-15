/**
 * @vitest-environment jsdom
 *
 * `EditorMenuOptions` spells position as `side` + `align`, the same two axes
 * as Popover and every overlay built on it. Floating UI takes one `placement`
 * string, so the components translate. These tests cover the translation and
 * the fact that the result reaches TipTap's own component.
 */
import { describe, expect, it, vi } from 'vitest'
import { createApp, h } from 'vue'
import { editorMenuPlacement } from './menu-placement'
import type { Editor as EditorInstance } from './useEditor'
import EditorBubbleMenu from './EditorBubbleMenu.vue'
import EditorFloatingMenu from './EditorFloatingMenu.vue'

const recorded: { menu: string; options: Record<string, unknown> }[] = []

vi.mock('@tiptap/vue-3/menus', () => {
  const stub = (menu: string) => ({
    name: menu,
    props: ['editor', 'shouldShow', 'options'],
    setup(props: { options: Record<string, unknown> }) {
      return () => {
        recorded.push({ menu, options: props.options })
        return h('div')
      }
    },
  })
  return { BubbleMenu: stub('BubbleMenu'), FloatingMenu: stub('FloatingMenu') }
})

const components = { EditorBubbleMenu, EditorFloatingMenu }

/** Mount one menu component and return the options TipTap was handed. */
function optionsPassedToTiptap(
  file: keyof typeof components,
  options: Record<string, unknown>,
) {
  recorded.length = 0
  const component = components[file]
  const root = document.createElement('div')
  document.body.appendChild(root)
  // The TipTap component is stubbed above, so the menu only needs a truthy
  // editor to render. Nothing here reads a real editor method.
  const editor = { isEditable: true } as unknown as EditorInstance
  const app = createApp({
    render: () => h(component, { editor, items: [], options }),
  })
  app.mount(root)
  const last = recorded.at(-1)
  app.unmount()
  root.remove()
  if (!last) throw new Error(`${file} rendered no TipTap menu`)
  return last.options
}

describe('editorMenuPlacement', () => {
  it('writes the centred variant as the bare side', () => {
    expect(editorMenuPlacement({ side: 'bottom' }, 'top')).toBe('bottom')
    expect(
      editorMenuPlacement({ side: 'bottom', align: 'center' }, 'top'),
    ).toBe('bottom')
  })

  it('joins the two axes for the aligned variants', () => {
    expect(editorMenuPlacement({ side: 'left', align: 'start' }, 'top')).toBe(
      'left-start',
    )
    expect(editorMenuPlacement({ side: 'right', align: 'end' }, 'top')).toBe(
      'right-end',
    )
  })

  it('falls back to the menu default side when only `align` is set', () => {
    expect(editorMenuPlacement({ align: 'end' }, 'top')).toBe('top-end')
    expect(editorMenuPlacement({ align: 'end' }, 'right')).toBe('right-end')
  })

  it('returns nothing when neither axis is set, so TipTap keeps its default', () => {
    expect(editorMenuPlacement(undefined, 'top')).toBeUndefined()
    expect(editorMenuPlacement({ offset: 8 }, 'top')).toBeUndefined()
  })
})

describe('the placement reaches TipTap', () => {
  it('sends `side` and `align` to the bubble menu as one placement', () => {
    const options = optionsPassedToTiptap('EditorBubbleMenu', {
      side: 'bottom',
      align: 'start',
      offset: 8,
    })
    expect(options).toEqual({ placement: 'bottom-start', offset: 8 })
  })

  it('sends `side` and `align` to the floating menu as one placement', () => {
    const options = optionsPassedToTiptap('EditorFloatingMenu', {
      side: 'left',
      align: 'end',
    })
    expect(options).toEqual({ placement: 'left-end' })
  })

  it('passes no placement when the caller sets neither axis', () => {
    const options = optionsPassedToTiptap('EditorBubbleMenu', {
      offset: 4,
    })
    expect(options).toEqual({ offset: 4 })
  })

  it('keeps `shouldShow` out of the positioning bag', () => {
    const options = optionsPassedToTiptap('EditorFloatingMenu', {
      side: 'top',
      shouldShow: () => true,
    })
    expect(options).toEqual({ placement: 'top' })
  })
})

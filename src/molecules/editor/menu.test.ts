/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { createApp, defineComponent, h } from 'vue'

const menuProps = vi.hoisted(() => ({
  bubble: [] as any[],
  floating: [] as any[],
}))
const fontColorPicker = vi.hoisted(() => ({ open: vi.fn() }))

vi.mock('./components/font-color/fontColorController', () => ({
  openFontColorPicker: fontColorPicker.open,
}))

// EditorBubbleMenu/EditorFloatingMenu import these from `@tiptap/vue-3/menus`
// (the real tiptap-v3 component source). Stub them as slot pass-throughs so the
// wrapper's item rendering can be asserted without tiptap's floating/portal behavior.
vi.mock('@tiptap/vue-3/menus', () => ({
  BubbleMenu: defineComponent({
    props: ['editor', 'options', 'shouldShow'],
    setup(props, { slots }) {
      menuProps.bubble.push(props)
      return () => h('div', { 'data-testid': 'bubble-menu' }, slots.default?.())
    },
  }),
  FloatingMenu: defineComponent({
    props: ['editor', 'options', 'shouldShow'],
    setup(props, { slots }) {
      menuProps.floating.push(props)
      return () =>
        h('div', { 'data-testid': 'floating-menu' }, slots.default?.())
    },
  }),
}))

function mount(component: any, props: Record<string, any>) {
  const root = document.createElement('div')
  createApp({ render: () => h(component, props) }).mount(root)
  return root
}

const DEFAULT_MARKS = ['bold', 'italic', 'strike', 'highlight', 'link']
const DEFAULT_NODES = [
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'horizontalRule',
  'image',
  'video',
  'table',
]
const DEFAULT_EXTENSIONS = ['textAlign', 'color']

function fakeEditor(
  schema: { marks?: string[]; nodes?: string[]; extensions?: string[] } = {},
) {
  const calls: string[] = []
  const toMap = (names: string[]) =>
    Object.fromEntries(names.map((name) => [name, {}]))
  const editor: any = {
    active: new Set(['bold']),
    commands: {
      openLinkEditor: vi.fn(),
      selectAndUploadImage: vi.fn(),
      selectAndUploadVideo: vi.fn(),
    },
    canRun: true,
    isActive: vi.fn((name: unknown) =>
      typeof name === 'string' ? editor.active.has(name) : false,
    ),
    can: () => ({ chain: () => chain }),
    chain: () => chain,
    schema: {
      marks: toMap(schema.marks ?? DEFAULT_MARKS),
      nodes: toMap(schema.nodes ?? DEFAULT_NODES),
    },
    extensionManager: {
      extensions: (schema.extensions ?? DEFAULT_EXTENSIONS).map((name) => ({
        name,
      })),
    },
  }
  const chain: any = new Proxy(
    {},
    {
      get(_target, prop: string) {
        return (...args: any[]) => {
          calls.push(`${prop}:${args.join(',')}`)
          if (prop === 'run') return editor.canRun
          return chain
        }
      },
    },
  )
  return { editor, calls }
}

describe('editor menu primitives and presets', () => {
  it('renders command items, separators, groups, active state, and disabled state in a fixed menu', async () => {
    const { EditorFixedMenu, Bold, Italic, HeadingGroup, Separator } =
      await import('./index')
    const { editor, calls } = fakeEditor()
    editor.canRun = false

    const root = mount(EditorFixedMenu, {
      editor,
      items: [Bold, Separator, Italic, HeadingGroup],
    })

    expect(root.querySelector('[data-slot="fixed-menu"]')).toBeTruthy()
    expect(root.querySelector('[data-slot="menu-separator"]')).toBeTruthy()
    expect(
      root.querySelector('[aria-label="Bold"]')?.getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      (root.querySelector('[aria-label="Italic"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true)
    // The group renders its label as text; its members render icons, so assert
    // them by aria-label rather than visible text.
    expect(root.textContent).toContain('Heading')
    expect(root.querySelector('[aria-label="Heading 2"]')).toBeTruthy()
  })

  it('command item actions call the editor chain', async () => {
    const { EditorFixedMenu, Bold } = await import('./index')
    const { editor, calls } = fakeEditor()

    const root = mount(EditorFixedMenu, { editor, items: [Bold] })
    calls.length = 0
    ;(root.querySelector('[aria-label="Bold"]') as HTMLButtonElement).click()

    expect(calls.join('|')).toContain('focus:|toggleBold:|run:')
  })

  it('hides items whose mark/node/extension is absent (self-pruning)', async () => {
    const { EditorFixedMenu, Bold, InsertTable, AlignLeft } =
      await import('./index')
    // A trimmed editor: no table node, no textAlign extension.
    const { editor } = fakeEditor({ nodes: ['paragraph'], extensions: [] })

    const root = mount(EditorFixedMenu, {
      editor,
      items: [Bold, InsertTable, AlignLeft],
    })

    expect(root.querySelector('[aria-label="Bold"]')).toBeTruthy()
    expect(root.querySelector('[aria-label="Table"]')).toBeFalsy()
    expect(root.querySelector('[aria-label="Align Left"]')).toBeFalsy()
  })

  it('drops a group whose every item is unavailable', async () => {
    const { EditorFixedMenu, HeadingGroup } = await import('./index')
    const { editor } = fakeEditor({ nodes: ['paragraph'] }) // no heading node

    const root = mount(EditorFixedMenu, { editor, items: [HeadingGroup] })

    expect(root.querySelector('[data-slot="menu-group"]')).toBeFalsy()
    expect(root.textContent).not.toContain('Heading 2')
  })

  it('renders bubble and floating menus with the shared item shape', async () => {
    const { EditorBubbleMenu, EditorFloatingMenu, Bold } =
      await import('./index')
    const { editor, calls } = fakeEditor()

    // Items render their icon (not label text), so assert the button by aria-label.
    expect(
      mount(EditorBubbleMenu, {
        editor,
        items: [Bold],
        options: {},
      }).querySelector('[aria-label="Bold"]'),
    ).toBeTruthy()
    expect(
      mount(EditorFloatingMenu, {
        editor,
        items: [Bold],
        options: {},
      }).querySelector('[aria-label="Bold"]'),
    ).toBeTruthy()
  })

  it('passes shouldShow as a menu prop instead of nesting it in Floating UI options', async () => {
    const { EditorBubbleMenu, EditorFloatingMenu, Bold } =
      await import('./index')
    const { editor } = fakeEditor()
    const shouldShow = vi.fn(() => false)

    mount(EditorBubbleMenu, {
      editor,
      items: [Bold],
      options: { shouldShow, placement: 'top' },
    })
    mount(EditorFloatingMenu, {
      editor,
      items: [Bold],
      options: { shouldShow, placement: 'bottom' },
    })

    expect(menuProps.bubble.at(-1).shouldShow).toBe(shouldShow)
    expect(menuProps.bubble.at(-1).options).toEqual({ placement: 'top' })
    expect(menuProps.floating.at(-1).shouldShow).toBe(shouldShow)
    expect(menuProps.floating.at(-1).options).toEqual({ placement: 'bottom' })
  })

  it('wires image, video, and link menu items through editor actions', async () => {
    const { EditorFixedMenu, InsertImage, InsertVideo, InsertLink } =
      await import('./index')
    const { editor, calls } = fakeEditor()

    const root = mount(EditorFixedMenu, {
      editor,
      items: [InsertImage, InsertVideo, InsertLink],
    })

    ;(root.querySelector('[aria-label="Image"]') as HTMLButtonElement).click()
    ;(root.querySelector('[aria-label="Video"]') as HTMLButtonElement).click()
    ;(root.querySelector('[aria-label="Link"]') as HTMLButtonElement).click()

    expect(calls.join('|')).toContain('focus:|selectAndUploadImage:|run:')
    expect(calls.join('|')).toContain('focus:|selectAndUploadVideo:|run:')
    expect(editor.commands.openLinkEditor).toHaveBeenCalled()
  })

  it('opens the font color picker from the menu action with the trigger anchor', async () => {
    const { EditorFixedMenu, FontColor } = await import('./index')
    const { editor } = fakeEditor({ extensions: ['namedColor'] })

    const root = mount(EditorFixedMenu, { editor, items: [FontColor] })
    const button = root.querySelector(
      '[aria-label="Font Color"]',
    ) as HTMLButtonElement
    button.click()

    expect(fontColorPicker.open).toHaveBeenCalledWith({
      editor,
      anchor: button,
    })
  })

  it('exports menu presets as plain arrays', async () => {
    const { commentToolbar, articleToolbar, minimalToolbar } =
      await import('./index')

    expect(Array.isArray(commentToolbar)).toBe(true)
    expect(Array.isArray(articleToolbar)).toBe(true)
    expect(minimalToolbar.map((item: any) => item.label)).toEqual([
      'Bold',
      'Italic',
      'Link',
    ])
  })
})

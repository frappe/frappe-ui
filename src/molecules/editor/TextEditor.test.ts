/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'

// Bubble / floating menus wrap tippy; render their default slot inline so the
// items can be asserted without a real popper.
vi.mock('@tiptap/extension-bubble-menu', () => ({
  BubbleMenu: {
    props: ['editor', 'options'],
    setup(_: any, { slots }: any) {
      return () => h('div', { 'data-testid': 'bubble-menu' }, slots.default?.())
    },
  },
}))
vi.mock('@tiptap/extension-floating-menu', () => ({
  FloatingMenu: {
    props: ['editor', 'options'],
    setup(_: any, { slots }: any) {
      return () =>
        h('div', { 'data-testid': 'floating-menu' }, slots.default?.())
    },
  },
}))

let TextEditor: any
let EditorContent: any
let StarterKit: any
let Placeholder: any
let CommentKit: any
let RichTextKit: any
let commentToolbar: any
let articleToolbar: any
let Bold: any

beforeEach(async () => {
  ;({ default: TextEditor } = await import('./TextEditor.vue'))
  ;({ default: EditorContent } = await import('./EditorContent.vue'))
  ;({ StarterKit, Placeholder } = await import('./extensions'))
  ;({ CommentKit, RichTextKit } = await import('./kits'))
  ;({ commentToolbar, articleToolbar, Bold } = await import('./index'))
})

type MountOptions = {
  reactiveProps?: Record<string, any>
  slots?: Record<string, any>
  capture?: boolean
}

function mount(staticProps: Record<string, any>, options: MountOptions = {}) {
  const state = reactive<Record<string, any>>({
    modelValue: '',
    ...(options.reactiveProps ?? {}),
  })
  const changes: any[] = []
  let editor: any = null
  const slots: Record<string, any> = { ...(options.slots ?? {}) }
  if (options.capture) {
    slots.default = ({ editor: e }: any) => {
      editor = e
      return h(EditorContent, { editor: e })
    }
  }
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        TextEditor,
        {
          ...staticProps,
          ...state,
          'onUpdate:modelValue': (v: any) => (state.modelValue = v),
          onChange: (v: any) => changes.push(v),
        },
        slots,
      )
    },
  })
  app.mount(root)
  return { root, state, changes, getEditor: () => editor, app }
}

describe('TextEditor', () => {
  it('renders HTML v-model content and reflects external updates', async () => {
    const ctx = mount(
      { extensions: [StarterKit] },
      { reactiveProps: { modelValue: '<p>Hello</p>' } },
    )
    await nextTick()
    expect(ctx.root.textContent).toContain('Hello')

    ctx.state.modelValue = '<p>Updated externally</p>'
    await nextTick()
    expect(ctx.root.textContent).toContain('Updated externally')
  })

  it('writes edits back to v-model and emits change (HTML)', async () => {
    const ctx = mount({ extensions: [StarterKit] }, { capture: true })
    await nextTick()
    ctx.getEditor().commands.setContent('<p>typed</p>')
    await nextTick()
    expect(ctx.state.modelValue).toBe('<p>typed</p>')
    expect(ctx.changes.at(-1)).toBe('<p>typed</p>')
  })

  it('carries JSONContent when format="json"', async () => {
    const json = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] }],
    }
    const ctx = mount(
      { extensions: [StarterKit], format: 'json' },
      { reactiveProps: { modelValue: json }, capture: true },
    )
    await nextTick()
    ctx.getEditor().commands.setContent({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'changed' }] },
      ],
    })
    await nextTick()
    expect(typeof ctx.state.modelValue).toBe('object')
    expect(JSON.stringify(ctx.state.modelValue)).toContain('changed')
  })

  it('keeps editable reactive', async () => {
    const ctx = mount(
      { extensions: [StarterKit] },
      { reactiveProps: { editable: true }, capture: true },
    )
    await nextTick()
    expect(ctx.getEditor().isEditable).toBe(true)
    ctx.state.editable = false
    await nextTick()
    expect(ctx.getEditor().isEditable).toBe(false)
  })

  it('threads the placeholder prop through editor.storage.placeholder reactively', async () => {
    const ctx = mount(
      { extensions: [StarterKit, Placeholder] },
      { reactiveProps: { placeholder: 'Write…' }, capture: true },
    )
    await nextTick()
    expect(ctx.getEditor().storage.placeholder.text).toBe('Write…')
    ctx.state.placeholder = 'Say something'
    await nextTick()
    expect(ctx.getEditor().storage.placeholder.text).toBe('Say something')
  })

  it('renders a fixed menu from the prop with self-pruned items', async () => {
    const ctx = mount({ extensions: [StarterKit], fixedMenu: [Bold] })
    await nextTick()
    expect(ctx.root.querySelector('[data-slot="fixed-menu"]')).toBeTruthy()
    expect(ctx.root.querySelector('[aria-label="Bold"]')).toBeTruthy()
  })

  it('lets the #fixedMenu slot override the fixed-menu prop', async () => {
    const ctx = mount(
      { extensions: [StarterKit], fixedMenu: [Bold] },
      {
        slots: {
          fixedMenu: () =>
            h('div', { 'data-testid': 'custom-fixed' }, 'custom'),
        },
      },
    )
    await nextTick()
    expect(ctx.root.querySelector('[data-testid="custom-fixed"]')).toBeTruthy()
    // The default EditorFixedMenu is replaced, so its Bold button is gone.
    expect(ctx.root.querySelector('[aria-label="Bold"]')).toBeFalsy()
  })

  it('renders bubble and floating menus from props', async () => {
    const bubble = mount({ extensions: [StarterKit], bubbleMenu: [Bold] })
    await nextTick()
    expect(
      bubble.root.querySelector('[data-testid="bubble-menu"]'),
    ).toBeTruthy()
    expect(bubble.root.querySelector('[aria-label="Bold"]')).toBeTruthy()

    const floating = mount({ extensions: [StarterKit], floatingMenu: [Bold] })
    await nextTick()
    expect(
      floating.root.querySelector('[data-testid="floating-menu"]'),
    ).toBeTruthy()
  })

  it('renders the actions slot in the toolbar with isEmpty', async () => {
    const ctx = mount(
      { extensions: [StarterKit] },
      {
        reactiveProps: { modelValue: '' },
        slots: {
          actions: ({ isEmpty }: any) =>
            h('button', { 'data-testid': 'submit', disabled: isEmpty }, 'Send'),
        },
      },
    )
    await nextTick()
    const button = ctx.root.querySelector(
      '[data-testid="submit"]',
    ) as HTMLButtonElement
    expect(button).toBeTruthy()
    expect(button.disabled).toBe(true) // empty content -> isEmpty true
  })

  it('positions the fixed menu at the bottom when configured', async () => {
    const ctx = mount({
      extensions: [StarterKit],
      fixedMenu: [Bold],
      fixedMenuPosition: 'bottom',
    })
    await nextTick()
    const children = Array.from(
      (ctx.root.querySelector('[data-slot="text-editor"]') as HTMLElement)
        .children,
    )
    const contentIndex = children.findIndex((c) =>
      c.matches('[data-slot="editor-content"]'),
    )
    const toolbarIndex = children.findIndex((c) =>
      c.matches('[data-slot="toolbar"]'),
    )
    expect(toolbarIndex).toBeGreaterThan(contentIndex)
  })

  it('hands the whole layout to the #default slot (L3) and renders no default chrome', async () => {
    const ctx = mount(
      { extensions: [StarterKit], fixedMenu: [Bold] },
      {
        slots: {
          default: ({ editor }: any) =>
            h('div', { 'data-testid': 'bespoke' }, [
              h(EditorContent, { editor }),
            ]),
        },
      },
    )
    await nextTick()
    expect(ctx.root.querySelector('[data-testid="bespoke"]')).toBeTruthy()
    // No default wrapper/toolbar when #default takes over.
    expect(ctx.root.querySelector('[data-slot="text-editor"]')).toBeFalsy()
    expect(ctx.root.querySelector('[data-slot="toolbar"]')).toBeFalsy()
  })

  it('composes a comment-shape editor from CommentKit + commentToolbar (no ready-made)', async () => {
    const ctx = mount({
      extensions: [CommentKit],
      fixedMenu: commentToolbar,
      fixedMenuPosition: 'bottom',
    })
    await nextTick()
    expect(ctx.root.querySelector('[data-slot="fixed-menu"]')).toBeTruthy()
    expect(ctx.root.querySelector('[aria-label="Bold"]')).toBeTruthy()
    expect(ctx.root.querySelector('[aria-label="Link"]')).toBeTruthy()
    // CommentKit has no table, so the article preset's Table button self-prunes.
    expect(ctx.root.querySelector('[aria-label="Table"]')).toBeFalsy()
  })

  it('composes an article-shape editor from RichTextKit + articleToolbar', async () => {
    const ctx = mount({ extensions: [RichTextKit], fixedMenu: articleToolbar })
    await nextTick()
    expect(ctx.root.querySelector('[aria-label="Bold"]')).toBeTruthy()
    // RichTextKit has tables, so the Table button is available here.
    expect(ctx.root.querySelector('[aria-label="Table"]')).toBeTruthy()
  })
})

/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'

let TextEditor: any
let EditorContent: any
let EditorFixedMenu: any
let StarterKit: any
let Placeholder: any
let CommentKit: any
let RichTextKit: any
let commentToolbar: any
let articleToolbar: any

beforeEach(async () => {
  ;({ default: TextEditor } = await import('./TextEditor.vue'))
  ;({ default: EditorContent } = await import('./EditorContent.vue'))
  ;({ default: EditorFixedMenu } = await import('./EditorFixedMenu.vue'))
  ;({ StarterKit, Placeholder } = await import('./extensions'))
  ;({ CommentKit, RichTextKit } = await import('./kits'))
  ;({ commentToolbar, articleToolbar } = await import('./index'))
})

type MountOptions = {
  reactiveProps?: Record<string, any>
  slots?: Record<string, any>
}

// <TextEditor> is renderless, so every mount must supply a #default slot. By
// default we render EditorContent and capture the editor; tests that need a
// bespoke layout pass their own default slot.
function mount(staticProps: Record<string, any>, options: MountOptions = {}) {
  const state = reactive<Record<string, any>>({
    modelValue: '',
    ...(options.reactiveProps ?? {}),
  })
  const changes: any[] = []
  let editor: any = null
  const slots: Record<string, any> = { ...(options.slots ?? {}) }
  if (!slots.default) {
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
    const ctx = mount({ extensions: [StarterKit] })
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
      { reactiveProps: { modelValue: json } },
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
      { reactiveProps: { editable: true } },
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
      { reactiveProps: { placeholder: 'Write…' } },
    )
    await nextTick()
    expect(ctx.getEditor().storage.placeholder.text).toBe('Write…')
    ctx.state.placeholder = 'Say something'
    await nextTick()
    expect(ctx.getEditor().storage.placeholder.text).toBe('Say something')
  })

  it('is renderless — outputs only the default slot, no chrome of its own', async () => {
    const ctx = mount(
      { extensions: [StarterKit] },
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
    const bespoke = ctx.root.querySelector(
      '[data-testid="bespoke"]',
    ) as HTMLElement
    expect(bespoke).toBeTruthy()
    // The consumer's EditorContent is mounted inside their own layout…
    expect(bespoke.querySelector('[data-slot="editor-content"]')).toBeTruthy()
    // …and <TextEditor> injected no wrapper element of its own.
    expect(ctx.root.firstElementChild).toBe(bespoke)
  })

  it('renders menus in the slot via the building blocks + a preset', async () => {
    const ctx = mount(
      { extensions: [CommentKit] },
      {
        slots: {
          default: ({ editor }: any) =>
            h('div', [
              h(EditorContent, { editor }),
              h(EditorFixedMenu, { editor, items: commentToolbar }),
            ]),
        },
      },
    )
    await nextTick()
    expect(ctx.root.querySelector('[data-slot="fixed-menu"]')).toBeTruthy()
    expect(ctx.root.querySelector('[aria-label="Bold"]')).toBeTruthy()
    expect(ctx.root.querySelector('[aria-label="Link"]')).toBeTruthy()
  })

  it('self-prunes a preset across kits — Table hides under CommentKit, shows under RichTextKit', async () => {
    const slot = ({ editor }: any) =>
      h(EditorFixedMenu, { editor, items: articleToolbar })

    const comment = mount(
      { extensions: [CommentKit] },
      { slots: { default: slot } },
    )
    await nextTick()
    expect(comment.root.querySelector('[aria-label="Bold"]')).toBeTruthy()
    // CommentKit has no table node, so the article preset's Table button self-prunes.
    expect(comment.root.querySelector('[aria-label="Table"]')).toBeFalsy()

    const article = mount(
      { extensions: [RichTextKit] },
      { slots: { default: slot } },
    )
    await nextTick()
    expect(article.root.querySelector('[aria-label="Table"]')).toBeTruthy()
  })

  // Mounts TextEditor under a function ref so the exposed surface can be read the
  // way an app component built on <TextEditor> reads it (spec §2 escape hatch).
  // No slot is needed: the editor lifecycle runs regardless of what's rendered.
  function mountWithRef(props: Record<string, any>) {
    let instance: any = null
    const state = reactive<Record<string, any>>({ modelValue: '' })
    const root = document.createElement('div')
    document.body.appendChild(root)
    const app = createApp({
      render() {
        return h(TextEditor, {
          ref: (r: any) => (instance = r),
          ...props,
          modelValue: state.modelValue,
          'onUpdate:modelValue': (v: any) => (state.modelValue = v),
        })
      },
    })
    app.mount(root)
    return { getInstance: () => instance, state, app }
  }

  it('exposes the live editor instance and isEmpty via template ref', async () => {
    const ctx = mountWithRef({ extensions: [StarterKit] })
    await nextTick()
    const instance = ctx.getInstance()
    // proxyRefs unwraps the exposed refs: .editor is the Editor, .isEmpty a boolean.
    expect(instance.editor?.commands).toBeTruthy()
    expect(instance.isEmpty).toBe(true)
    instance.editor.commands.setContent('<p>filled</p>')
    await nextTick()
    expect(instance.isEmpty).toBe(false)
    ctx.app.unmount()
  })

  it('emits transaction with the editor on document changes', async () => {
    const seen: any[] = []
    const ctx = mountWithRef({
      extensions: [StarterKit],
      onTransaction: (e: any) => seen.push(e),
    })
    await nextTick()
    const before = seen.length
    ctx.getInstance().editor.commands.setContent('<p>x</p>')
    await nextTick()
    expect(seen.length).toBeGreaterThan(before)
    expect(typeof seen.at(-1).getHTML).toBe('function') // received the Editor
    ctx.app.unmount()
  })
})

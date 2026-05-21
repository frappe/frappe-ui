/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref, toRaw } from 'vue'

const editors: any[] = []

vi.mock('@tiptap/core', () => {
  class Extension {
    static create(config: any) {
      return config
    }
  }
  const Node = Extension
  const mergeAttributes = (...attrs: any[]) => Object.assign({}, ...attrs)
  const nodeInputRule = vi.fn()

  class Editor {
    options: any
    destroyed = false
    editable: boolean
    storage: Record<string, any> = {}
    commands = {
      setContent: vi.fn((content: any) => {
        this.content = content
        this.options.onUpdate?.({ editor: this })
      }),
    }
    content: any

    constructor(options: any) {
      this.options = options
      this.content = options.content ?? ''
      this.editable = options.editable ?? true
      for (const extension of options.extensions ?? []) {
        if (extension.name && extension.addStorage) {
          this.storage[extension.name] = extension.addStorage()
        }
      }
      editors.push(this)
    }

    getHTML() {
      return typeof this.content === 'string' ? this.content : '<p>json</p>'
    }

    getJSON() {
      return typeof this.content === 'object' ? this.content : { type: 'doc', content: [] }
    }

    setEditable(value: boolean) {
      this.editable = value
    }

    destroy() {
      this.destroyed = true
    }
  }

  return { Editor, Extension, Node, mergeAttributes, nodeInputRule }
})

vi.mock('@tiptap/vue-3', () => ({
  EditorContent: defineComponent({
    props: ['editor'],
    setup() {
      return () => h('div', { 'data-testid': 'tiptap-editor-content' })
    },
  }),
  NodeViewWrapper: defineComponent({
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
  VueNodeViewRenderer: vi.fn((component) => component),
  VueRenderer: vi.fn(),
  nodeViewProps: {},
}))

beforeEach(() => {
  editors.length = 0
})

describe('frappe-ui/editor minimal primitives', () => {
  it('exports a public primitive editor surface', async () => {
    const editor = await import('./index')

    expect(typeof editor.useEditor).toBe('function')
    expect(editor.EditorContent).toBeTruthy()
    expect(editor.StarterKit).toBeTruthy()
    expect(editor.Placeholder).toBeTruthy()
    expect(editor.SuggestionExtension).toBeTruthy()
    expect(typeof editor.SuggestionExtension.configure).toBe('function')
  })

  it('creates and destroys a shallow editor ref', async () => {
    const { useEditor } = await import('./index')
    let editorRef: ReturnType<typeof useEditor> | undefined

    const app = createApp(
      defineComponent({
        setup() {
          editorRef = useEditor({ extensions: [] })
          return () => null
        },
      }),
    )
    const root = document.createElement('div')
    app.mount(root)

    expect(editorRef?.value).toBe(editors[0])
    app.unmount()
    expect(editors[0].destroyed).toBe(true)
  })

  it('binds HTML content in both directions without rewriting equal external HTML', async () => {
    const { useEditor } = await import('./index')
    const content = ref('<p>Hello</p>')

    createApp(
      defineComponent({
        setup() {
          useEditor({ content, extensions: [] })
          return () => null
        },
      }),
    ).mount(document.createElement('div'))

    const editor = editors[0]
    expect(editor.options.content).toBe('<p>Hello</p>')

    editor.content = '<p>Internal</p>'
    editor.options.onUpdate({ editor })
    expect(content.value).toBe('<p>Internal</p>')

    content.value = '<p>Internal</p>'
    await nextTick()
    expect(editor.commands.setContent).not.toHaveBeenCalled()

    content.value = '<p>External</p>'
    await nextTick()
    expect(editor.commands.setContent).toHaveBeenCalledWith('<p>External</p>', { emitUpdate: false })
  })

  it('binds JSON content bidirectionally without echoing external writes back', async () => {
    const { useEditor } = await import('./index')
    const initial = { type: 'doc', content: [] }
    const external = { type: 'doc', content: [{ type: 'paragraph' }] }
    const content = ref<any>(initial)

    createApp(
      defineComponent({
        setup() {
          useEditor({ content, format: 'json', extensions: [] })
          return () => null
        },
      }),
    ).mount(document.createElement('div'))

    const editor = editors[0]
    content.value = external
    await nextTick()

    expect(editor.commands.setContent).toHaveBeenCalledWith(external, { emitUpdate: false })
    expect(toRaw(content.value)).toBe(external)

    editor.content = { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
    editor.options.onUpdate({ editor })
    expect(toRaw(content.value)).toBe(editor.content)
  })

  it('keeps editable reactive', async () => {
    const { useEditor } = await import('./index')
    const editable = ref(true)

    createApp(
      defineComponent({
        setup() {
          useEditor({ editable, extensions: [] })
          return () => null
        },
      }),
    ).mount(document.createElement('div'))

    editable.value = false
    await nextTick()
    expect(editors[0].editable).toBe(false)
  })

  it('disables content binding and initial content in collaboration mode', async () => {
    const { useEditor } = await import('./index')
    const content = ref('<p>Ignored</p>')

    createApp(
      defineComponent({
        setup() {
          useEditor({ content, extensions: [{ name: 'collaboration' } as any] })
          return () => null
        },
      }),
    ).mount(document.createElement('div'))

    const editor = editors[0]
    expect(editor.options.content).toBeUndefined()

    content.value = '<p>External</p>'
    await nextTick()
    expect(editor.commands.setContent).not.toHaveBeenCalled()

    editor.content = '<p>Internal</p>'
    editor.options.onUpdate({ editor })
    expect(content.value).toBe('<p>External</p>')
  })
})

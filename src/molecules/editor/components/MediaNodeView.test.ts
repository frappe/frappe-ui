/**
 * @vitest-environment jsdom
 *
 * The caption field rendered by the media node view.
 *
 * Two bugs are pinned here: the caption input was unusable because the node
 * view is an inline draggable leaf (the browser drags the image instead of
 * focusing the field), and one image's caption could show up under the next
 * one when ProseMirror reused the node view.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'

let Editor: any
let EditorContent: any
let CommentKit: any

beforeEach(async () => {
  ;({ default: Editor } = await import('../Editor.vue'))
  ;({ default: EditorContent } = await import('../EditorContent.vue'))
  ;({ CommentKit } = await import('../kits'))
})

function mount(html: string, editable = true) {
  const state = reactive<Record<string, any>>({ modelValue: html, editable })
  let editor: any = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        Editor,
        {
          extensions: [CommentKit],
          ...state,
          'onUpdate:modelValue': (v: any) => (state.modelValue = v),
        },
        {
          default: ({ editor: e }: any) => {
            editor = e
            return h(EditorContent, { editor: e })
          },
        },
      )
    },
  })
  app.mount(root)
  return { root, state, app, getEditor: () => editor }
}

/** Flush Vue + the node-view renderer, which mounts on its own tick. */
async function settle() {
  for (let i = 0; i < 4; i += 1) await nextTick()
}

function captionInputs(root: HTMLElement): HTMLInputElement[] {
  return Array.from(root.querySelectorAll('input[aria-label="Caption"]'))
}

describe('media node view caption field', () => {
  it('renders an editable caption input seeded from data-caption', async () => {
    const ctx = mount('<p><img src="/files/a.png" data-caption="Hello"></p>')
    await settle()

    const inputs = captionInputs(ctx.root)
    expect(inputs).toHaveLength(1)
    expect(inputs[0].value).toBe('Hello')
    ctx.app.unmount()
  })

  it('opts the caption field out of the node view drag', async () => {
    const ctx = mount('<p><img src="/files/a.png" data-caption="Hello"></p>')
    await settle()

    const field = ctx.root.querySelector(
      '[data-media-text-field]',
    ) as HTMLElement
    // ProseMirror sets draggable=true on the node view wrapper because the
    // image node is draggable. An input under a draggable ancestor cannot be
    // focused with the mouse, so the field opts out explicitly.
    expect(field.getAttribute('draggable')).toBe('false')

    const wrapper = field.closest('[data-node-view-wrapper]') as HTMLElement
    expect(wrapper.getAttribute('draggable')).toBe('true')

    // A pointerdown in the field must not reach the editor, which would turn it
    // into a node selection and pull focus straight back out of the input.
    let reachedEditor = false
    ctx.root.addEventListener('mousedown', () => {
      reachedEditor = true
    })
    captionInputs(ctx.root)[0].dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )
    expect(reachedEditor).toBe(false)

    ctx.app.unmount()
  })

  it('writes a typed caption to the caption attr and leaves alt alone', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" alt="Screenshot 2020-05-09 11.04.00"></p>',
    )
    await settle()

    // Legacy alt does not open the caption field, so open it as a user would:
    // through the media menu, which portals out of the editor root.
    const trigger = ctx.root.querySelector(
      'button[aria-label="Media options"]',
    ) as HTMLButtonElement
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    trigger.click()
    await settle()

    const toggle = document.body.querySelector(
      'button[role="switch"]',
    ) as HTMLButtonElement
    toggle.click()
    await settle()

    const input = captionInputs(ctx.root)[0]
    input.value = 'A real caption'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))
    await settle()

    const html = ctx.getEditor().getHTML()
    expect(html).toContain('data-caption="A real caption"')
    expect(html).toContain('alt="Screenshot 2020-05-09 11.04.00"')

    ctx.app.unmount()
  })
})

describe('media node view in read mode', () => {
  it('renders the caption as text, not a disabled input', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" data-caption="Our office cat"></p>',
      false,
    )
    await settle()

    expect(captionInputs(ctx.root)).toHaveLength(0)
    expect(ctx.root.textContent).toContain('Our office cat')
    ctx.app.unmount()
  })

  it('shows nothing for a legacy image whose alt holds an upload filename', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" alt="Screenshot 2020-05-09 11.04.00"></p>',
      false,
    )
    await settle()

    expect(captionInputs(ctx.root)).toHaveLength(0)
    expect(ctx.root.textContent).not.toContain('Screenshot 2020-05-09')
    ctx.app.unmount()
  })
})

describe('media node view reuse', () => {
  it('does not carry a caption over to the next image', async () => {
    const ctx = mount(
      '<p><img src="/files/a.png" data-caption="First"><img src="/files/b.png" data-caption="Second"></p>',
    )
    await settle()
    expect(captionInputs(ctx.root).map((i) => i.value)).toEqual([
      'First',
      'Second',
    ])

    // Drop the first image. The second one slides into its position, which is
    // exactly when ProseMirror hands an existing inline node view a different
    // node and the stale caption used to stick.
    const editor = ctx.getEditor()
    editor.commands.setNodeSelection(1)
    editor.commands.deleteSelection()
    await settle()

    expect(captionInputs(ctx.root).map((i) => i.value)).toEqual(['Second'])
    ctx.app.unmount()
  })
})

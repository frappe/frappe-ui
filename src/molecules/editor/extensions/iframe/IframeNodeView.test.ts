/**
 * @vitest-environment jsdom
 *
 * Keyboard resize on the embed's corner handle.
 *
 * The handle is focusable, so the arrow keys have to resize the embed rather
 * than reach the wrapper's `keydown`, which reads Up/Down as "move the caret
 * out of the node" — that left embeds pointer-only for resizing.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'

let Editor: any
let EditorContent: any
let RichTextKit: any

beforeEach(async () => {
  ;({ default: Editor } = await import('../../Editor.vue'))
  ;({ default: EditorContent } = await import('../../EditorContent.vue'))
  ;({ RichTextKit } = await import('../../kits'))
})

const EMBED =
  '<iframe src="https://www.youtube.com/embed/abc" width="640" height="360"></iframe>'

function mount(html: string) {
  const state = reactive<Record<string, any>>({ modelValue: html })
  let editor: any = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        Editor,
        {
          extensions: [RichTextKit],
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
  return { root, app, getEditor: () => editor }
}

/** Flush Vue + the node-view renderer, which mounts on its own tick. */
async function settle() {
  for (let i = 0; i < 4; i += 1) await nextTick()
}

function iframePos(editor: any): number {
  let pos = -1
  editor.state.doc.descendants((node: any, at: number) => {
    if (pos === -1 && node.type.name === 'iframe') pos = at
  })
  return pos
}

async function selectEmbed(ctx: ReturnType<typeof mount>) {
  const editor = ctx.getEditor()
  editor.commands.setNodeSelection(iframePos(editor))
  await settle()
  return editor
}

function pressOnHandle(root: HTMLElement, key: string): void {
  const handle = root.querySelector<HTMLButtonElement>(
    '[aria-label="Resize embed"]',
  )
  expect(handle).not.toBeNull()
  handle!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

describe('embed resize handle — keyboard', () => {
  it('grows and shrinks the embed with the arrow keys', async () => {
    const ctx = mount(EMBED)
    await settle()
    const editor = await selectEmbed(ctx)

    pressOnHandle(ctx.root, 'ArrowRight')
    await settle()
    expect(editor.state.doc.nodeAt(iframePos(editor)).attrs.width).toBe(660)

    pressOnHandle(ctx.root, 'ArrowLeft')
    await settle()
    expect(editor.state.doc.nodeAt(iframePos(editor)).attrs.width).toBe(640)

    ctx.app.unmount()
  })

  it('resizes on Down/Up instead of moving the caret out of the node', async () => {
    const ctx = mount(EMBED)
    await settle()
    const editor = await selectEmbed(ctx)

    pressOnHandle(ctx.root, 'ArrowDown')
    await settle()

    const node = editor.state.doc.nodeAt(iframePos(editor))
    expect(node.attrs.width).toBe(660)
    // Height follows the locked ratio, and the embed is still the selection —
    // the wrapper's ArrowDown handler never ran.
    expect(node.attrs.height).toBe(Math.round(660 * (360 / 640)))
    expect(editor.state.selection.node?.type.name).toBe('iframe')

    ctx.app.unmount()
  })
})

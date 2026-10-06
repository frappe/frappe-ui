/**
 * @vitest-environment jsdom
 *
 * Keyboard resize on the embed's corner handle.
 *
 * The handle is focusable, so the arrow keys have to resize the embed rather
 * than reach the wrapper's `keydown`, which reads Up/Down as "move the caret
 * out of the node" — that left embeds pointer-only for resizing.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
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
    '[aria-label^="Resize embed"]',
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

describe('embed card, per the design', () => {
  const SRC = 'https://www.youtube.com/embed/aqz-KE-bpKQ'
  async function mountEmbed(html = `<iframe src="${SRC}"></iframe>`) {
    const ctx = mount(html)
    await settle()
    ctx.getEditor().commands.setNodeSelection(0)
    await settle()
    return ctx
  }
  function rows(): HTMLElement[] {
    return Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    )
  }
  async function openMenu(root: HTMLElement) {
    const trigger = root.querySelector(
      'button[aria-label="Media options"]',
    ) as HTMLButtonElement
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    trigger.click()
    await settle()
  }
  async function pick(label: string) {
    const el = rows().find((r) => r.textContent?.trim() === label)!
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    el.click()
    await settle()
  }

  it('fills the column on its platform ratio, with the shape kept in HTML', async () => {
    const ctx = await mountEmbed()
    const frame = ctx.root.querySelector('iframe') as HTMLIFrameElement
    expect(frame.style.width).toBe('100%')
    expect(frame.style.aspectRatio).toMatch(/^1 \/ 0\.56/)
    expect(ctx.getEditor().getHTML()).toContain('data-aspect-ratio="0.5625"')
    ctx.app.unmount()
  })

  it("lists the design's six rows, undivided, and asks before deleting", async () => {
    const ctx = await mountEmbed()
    await openMenu(ctx.root)
    expect(rows().map((r) => r.textContent?.trim())).toEqual([
      'Captions',
      'Replace',
      'Open in Browser',
      'Align',
      'Duplicate',
      'Delete',
    ])
    expect(document.body.querySelector('[role="separator"]')).toBeNull()

    await pick('Delete')
    // the embed is still there; the dialog asks first
    expect(ctx.getEditor().state.doc.firstChild?.type.name).toBe('iframe')
    await settle()
    await new Promise((r) => setTimeout(r, 50))
    await settle()
    const dialog = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="dialog"]'),
    ).find((d) => d.textContent?.includes('Remove Embed'))!
    expect(dialog).toBeDefined()
    expect(dialog.textContent).toContain(
      'This embedded content will be removed from the document.',
    )
    const confirm = Array.from(dialog.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Delete',
    )!
    confirm.click()
    await settle()
    expect(ctx.getEditor().state.doc.firstChild?.type.name).not.toBe('iframe')
    ctx.app.unmount()
  })

  it('opens the link in a new tab and duplicates the embed', async () => {
    const ctx = await mountEmbed()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    await openMenu(ctx.root)
    await pick('Open in Browser')
    expect(open).toHaveBeenCalledWith(SRC, '_blank', 'noopener')
    open.mockRestore()

    ctx.getEditor().commands.setNodeSelection(0)
    await settle()
    await openMenu(ctx.root)
    await pick('Duplicate')
    const embeds: string[] = []
    ctx.getEditor().state.doc.descendants((n: any) => {
      if (n.type.name === 'iframe') embeds.push(n.attrs.src)
    })
    expect(embeds).toEqual([SRC, SRC])
    ctx.app.unmount()
  })

  it("shows the design's failed box when the frame errors, and tries again", async () => {
    const ctx = await mountEmbed()
    const frame = ctx.root.querySelector('iframe') as HTMLIFrameElement
    frame.dispatchEvent(new Event('error'))
    await settle()
    expect(ctx.root.querySelector('iframe')).toBeNull()
    const box = ctx.root.querySelector('[role="status"]')!
    expect(box.textContent).toContain(
      'We couldn’t load a preview for this content.',
    )
    expect(ctx.root.querySelector('[aria-label^="Resize embed"]')).toBeNull()
    const retry = Array.from(box.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Try again',
    )!
    retry.click()
    await settle()
    expect(ctx.root.querySelector('iframe')).not.toBeNull()
    ctx.app.unmount()
  })
})

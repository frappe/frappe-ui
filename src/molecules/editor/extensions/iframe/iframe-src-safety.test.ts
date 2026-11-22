/**
 * @vitest-environment jsdom
 *
 * An iframe `src` must be an allowed http(s) embed no matter how the node got
 * into the document. HTML goes through the parse rule, but JSON content,
 * `setContent` and collaboration updates create the node from its attrs
 * directly, so the render side has to check `src` too.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { createApp, h, nextTick } from 'vue'

let Editor: any
let EditorContent: any
let RichTextKit: any

beforeEach(async () => {
  ;({ default: Editor } = await import('../../Editor.vue'))
  ;({ default: EditorContent } = await import('../../EditorContent.vue'))
  ;({ RichTextKit } = await import('../../kits'))
})

const ALLOWED = 'https://www.youtube.com/embed/abc'

const UNSAFE_SRCS = [
  'javascript:void 0',
  ' JaVaScRiPt:void 0',
  'data:text/html,<p>x</p>',
  '//example.invalid/page',
  'https://example.invalid/page',
  `${window.location.origin}/app`,
]

type Format = 'html' | 'json'

function iframeHTML(src: string): string {
  return `<iframe src="${src.replace(/"/g, '&quot;')}"></iframe>`
}

function iframeJSON(src: string) {
  return { type: 'doc', content: [{ type: 'iframe', attrs: { src } }] }
}

function mount(content: unknown, format: Format, editable = true) {
  let editor: any = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        Editor,
        { extensions: [RichTextKit], modelValue: content, format, editable },
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

function renderedSrcs(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('iframe[src]')).map(
    (el) => el.getAttribute('src') ?? '',
  )
}

function serializedSrcs(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return Array.from(doc.querySelectorAll('iframe[src]')).map(
    (el) => el.getAttribute('src') ?? '',
  )
}

describe.each(UNSAFE_SRCS)('iframe src %j', (src) => {
  it.each([
    ['JSON', () => iframeJSON(src), 'json', true],
    ['JSON, read-only', () => iframeJSON(src), 'json', false],
    ['HTML', () => iframeHTML(src), 'html', true],
    ['HTML, read-only', () => iframeHTML(src), 'html', false],
  ] as const)(
    'is not rendered when loaded as %s',
    async (_, content, format, editable) => {
      const ctx = mount(content(), format, editable)
      await settle()

      expect(renderedSrcs(ctx.root)).toEqual([])
      expect(serializedSrcs(ctx.getEditor().getHTML())).toEqual([])

      ctx.app.unmount()
    },
  )

  it('is not rendered when it arrives later through a transaction', async () => {
    const ctx = mount('<p>hello</p>', 'html')
    await settle()
    const editor = ctx.getEditor()

    // setContent and remote collaboration steps both build nodes from JSON.
    editor.commands.setContent(iframeJSON(src))
    await settle()
    expect(renderedSrcs(ctx.root)).toEqual([])

    editor.commands.insertContent({ type: 'iframe', attrs: { src } })
    await settle()
    expect(renderedSrcs(ctx.root)).toEqual([])
    expect(serializedSrcs(editor.getHTML())).toEqual([])

    ctx.app.unmount()
  })
})

describe('allowed iframe src', () => {
  it.each(['json', 'html'] as const)(
    'renders when loaded as %s',
    async (format) => {
      const content =
        format === 'json' ? iframeJSON(ALLOWED) : iframeHTML(ALLOWED)
      const ctx = mount(content, format)
      await settle()

      expect(renderedSrcs(ctx.root)).toEqual([ALLOWED])
      expect(serializedSrcs(ctx.getEditor().getHTML())).toEqual([ALLOWED])

      ctx.app.unmount()
    },
  )
})

describe('same-origin embeds', () => {
  it('are refused even when the app allowlists its own host', async () => {
    const { validateIframeUrl } = await import('./iframe-allowlist')
    const allowlist = [window.location.hostname]

    expect(
      validateIframeUrl(`${window.location.origin}/app`, { allowlist }),
    ).toBe(false)
  })
})

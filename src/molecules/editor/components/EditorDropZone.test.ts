/**
 * @vitest-environment jsdom
 *
 * The overlay is a promise: "drop files here". A read-only editor refuses every
 * drop, so it must not make that promise. `editable: false` alone — without the
 * `disabled` prop — is the ordinary way to render a read-only editor, so the
 * overlay has to read the editor, not just the prop.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { createApp, h } from 'vue'
import EditorDropZone from './EditorDropZone.vue'
import { CommentKit } from '../kits'
import { flush, mount as mountEditor } from '../test-helpers'
import type { Editor as TiptapEditor } from '../useEditor'

const LABEL = 'Drop files to upload'

type Teardown = () => void
const teardowns: Teardown[] = []

/**
 * Mounts the zone on its own, with a real tiptap instance from the shared
 * helper: the shared `mount` renders `Editor`, which does not wrap itself in a
 * drop zone.
 */
function mountZone(props: {
  editor: TiptapEditor | null
  disabled?: boolean
}): HTMLElement {
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({ render: () => h(EditorDropZone, props) })
  app.mount(root)
  teardowns.push(() => {
    app.unmount()
    root.remove()
  })
  return root
}

function editorFor(options: { editable?: boolean }): TiptapEditor {
  const ctx = mountEditor({ extensions: [CommentKit], ...options })
  teardowns.push(() => ctx.app.unmount())
  return ctx.getEditor()
}

/** jsdom has no DataTransfer, and the drag signal only reads `types`. */
function startWindowDrag() {
  const event: any = new Event('dragenter', { bubbles: true })
  event.dataTransfer = { types: ['Files'], items: [] }
  window.dispatchEvent(event)
}

afterEach(() => {
  // The window drag signal is module-level and reference-counted: end the drag
  // and unmount, or the next test starts mid-drag.
  window.dispatchEvent(new Event('dragend'))
  while (teardowns.length) teardowns.pop()!()
})

describe('EditorDropZone overlay', () => {
  it('stays hidden for a read-only editor that was never passed `disabled`', async () => {
    const editor = editorFor({ editable: false })
    expect(editor.isEditable).toBe(false)
    const root = mountZone({ editor })

    startWindowDrag()
    await flush()

    expect(root.textContent).not.toContain(LABEL)
  })

  it('appears for an editable editor', async () => {
    const editor = editorFor({ editable: true })
    expect(editor.isEditable).toBe(true)
    const root = mountZone({ editor })

    startWindowDrag()
    await flush()

    expect(root.textContent).toContain(LABEL)
  })

  it('stays hidden when `disabled` is set on an editable editor', async () => {
    const root = mountZone({
      editor: editorFor({ editable: true }),
      disabled: true,
    })

    startWindowDrag()
    await flush()

    expect(root.textContent).not.toContain(LABEL)
  })

  it('stays hidden while the editor is still null', async () => {
    const root = mountZone({ editor: null })

    startWindowDrag()
    await flush()

    expect(root.textContent).not.toContain(LABEL)
  })
})

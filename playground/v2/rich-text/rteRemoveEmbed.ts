// The file's "Remove Embed" modal (RteRemoveEmbedModal) raised for an
// embed's Delete, in place of the library's own dialog: mounted on its own
// under the body, as the library mounts its insert dialog, and torn down
// once it has closed. Delete there takes the embed out, if it is still an
// embed at that position when the word comes.
import { createApp, h, ref, type App } from 'vue'
import type { Editor } from '@tiptap/core'
import RteRemoveEmbedModal from './RteRemoveEmbedModal.vue'

let app: App | null = null
let container: HTMLDivElement | null = null

function teardown() {
  app?.unmount()
  app = null
  container?.remove()
  container = null
}

export function openRemoveEmbedModal(editor: Editor, pos: number): void {
  teardown()
  const open = ref(true)
  container = document.createElement('div')
  document.body.appendChild(container)
  app = createApp({
    render: () =>
      h(RteRemoveEmbedModal, {
        open: open.value,
        'onUpdate:open': (value: boolean) => {
          open.value = value
          if (!value) setTimeout(teardown, 200)
        },
        onConfirm: () => {
          const node = editor.isDestroyed ? null : editor.state.doc.nodeAt(pos)
          if (!node || node.type.name !== 'iframe') return
          editor.view.dispatch(editor.state.tr.delete(pos, pos + node.nodeSize))
        },
      }),
  })
  app.mount(container)
}

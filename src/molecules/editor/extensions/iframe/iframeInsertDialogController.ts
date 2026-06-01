import { createApp, h, ref, type App } from 'vue'
import type { Editor } from '@tiptap/core'
import IframeInsertDialog from './IframeInsertDialog.vue'

/**
 * Imperatively mount the "Insert Embed" dialog (mirrors
 * `imageGroupDialogController`). The `openIframeDialog` command calls this, so
 * the dialog needs no consumer-rendered slot component — it self-tears-down on
 * close.
 */
let app: App | null = null
let container: HTMLDivElement | null = null

function teardown() {
  app?.unmount()
  app = null
  container?.parentNode?.removeChild(container)
  container = null
}

export function openIframeInsertDialog(args: { editor: Editor }): void {
  teardown()

  const open = ref(true)

  container = document.createElement('div')
  document.body.appendChild(container)

  app = createApp({
    render() {
      return h(IframeInsertDialog, {
        modelValue: open.value,
        'onUpdate:modelValue': (value: boolean) => {
          open.value = value
          if (!value) setTimeout(teardown, 0)
        },
        editor: args.editor,
        onClose: () => setTimeout(teardown, 0),
      })
    },
  })

  app.mount(container)
}

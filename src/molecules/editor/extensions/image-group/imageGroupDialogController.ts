import { createApp, h, ref, type App } from 'vue'
import type { Editor } from '@tiptap/core'
import ImageGroupUploadDialog from './ImageGroupUploadDialog.vue'

let app: App | null = null
let container: HTMLDivElement | null = null

function teardown() {
  app?.unmount()
  app = null
  container?.parentNode?.removeChild(container)
  container = null
}

export function openImageGroupUploadDialog(args: {
  editor: Editor
  files: File[]
}): void {
  teardown()

  const open = ref(true)
  const files = ref(args.files)

  container = document.createElement('div')
  document.body.appendChild(container)

  app = createApp({
    render() {
      return h(ImageGroupUploadDialog, {
        modelValue: open.value,
        'onUpdate:modelValue': (value: boolean) => {
          open.value = value
          if (!value) setTimeout(teardown, 0)
        },
        files: files.value,
        'onUpdate:files': (value: File[]) => {
          files.value = value
        },
        editor: args.editor,
        mode: 'new',
        onClose: () => setTimeout(teardown, 0),
      })
    },
  })

  app.mount(container)
}

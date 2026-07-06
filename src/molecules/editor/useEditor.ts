import {
  onBeforeUnmount,
  shallowRef,
  toRaw,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef,
} from 'vue'
import {
  Editor as TiptapEditor,
  type JSONContent,
  Extension,
} from '@tiptap/core'
import type { EditorOptions } from '@tiptap/core'

type Editor = TiptapEditor

export type UseEditorOptions = {
  content?: Ref<string | JSONContent | null | undefined>
  format?: 'html' | 'json' | 'markdown'
  editable?: MaybeRefOrGetter<boolean>
  autofocus?: boolean
  uploadFunction?: (file: File) => Promise<UploadedFile>
  extensions: NonNullable<EditorOptions['extensions']>
  onUpdate?: (editor: Editor) => void
  onFocus?: (editor: Editor, event: FocusEvent) => void
  onBlur?: (editor: Editor, event: FocusEvent) => void
  onTransaction?: (editor: Editor) => void
}

export type UploadedFile = {
  file_url?: string
  file_name?: string
  name?: string
  [key: string]: unknown
}

const UploadStorage = Extension.create({
  name: 'upload',
  addStorage() {
    return { uploadFunction: null }
  },
})

export function useEditor(
  options: UseEditorOptions,
): ShallowRef<Editor | null> {
  const editor = shallowRef<Editor | null>(null)
  const format = options.format ?? 'html'
  const isCollaborationMode = options.extensions.some(
    (extension) => extension.name === 'collaboration',
  )
  let applyingExternalUpdate = false
  // The exact value last written OUT to `options.content` from `onUpdate`. The
  // content watcher skips it so an internal edit doesn't bounce back through
  // `setContent`. HTML can lean on string equality, but JSON's `getJSON()`
  // returns a fresh object each edit, so reference-tracking the emitted value is
  // the only cheap way to recognise our own write (and avoid resetting the
  // selection on every keystroke in `format: 'json'`).
  let lastEmitted: string | JSONContent | null | undefined

  const extensions = [UploadStorage, ...options.extensions]

  if (
    import.meta.env?.DEV &&
    format === 'markdown' &&
    !extensions.some((extension) => extension.name === 'markdown')
  ) {
    console.warn(
      "[frappe-ui] format: 'markdown' needs the Markdown extension in `extensions` — import { Markdown } from 'frappe-ui/editor'.",
    )
  }

  const serialize = (tiptapEditor: Editor) =>
    format === 'json'
      ? tiptapEditor.getJSON()
      : format === 'markdown'
        ? tiptapEditor.getMarkdown()
        : tiptapEditor.getHTML()

  const editorOptions: Partial<EditorOptions> = {
    element: null,
    extensions,
    editable: toValue(options.editable) ?? true,
    autofocus: options.autofocus,
    onUpdate: ({ editor: tiptapEditor }) => {
      if (!isCollaborationMode && options.content && !applyingExternalUpdate) {
        const value = serialize(tiptapEditor)
        lastEmitted = value
        options.content.value = value
      }
      options.onUpdate?.(tiptapEditor)
    },
    onFocus: ({ editor: tiptapEditor, event }) => {
      options.onFocus?.(tiptapEditor, event as FocusEvent)
    },
    onBlur: ({ editor: tiptapEditor, event }) => {
      options.onBlur?.(tiptapEditor, event as FocusEvent)
    },
    onTransaction: ({ editor: tiptapEditor }) => {
      options.onTransaction?.(tiptapEditor)
    },
  }

  if (format === 'markdown') {
    editorOptions.contentType = 'markdown'
  }

  if (!isCollaborationMode && options.content?.value != null) {
    editorOptions.content = options.content.value
  }

  editor.value = new TiptapEditor(editorOptions as EditorOptions)

  const editorStorage = editor.value.storage as typeof editor.value.storage & {
    upload?: { uploadFunction: UseEditorOptions['uploadFunction'] }
  }

  if (options.uploadFunction && editorStorage.upload) {
    editorStorage.upload.uploadFunction = options.uploadFunction
  }

  if (!isCollaborationMode && options.content) {
    watch(options.content, (content) => {
      if (!editor.value) return
      // Our own write bounced back through the ref — ignore it (covers JSON,
      // whose fresh-object identity defeats the HTML string check below).
      if (toRaw(content) === lastEmitted) return
      if (format === 'html' && editor.value.getHTML() === content) return
      if (format === 'markdown' && editor.value.getMarkdown() === content)
        return

      applyingExternalUpdate = true
      try {
        editor.value.commands.setContent(
          content ?? '',
          format === 'markdown'
            ? { emitUpdate: false, contentType: 'markdown' }
            : { emitUpdate: false },
        )
      } finally {
        applyingExternalUpdate = false
      }
    })
  }

  watch(
    () => toValue(options.editable),
    (editable) => {
      if (editor.value && editable !== undefined) {
        editor.value.setEditable(editable)
      }
    },
  )

  onBeforeUnmount(() => {
    editor.value?.destroy()
    editor.value = null
  })

  return editor
}

export type { Editor, JSONContent }

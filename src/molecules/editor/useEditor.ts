import {
  onBeforeUnmount,
  shallowRef,
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
  format?: 'html' | 'json'
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

  const extensions = [UploadStorage, ...options.extensions]

  const editorOptions: Partial<EditorOptions> = {
    extensions,
    editable: toValue(options.editable) ?? true,
    autofocus: options.autofocus,
    onUpdate: ({ editor: tiptapEditor }) => {
      if (!isCollaborationMode && options.content && !applyingExternalUpdate) {
        options.content.value =
          format === 'json' ? tiptapEditor.getJSON() : tiptapEditor.getHTML()
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
      if (format === 'html' && editor.value.getHTML() === content) return

      applyingExternalUpdate = true
      editor.value.commands.setContent(content ?? '', { emitUpdate: false })
      applyingExternalUpdate = false
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

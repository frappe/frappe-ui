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
  // The exact object last written OUT to `options.content` from `onUpdate`,
  // in `format: 'json'` only. The content watcher skips it by identity so an
  // internal edit doesn't bounce back through `setContent` and reset the
  // selection on every keystroke. The string formats compare content instead,
  // so they need nothing here.
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
        if (format === 'json') lastEmitted = value
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

  // We build with `element: null` and let `<EditorContent>` mount later, so an
  // unmounted editor has no view and no ProseMirror plugins at all. Normalize
  // the parsed document here instead, or a headless caller — `getHTML()` before
  // the child mounts, a markdown export that never renders — reads back the
  // split lists it was handed. No-op once the schema has no list node.
  // The metas are ours, not the command's: opening a document is not an edit.
  // Guarded by `can()` because a chain dispatches even when its command
  // returns false, and an empty transaction still reaches `onTransaction`.
  if (editor.value.can().joinAdjacentLists?.()) {
    editor.value
      .chain()
      .joinAdjacentLists()
      .setMeta('preventUpdate', true)
      .setMeta('addToHistory', false)
      .run()
  }

  const editorStorage = editor.value.storage as typeof editor.value.storage & {
    upload?: { uploadFunction: UseEditorOptions['uploadFunction'] }
  }

  if (options.uploadFunction && editorStorage.upload) {
    editorStorage.upload.uploadFunction = options.uploadFunction
  }

  if (!isCollaborationMode && options.content) {
    watch(options.content, (content) => {
      if (!editor.value) return
      // Our own JSON write bounced back through the ref — ignore it.
      // `getJSON()` returns a fresh object each edit, so identity is the only
      // cheap way to recognise it. HTML and markdown are left to the string
      // checks below: they compare against what the editor holds right now, so
      // an external update that restores an earlier value still applies, where
      // matching `lastEmitted` by value would drop it.
      // `lastEmitted` is only ever a `getJSON()` object, so the `undefined`
      // check only rules out its initial value — without it, clearing an
      // untouched editor with `undefined` would match and be skipped.
      if (
        format === 'json' &&
        lastEmitted !== undefined &&
        toRaw(content) === lastEmitted
      )
        return
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
        // Same reason as at construction: while unmounted there are no
        // plugins, so nothing normalizes what `setContent` just parsed.
        // No-op when there is nothing to join.
        if (editor.value.can().joinAdjacentLists?.()) {
          editor.value
            .chain()
            .joinAdjacentLists()
            .setMeta('preventUpdate', true)
            .setMeta('addToHistory', false)
            .run()
        }
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

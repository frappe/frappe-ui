<script setup lang="ts">
import { ref, watch } from 'vue'
import type { JSONContent } from '@tiptap/core'
import type { Extension } from '@tiptap/core'
import {
  useEditor,
  type Editor,
  type UploadedFile,
  type UseEditorOptions,
} from './useEditor'
import { setPlaceholder } from './extensions'
import { provideEditor } from './editor-context'

type Content = string | JSONContent | null

const model = defineModel<Content>()

const props = withDefaults(
  defineProps<{
    // capability — the complete extension list; include a kit
    extensions: Extension[]

    // content / behavior knobs (universal, reactive where noted)
    format?: 'html' | 'json' | 'markdown'
    markdownOptions?: UseEditorOptions['markdownOptions']
    placeholder?: string
    editable?: boolean
    autofocus?: boolean
    uploadFunction?: (file: File) => Promise<UploadedFile>
  }>(),
  {
    format: 'html',
    editable: true,
    autofocus: false,
  },
)

const emit = defineEmits<{
  change: [value: Content]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  transaction: [editor: Editor]
}>()

defineSlots<{
  // The consumer owns the entire layout: render EditorContent and whichever
  // menus / actions it wants, using the provided editor instance.
  default?(props: { editor: Editor | null; isEmpty: boolean }): any
}>()

const isEmpty = ref(true)
function syncIsEmpty(editor: Editor) {
  isEmpty.value = editor.isEmpty
}

const editor = useEditor({
  content: model,
  format: props.format,
  markdownOptions: props.markdownOptions,
  editable: () => props.editable,
  autofocus: props.autofocus,
  uploadFunction: props.uploadFunction,
  extensions: props.extensions,
  onUpdate(editor) {
    syncIsEmpty(editor)
    // Emit the freshly-written value directly from the editor (P1: a side-event,
    // independent of v-model timing).
    emit(
      'change',
      props.format === 'json'
        ? editor.getJSON()
        : props.format === 'markdown'
          ? editor.getMarkdown()
          : editor.getHTML(),
    )
  },
  onFocus(_editor, event) {
    emit('focus', event)
  },
  onBlur(_editor, event) {
    emit('blur', event)
  },
  onTransaction(editor) {
    syncIsEmpty(editor)
    emit('transaction', editor)
  },
})

if (editor.value) syncIsEmpty(editor.value)

// Publish the editor to the slot's building blocks so they don't need an
// explicit `:editor` — see editor-context.
provideEditor(editor)

// Sanctioned template-ref escape hatch (spec §2): reach the live editor instance
// and emptiness from a parent's script without owning its lifecycle. Apps that
// must *create* the editor outside the component drop to L4 (useEditor) instead.
defineExpose({ editor, isEmpty })

// Thread the reactive `placeholder` prop into the Placeholder extension. The
// storage write and decoration refresh live in `setPlaceholder` (next to the
// extension), so this component never touches editor storage or ProseMirror
// transactions. An explicit Placeholder.configure({ placeholder }) wins, and with
// no Placeholder extension present it's a no-op.
watch(
  () => props.placeholder,
  (text) => setPlaceholder(editor.value, text ?? null),
  { immediate: true },
)
</script>

<template>
  <!-- Renderless. <Editor> owns the editor lifecycle, v-model, upload and
       placeholder threading, and exposes { editor, isEmpty } — but renders no UI
       of its own. There is no one-size-fits-all editor chrome, so the consumer
       renders EditorContent and whichever menus / actions it wants inside this
       slot, using the building blocks (EditorContent, EditorFixedMenu, …). -->
  <slot :editor="editor" :is-empty="isEmpty" />
</template>

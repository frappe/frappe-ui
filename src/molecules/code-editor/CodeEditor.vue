<script setup lang="ts">
import type { Extension } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { useCodeEditor } from './useCodeEditor'
import { provideCodeEditor } from './code-editor-context'
import type { CodeEditorExposed } from './types'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    /**
     * Every capability the editor has: languages, keymaps, completion sources,
     * themes. Required, and reactive — a new array is re-applied without
     * recreating the view, so the document, the selection and the undo history
     * survive a language change.
     */
    extensions: Extension[]
    editable?: boolean
    autofocus?: boolean
  }>(),
  {
    editable: true,
    autofocus: false,
  },
)

const emit = defineEmits<{
  /** Blur: the commit point. */
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

defineSlots<{
  // The consumer owns the layout: render CodeEditorContent, and whatever chrome
  // the app draws around it.
  default?(props: { editor: EditorView | null }): any
}>()

const editor = useCodeEditor({
  content: model,
  extensions: () => props.extensions,
  editable: () => props.editable,
  autofocus: props.autofocus,
  onChange(view) {
    // Read straight off the view rather than off `model`: `change` is a
    // side-event and must not depend on v-model timing.
    emit('change', view.state.doc.toString())
  },
  onFocus(_view, event) {
    emit('focus', event)
  },
  onBlur(_view, event) {
    emit('blur', event)
  },
})

// Publish the view to the parts in the slot, so they need no explicit `:editor`.
provideCodeEditor(editor)

// Sanctioned template-ref escape hatch (ADR-0012): a parent's script reaches the
// live view — to focus it, insert at the cursor, or open the search panel — with
// no other surface that gets there. The exposed member is the view itself, so no
// new verbs join the imperative surface.
//
// A getter, and typed: Vue unwraps a handed-back ref at the proxy boundary, so
// `defineExpose({ editor })` would document a ref the caller never sees and
// leave that ref writable from outside. Same shape as `TextInput.vue`.
defineExpose<CodeEditorExposed>({
  get editor() {
    return editor.value
  },
})
</script>

<template>
  <!-- Renderless. <CodeEditor> owns the view lifecycle and the content v-model,
       and draws nothing: there is no label, no box and no toolbar here. The box
       is <CodeEditorContent>, and the label belongs to the app's own field. -->
  <slot :editor="editor" />
</template>

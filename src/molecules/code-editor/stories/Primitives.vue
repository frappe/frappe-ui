<script setup>
import { computed, ref } from 'vue'
import { Button } from 'frappe-ui'
import {
  CodeEditorContent,
  CodeKit,
  useCodeEditor,
} from 'frappe-ui/code-editor'

const content = ref(`SELECT name, status
FROM tabTask
WHERE status = 'Open'`)

// No <CodeEditor> wrapper. This owns the view directly and hands it to the
// content part through :editor.
const editor = useCodeEditor({
  content,
  extensions: [CodeKit.configure({ lineNumbers: {} })],
})

// Every recipe is raw CodeMirror: the composable returns the EditorView and
// nothing else.
function insertLimit() {
  const view = editor.value
  if (!view) return
  view.focus()
  view.dispatch(view.state.replaceSelection('\nLIMIT 20'))
}

const lineCount = computed(() => content.value.split('\n').length)
</script>

<template>
  <div class="w-full max-w-2xl">
    <CodeEditorContent :editor="editor" class="min-h-40" />

    <div class="mt-2 flex h-7 items-center justify-between gap-2">
      <p class="text-p-sm text-ink-gray-5">{{ lineCount }} lines</p>
      <Button label="Insert LIMIT" @click="insertLimit" />
    </div>
  </div>
</template>

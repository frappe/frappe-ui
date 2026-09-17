<script setup>
import { ref } from 'vue'
import { CodeEditor, CodeEditorContent, CodeKit } from 'frappe-ui/code-editor'

// One kit and nothing else. CodeKit carries history, bracket matching, search,
// completion, the frappe chrome and the frappe keymap. It carries no language:
// capability travels in this array, so a language is one more entry in it.
const extensions = [CodeKit]

const code = ref(
  `frappe.ui.form.on('Task', {
  refresh(frm) {
    frm.add_custom_button('Ping', () => frm.save())
  },
})`,
)
</script>

<template>
  <div class="w-full max-w-2xl">
    <!-- <CodeEditor> renders nothing. <CodeEditorContent> is the box, and the
         class falls through to it the normal way. -->
    <CodeEditor v-model="code" :extensions="extensions">
      <CodeEditorContent class="min-h-40" />
    </CodeEditor>
    <p class="mt-2 text-p-sm text-ink-gray-5">
      The kit loads no language, so nothing here is coloured. Add a language
      extension next to it for syntax colours.
    </p>
  </div>
</template>

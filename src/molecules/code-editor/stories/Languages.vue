<script setup>
import { computed, ref, shallowRef, watch } from 'vue'
import { Select } from 'frappe-ui'
import {
  CodeEditor,
  CodeEditorContent,
  CodeKit,
  loadLanguage,
} from 'frappe-ui/code-editor'

const options = [
  { label: 'JSON', value: 'json' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'SQL', value: 'sql' },
  // Not a known key: `loadLanguage` resolves it to null, which is plain text.
  { label: 'Plain text', value: 'plaintext' },
]

const languageKey = ref('json')
const language = shallowRef(null)

// `loadLanguage` imports the matching @codemirror/lang-* package on demand. An
// unknown key resolves to null, which is plain text.
watch(
  languageKey,
  async (key) => {
    const extension = await loadLanguage(key)
    // A quick second pick can resolve first. Drop a stale answer.
    if (key === languageKey.value) language.value = extension
  },
  { immediate: true },
)

// Built once: a kit rebuilt on every recompute would be a new identity, and the
// reconfigure would drop the history it keys by identity.
const kit = CodeKit.configure({ lineNumbers: {} })

// A new array on every language change. The engine re-applies it with one
// top-level reconfigure, so the document, the selection and the undo history
// all survive the swap.
const extensions = computed(() => [kit, language.value].filter(Boolean))

const code = ref(`{
  "name": "Sales Order",
  "is_submittable": 1,
  "fields": ["customer", "transaction_date", "grand_total"]
}`)
</script>

<template>
  <div class="w-full max-w-2xl">
    <div class="mb-2 flex items-center gap-2">
      <span class="text-p-sm text-ink-gray-5">Language</span>
      <Select v-model="languageKey" :options="options" class="w-40" />
    </div>

    <CodeEditor v-model="code" :extensions="extensions">
      <CodeEditorContent class="min-h-40" />
    </CodeEditor>

    <p class="mt-2 text-p-sm text-ink-gray-5">
      Type, then switch the language. The text and the undo history stay.
    </p>
  </div>
</template>

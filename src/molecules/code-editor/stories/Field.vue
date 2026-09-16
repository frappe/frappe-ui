<script setup>
import { computed, ref, shallowRef } from 'vue'
import { Button } from 'frappe-ui'
import {
  CodeEditor,
  CodeEditorContent,
  CodeKit,
  loadLanguage,
} from 'frappe-ui/code-editor'

// frappe-ui ships no labeled field. This is the shape an app writes once and
// reuses at every call site: the label, the expand affordance and the JSON
// pretty-print all belong to the app.
const value = ref(`{
  "doctype": "Task",
  "subject": "Ship the code editor",
  "status": "Open",
  "priority": "High",
  "expected_time": 4,
  "depends_on": [
    "TASK-0001",
    "TASK-0002"
  ],
  "description": "Collapse the field and the content crosses the cap.",
  "_assign": ["jane@example.com"]
}`)

const expanded = ref(false)
const overflowing = ref(false)

// Configured once, outside the computed. A kit built on every recompute would
// be a new extension identity each time, and the reconfigure would drop the
// undo history with it.
const kit = CodeKit.configure({ lineNumbers: {}, placeholder: '{}' })

const language = shallowRef(null)
loadLanguage('json').then((extension) => (language.value = extension))

// The language arrives after mount. `extensions` is reactive, so it lands with
// no remount and no lost history.
const extensions = computed(() => [kit, language.value].filter(Boolean))

// `change` fires on blur, which is the commit point. Running this on every
// keystroke would reformat the document under the user's caret.
function prettyPrint(text) {
  try {
    value.value = JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    // Invalid JSON mid-edit: leave what the user typed alone.
  }
}
</script>

<template>
  <div class="w-full max-w-2xl">
    <label class="mb-1.5 block text-sm text-ink-gray-5">Task payload</label>

    <CodeEditor v-model="value" :extensions="extensions" @change="prettyPrint">
      <CodeEditorContent
        :class="expanded ? 'max-h-96' : 'max-h-40'"
        @overflow="overflowing = $event"
      />
    </CodeEditor>

    <!-- Fixed height: the row keeps its space whether or not the button is
         there, so showing it never shifts the page. -->
    <div class="mt-2 flex h-7 items-center justify-between gap-2">
      <p class="text-p-sm text-ink-gray-5">
        Click outside the editor to commit. Valid JSON is pretty-printed.
      </p>
      <Button
        v-if="overflowing"
        :label="expanded ? 'Collapse' : 'Expand'"
        @click="expanded = !expanded"
      />
    </div>
  </div>
</template>

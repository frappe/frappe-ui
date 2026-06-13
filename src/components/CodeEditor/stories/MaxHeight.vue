<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from 'frappe-ui/code-editor'

const overflowing = ref(false)
const code = ref(
  Array.from({ length: 30 }, (_, i) => `const line${i + 1} = ${i + 1}`).join(
    '\n',
  ),
)
</script>

<template>
  <div class="w-full max-w-xl">
    <!-- The cap is a CSS hook, not a prop: set `--cm-max-height` on the root. -->
    <CodeEditor
      v-model="code"
      language="javascript"
      style="--cm-max-height: 12rem"
      @overflow="(v) => (overflowing = v)"
    />
    <p class="mt-2 text-xs text-ink-gray-6">overflowing = {{ overflowing }}</p>
  </div>
</template>

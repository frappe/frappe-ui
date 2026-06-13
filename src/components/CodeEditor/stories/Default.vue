<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from 'frappe-ui/code-editor'

const code = ref(`function greet(name) {\n\treturn \`Hello, \${name}!\`\n}`)
</script>

<template>
  <div class="w-full max-w-xl">
    <CodeEditor
      v-model="code"
      language="javascript"
      placeholder="Type some code…"
    />
  </div>
</template>

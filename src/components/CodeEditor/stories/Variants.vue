<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from 'frappe-ui/code-editor'

const code = ref(`{\n  "name": "frappe-ui",\n  "private": true\n}`)
</script>

<template>
  <div class="w-full max-w-xl space-y-4">
    <CodeEditor v-model="code" language="json" variant="subtle" />
    <CodeEditor v-model="code" language="json" variant="outline" />
  </div>
</template>

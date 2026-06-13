<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from 'frappe-ui/code-editor'

const code = ref(`const sum = (a, b) => a + b`)
</script>

<template>
  <div class="w-full max-w-xl space-y-4">
    <CodeEditor v-model="code" language="javascript" size="sm" />
    <CodeEditor v-model="code" language="javascript" size="md" />
    <CodeEditor v-model="code" language="javascript" size="lg" />
    <CodeEditor v-model="code" language="javascript" size="xl" />
  </div>
</template>

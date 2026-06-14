<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from 'frappe-ui/code-editor'

const code = ref(`{\n  "host": "127.0.0.1",\n  "port": "oops"\n}`)
</script>

<template>
  <div class="w-full max-w-xl space-y-6">
    <CodeEditor
      v-model="code"
      language="json"
      label="Configuration"
      description="Paste the service config as JSON."
      required
    />
    <CodeEditor
      v-model="code"
      language="json"
      label="Configuration"
      error="`port` must be a number."
      required
    />
  </div>
</template>

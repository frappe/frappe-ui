<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import { CodeEditor, CodePreview } from 'frappe-ui/code-editor'

const mode = ref<'write' | 'preview'>('write')
const markdown = ref(
  `# Notes\n\nSome **bold** text and a [link](https://frappe.io).`,
)
</script>

<template>
  <div class="w-full max-w-xl">
    <div class="mb-2 flex gap-1">
      <Button
        :variant="mode === 'write' ? 'subtle' : 'ghost'"
        size="sm"
        label="Write"
        @click="mode = 'write'"
      />
      <Button
        :variant="mode === 'preview' ? 'subtle' : 'ghost'"
        size="sm"
        label="Preview"
        @click="mode = 'preview'"
      />
    </div>
    <CodeEditor v-show="mode === 'write'" v-model="markdown" language="markdown" />
    <CodePreview
      v-if="mode === 'preview'"
      :model-value="markdown"
      language="markdown"
      class="min-h-[4.5rem] rounded-md border border-surface-gray-2 p-3 mt-3"
    />
  </div>
</template>

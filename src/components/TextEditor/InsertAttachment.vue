<template>
  <slot v-bind="{ onClick: openFileSelector }"></slot>
  <input
    ref="fileInput"
    type="file"
    class="hidden"
    @change="onFileSelect"
    multiple
  />
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')

function openFileSelector() {
  fileInput.value?.click()
}

function onFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
      Array.from(files).forEach(file => {
          props.editor.chain().focus().uploadAttachment(file).run()
      })
  }
}
</script>

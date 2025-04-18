<template>
  <slot v-bind="{ onClick: openFileSelector }"></slot>
  <input
    ref="fileInput"
    type="file"
    class="hidden"
    @change="onImageSelect"
    accept="image/*"
  />
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = defineProps<{
  editor: any
}>()

const fileInput = useTemplateRef('fileInput')

function openFileSelector() {
  fileInput.value?.click()
}

function onImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    props.editor.chain().focus().uploadImage(file).run()
  }
}
</script>

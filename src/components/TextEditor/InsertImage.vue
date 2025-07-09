<template>
  <slot v-bind="{ onClick: openFileSelector }"></slot>
  <input
    ref="fileInput"
    type="file"
    class="hidden"
    @change="onImageSelect"
    accept="image/*"
    multiple
  />
  <ImageGroupUploadDialog
    v-if="showModal"
    mode="new"
    v-model="showModal"
    v-model:files="selectedFiles"
    :editor="editor"
    @close="handleCancel"
  />
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import ImageGroupUploadDialog from './extensions/image-group/ImageGroupUploadDialog.vue'

const props = defineProps<{
  editor: Editor
}>()

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const showModal = ref(false)
const selectedFiles = ref<File[]>([])

function openFileSelector() {
  fileInput.value?.click()
}

function onImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    if (files.length === 1) {
      props.editor.chain().focus().uploadImage(files[0]).run()
    } else {
      selectedFiles.value = Array.from(files)
      showModal.value = true
    }
  }
}

function handleCancel() {
  showModal.value = false
  selectedFiles.value = []
}
</script>

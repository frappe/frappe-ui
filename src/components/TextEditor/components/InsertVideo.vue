<template>
  <slot v-bind="{ onClick: selectAndUploadVideo }"></slot>
</template>
<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

function selectAndUploadVideo() {
  props.editor.chain().focus().selectAndUploadVideo().run()
}
</script>

<template>
  <slot v-bind="{ onClick: openLinkEditor }"></slot>
</template>
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
function openLinkEditor() {
  props.editor.commands.openLinkEditor()
}
</script>

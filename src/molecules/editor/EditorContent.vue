<script setup lang="ts">
import { EditorContent as TiptapEditorContent } from '@tiptap/vue-3'
import { computed } from 'vue'
import type { Editor } from './useEditor'

const props = defineProps<{
  editor: Editor | null
}>()

const tiptapEditor = computed(() => props.editor ?? undefined)
</script>

<template>
  <div data-slot="editor-content" class="prose max-w-none text-base">
    <TiptapEditorContent :editor="tiptapEditor as any" />
  </div>
</template>

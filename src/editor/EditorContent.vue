<script setup lang="ts">
import { EditorContent as TiptapEditorContent } from '@tiptap/vue-3'
import type { Editor } from './useEditor'

defineProps<{
  editor: Editor | null
}>()
</script>

<template>
  <div data-slot="editor-content" class="prose max-w-none text-base">
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

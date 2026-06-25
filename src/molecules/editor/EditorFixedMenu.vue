<script setup lang="ts">
import MenuItems from './MenuItems.vue'
import type { MenuItem } from './menu'
import type { Editor } from './useEditor'
import { useResolvedEditor } from './editor-context'

const props = defineProps<{
  // Optional inside <Editor> — falls back to the provided editor context.
  editor?: Editor | null
  items: MenuItem[]
  buttonSize?: 'xs' | 'sm'
}>()

const editor = useResolvedEditor(() => props.editor)
</script>

<template>
  <div data-slot="fixed-menu" class="flex items-center gap-1">
    <MenuItems :editor="editor" :items="items" :button-size="buttonSize" />
  </div>
</template>

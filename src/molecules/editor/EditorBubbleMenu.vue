<script setup lang="ts">
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import MenuItems from './MenuItems.vue'
import type { MenuItem } from './menu'
import type { Editor } from './useEditor'

defineProps<{
  editor: Editor | null
  items: MenuItem[]
  options?: {
    shouldShow?: (props: any) => boolean
    tippyOptions?: Record<string, unknown>
  }
}>()
</script>

<template>
  <BubbleMenu v-if="editor" :editor="editor" :options="options">
    <div
      data-slot="bubble-menu"
      class="flex items-center gap-1 rounded border bg-white p-1 shadow-sm"
    >
      <MenuItems :editor="editor" :items="items" />
    </div>
  </BubbleMenu>
</template>

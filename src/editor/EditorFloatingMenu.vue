<script setup lang="ts">
import { FloatingMenu } from '@tiptap/extension-floating-menu'
import MenuItems from './MenuItems.vue'
import type { MenuItem } from './menu'
import type { Editor } from './useEditor'

defineProps<{
  editor: Editor | null
  buttons: MenuItem[]
  options?: {
    shouldShow?: (props: any) => boolean
    tippyOptions?: Record<string, unknown>
  }
}>()
</script>

<template>
  <FloatingMenu v-if="editor" :editor="editor" :options="options">
    <div data-slot="floating-menu" class="flex items-center gap-1 rounded border bg-white p-1 shadow-sm">
      <MenuItems :editor="editor" :buttons="buttons" />
    </div>
  </FloatingMenu>
</template>

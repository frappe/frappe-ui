<script setup lang="ts">
import MenuItems from './MenuItems.vue'
import type { MenuItem } from './menu'
import type { Editor } from './useEditor'

defineProps<{
  editor: Editor | null
  buttons: MenuItem[]
}>()
</script>

<template>
  <div data-slot="fixed-menu" class="flex items-center gap-1">
    <MenuItems :editor="editor" :buttons="buttons" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import MenuItems from './MenuItems.vue'
import type { MenuItem } from './menu'
import type { Editor } from './useEditor'
import { useResolvedEditor } from './editor-context'

type FloatingOptions = NonNullable<InstanceType<typeof BubbleMenu>['$props']['options']>

const props = defineProps<{
  // Optional inside <Editor> — falls back to the provided editor context.
  editor?: Editor | null
  items: MenuItem[]
  options?: FloatingOptions & {
    shouldShow?: (props: any) => boolean
  }
}>()

const editor = useResolvedEditor(() => props.editor)
const shouldShow = computed(() => props.options?.shouldShow)
const floatingOptions = computed(() => {
  const options = { ...(props.options ?? {}) } as FloatingOptions & {
    shouldShow?: unknown
  }
  delete options.shouldShow
  return options
})
</script>

<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :options="floatingOptions"
  >
    <div
      data-slot="bubble-menu"
      class="flex items-center gap-1 rounded border border-outline-gray-2 bg-surface-white p-1 shadow-sm"
    >
      <MenuItems :editor="editor" :items="items" />
    </div>
  </BubbleMenu>
</template>

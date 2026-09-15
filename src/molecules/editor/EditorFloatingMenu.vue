<script setup lang="ts">
import { computed } from 'vue'
import { FloatingMenu } from '@tiptap/vue-3/menus'
import MenuItems from './MenuItems.vue'
import { editorMenuPlacement } from './menu-placement'
import type { EditorMenuOptions, MenuItem } from './menu'
import type { Editor } from './useEditor'
import { useResolvedEditor } from './editor-context'

type TiptapFloatingOptions = NonNullable<
  InstanceType<typeof FloatingMenu>['$props']['options']
>

const props = defineProps<{
  // Optional inside <Editor> — falls back to the provided editor context.
  editor?: Editor | null
  items: MenuItem[]
  // Positioning, plus `shouldShow`. One owned narrow type for both menus.
  options?: EditorMenuOptions
}>()

const editor = useResolvedEditor(() => props.editor)
const shouldShow = computed(() => props.options?.shouldShow)
// `shouldShow` is a separate prop on TipTap's component, so it never goes
// into the positioning bag. `side` and `align` become Floating UI's single
// `placement` string; TipTap's own default for this menu is `right`.
const floatingOptions = computed<TiptapFloatingOptions>(() => {
  const {
    shouldShow: _shouldShow,
    side: _side,
    align: _align,
    ...positioning
  } = props.options ?? {}
  const placement = editorMenuPlacement(props.options, 'right')
  return placement ? { ...positioning, placement } : positioning
})
</script>

<template>
  <FloatingMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :options="floatingOptions"
  >
    <div
      data-slot="floating-menu"
      class="flex items-center gap-1 rounded-4 border border-outline-gray-2 bg-surface-elevation-2 p-1 shadow-sm"
    >
      <MenuItems :editor="editor" :items="items" />
    </div>
  </FloatingMenu>
</template>

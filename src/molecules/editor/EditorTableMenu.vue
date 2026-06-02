<script setup lang="ts">
import EditorBubbleMenu from './EditorBubbleMenu.vue'
import { tableToolbar } from './menu'
import type { Editor } from './useEditor'
import { useResolvedEditor } from './editor-context'

/**
 * Contextual table toolbar: a bubble menu that appears only while the selection
 * is inside a table, with row/column insert + delete, header-row toggle,
 * merge/split, and delete-table controls (see `tableToolbar`).
 *
 * It carries its own `pluginKey` so it coexists with a text-formatting bubble
 * menu, and it's safe to render unconditionally — `shouldShow` keeps it hidden
 * outside tables, and the items self-prune when the Table extension is absent,
 * so the same component is inert in a comment editor.
 */
const props = defineProps<{
  // Optional inside <Editor> — falls back to the provided editor context.
  editor?: Editor | null
}>()

const editor = useResolvedEditor(() => props.editor)

const options = {
  pluginKey: 'tableBubbleMenu',
  placement: 'top' as const,
  shouldShow: ({ editor }: { editor: Editor }) =>
    editor.isEditable && editor.isActive('table'),
}
</script>

<template>
  <EditorBubbleMenu
    v-if="editor"
    :editor="editor"
    :items="tableToolbar"
    :options="options"
  />
</template>

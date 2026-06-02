<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { Editor } from '../useEditor'
import { useScopedFileDrop } from '../composables/useScopedFileDrop'

/**
 * Generous, editor-scoped file drop target.
 *
 * Wraps the editor surface (toolbar + content) so a file dropped anywhere over
 * it uploads and inserts, with a clear overlay while dragging. Drops that land
 * directly on the prose are handled by the media ProseMirror plugin (precise
 * insert at the cursor) and stop there; this zone only catches drops on the
 * surrounding chrome (toolbar, padding) and inserts at the document end.
 *
 * Scoped on purpose — see `useScopedFileDrop`. A page often has several editors
 * (a discussion body plus per-comment composers), so a window-wide target would
 * be ambiguous about which editor receives the file.
 */
const props = withDefaults(
  defineProps<{
    editor: Editor | null
    /** Disable dropping (e.g. read-only editors). */
    disabled?: boolean
    /** Overlay label. */
    label?: string
  }>(),
  { disabled: false, label: 'Drop files to upload' },
)

const root = useTemplateRef<HTMLElement>('root')

const { isFileDragging } = useScopedFileDrop(root, (files) => {
  const editor = props.editor
  if (props.disabled || !editor || editor.isDestroyed || !editor.isEditable) {
    return
  }
  const images = files.filter((f) => /image/i.test(f.type))
  const videos = files.filter((f) => /video/i.test(f.type))
  if (images.length) editor.commands.uploadImageFiles(images)
  if (videos.length) editor.commands.uploadVideoFiles(videos)
})

const showOverlay = computed(() => isFileDragging.value && !props.disabled)
</script>

<template>
  <div ref="root" class="relative">
    <slot />

    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showOverlay"
        class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] border-2 border-dashed border-outline-gray-3 bg-surface-white/80"
      >
        <span class="text-base font-medium text-ink-gray-7">{{ label }}</span>
      </div>
    </Transition>
  </div>
</template>

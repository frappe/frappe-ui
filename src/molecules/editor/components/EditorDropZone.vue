<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { Editor } from '../useEditor'
import { useEditorFileDrop } from '../composables/useEditorFileDrop'

/**
 * Generous, editor-scoped file drop target.
 *
 * Wraps the editor surface (toolbar + content) so a file dropped anywhere over
 * it uploads and inserts. The overlay is a two-stage affordance: it appears as a
 * hint the moment a file enters the window (so the drop target is discoverable),
 * then emphasises itself when the file is actually over this editor. Drops that
 * land directly on the prose are handled by the media ProseMirror plugin (precise
 * insert at the cursor) and stop there; this zone only catches drops on the
 * surrounding chrome (toolbar, padding) and inserts at the document end.
 *
 * Scoped on purpose — see `useEditorFileDrop`. A page often has several editors
 * (a discussion body plus per-comment composers), so a window-wide drop *target*
 * would be ambiguous about which editor receives the file. (The window-wide
 * *hint* is fine: every editable editor lights up, the user picks one.)
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

const { isWindowDragging, isOverZone } = useEditorFileDrop(root, (files) => {
  const editor = props.editor
  if (props.disabled || !editor || editor.isDestroyed || !editor.isEditable) {
    return
  }
  // The single drop pipeline decides single-image vs group dialog vs video.
  editor.commands.dropFiles(files)
})

const showOverlay = computed(() => isWindowDragging.value && !props.disabled)
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
        class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] border-2 border-dashed transition-colors duration-150"
        :class="
          isOverZone
            ? 'border-outline-gray-4 bg-surface-gray-2/80'
            : 'border-outline-gray-3 bg-surface-white/70'
        "
      >
        <span
          class="text-base font-medium transition-colors duration-150"
          :class="isOverZone ? 'text-ink-gray-8' : 'text-ink-gray-5'"
        >
          {{ label }}
        </span>
      </div>
    </Transition>
  </div>
</template>

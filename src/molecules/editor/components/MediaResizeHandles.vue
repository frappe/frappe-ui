<script setup lang="ts">
/**
 * Edge resize handles for media / embed node views.
 *
 * Renders a vertical pill handle centered on the left and right edges of the
 * media box (the Notion convention). Each handle reports which edge started
 * the drag so `useNodeViewResize` can invert the delta for left-edge drags.
 * Keyboard resize (arrow keys) is forwarded unchanged from either handle.
 */
import type { ResizeEdge } from '#molecules/editor/composables/useNodeViewResize'

defineProps<{
  /** Accessible label prefix, e.g. "Resize media" / "Resize embed". */
  label: string
}>()

const emit = defineEmits<{
  (e: 'resize-start', event: PointerEvent, edge: ResizeEdge): void
  (e: 'resize-keydown', event: KeyboardEvent): void
}>()

const edges: readonly ResizeEdge[] = ['left', 'right']
</script>

<template>
  <button
    v-for="edge in edges"
    :key="edge"
    type="button"
    class="absolute top-1/2 z-30 flex h-8 max-h-[50%] w-4 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center bg-transparent"
    :class="edge === 'left' ? 'left-0' : 'right-0'"
    :aria-label="`${label} from ${edge} edge`"
    @pointerdown.prevent="emit('resize-start', $event, edge)"
    @keydown="emit('resize-keydown', $event)"
  >
    <span class="pointer-events-none h-full w-1 rounded-full bg-black/65 ring-1 ring-white/50" />
  </button>
</template>

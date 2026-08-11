<script setup lang="ts">
/**
 * Resize handle(s) for media / embed node views, in two placements.
 *
 * - `corner` (default) — one grip in the bottom-right corner carrying the
 *   diagonal resize glyph, the affordance every OS window and image editor
 *   already trains people for. Used by images and embeds.
 * - `edges` — the pair of vertical pills on the left and right edges. Videos
 *   keep these: their playback bar owns the bottom of the frame, so a corner
 *   grip either sits on the controls or hovers awkwardly above them.
 *
 * Both report which edge started the drag so `useNodeViewResize` can pick the
 * matching drag math (a corner reads both axes; an edge reads X and inverts
 * for the left one).
 */
import type { ResizeEdge } from '#molecules/editor/composables/useNodeViewResize'

withDefaults(
  defineProps<{
    /** Accessible label, e.g. "Resize media" / "Resize embed". */
    label: string
    placement?: 'corner' | 'edges'
  }>(),
  { placement: 'corner' },
)

const emit = defineEmits<{
  (e: 'resize-start', event: PointerEvent, edge: ResizeEdge): void
  (e: 'resize-keydown', event: KeyboardEvent): void
}>()

const edges = ['left', 'right'] as const
</script>

<template>
  <template v-if="placement === 'edges'">
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
      <span
        class="pointer-events-none h-full w-1 rounded-full bg-black/65 ring-1 ring-white/50"
      />
    </button>
  </template>

  <!-- The button is a 32px hit target; the grip it paints sits in the very
       corner, so the chrome stays light while the target stays comfortable. -->
  <button
    v-else
    type="button"
    class="absolute right-0 bottom-0 z-30 flex size-8 cursor-nwse-resize touch-none items-end justify-end bg-transparent p-1"
    :aria-label="label"
    @pointerdown.prevent="emit('resize-start', $event, 'corner')"
    @keydown="emit('resize-keydown', $event)"
  >
    <span
      class="pointer-events-none flex size-[18px] items-center justify-center rounded-[5px] bg-black/65 text-white ring-1 ring-white/50"
    >
      <span class="lucide-move-diagonal-2 size-3" aria-hidden="true" />
    </span>
  </button>
</template>

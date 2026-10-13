<script setup lang="ts">
/**
 * Resize handle(s) for media / embed node views, in two placements.
 *
 * - `edges` — the pair of vertical pills on the left and right edges, as the
 *   design draws them on a picture (espresso-2.0, node 32243-108985): 3 × 66
 *   on full corners, 4px in from the edge and centred on it, a solid dark
 *   gray in a 1px white halo so it reads on any picture in either theme.
 *   Images and videos: a video's playback bar owns the bottom of the frame,
 *   and a picture's corner is where the actions menu's mirror would sit.
 * - `corner` (default) — one grip in the bottom-right corner carrying the
 *   diagonal resize glyph. Embeds keep it.
 *
 * Both report which edge started the drag so `useNodeViewResize` can pick the
 * matching drag math (a corner reads both axes; an edge reads X and inverts
 * for the left one).
 */
import type { ResizeEdge } from '#molecules/editor/composables/useNodeViewResize'
import { MEDIA_CHROME_BUTTON } from './media-node-view-utils'

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
    <!-- The button is the hand's target, 14px deep from the edge; the pill
         inside it stands 4px in. A short picture gets a shorter pill. -->
    <button
      v-for="edge in edges"
      :key="edge"
      type="button"
      class="absolute top-1/2 z-30 flex h-[66px] max-h-[50%] w-3.5 -translate-y-1/2 cursor-ew-resize touch-none items-center bg-transparent"
      :class="
        edge === 'left'
          ? 'left-0 justify-start pl-1'
          : 'right-0 justify-end pr-1'
      "
      :aria-label="`${label} from ${edge} edge`"
      @pointerdown.prevent="emit('resize-start', $event, edge)"
      @keydown="emit('resize-keydown', $event)"
    >
      <span
        class="pointer-events-none h-full w-[3px] rounded-full bg-[#383838] ring-1 ring-white"
      />
    </button>
  </template>

  <!-- Same button as the actions menu in the opposite corner, mirrored across
       the media: one control style, one inset, whichever corner you reach for. -->
  <button
    v-else
    type="button"
    :class="[
      MEDIA_CHROME_BUTTON,
      'absolute right-2.5 bottom-2.5 z-30 cursor-nwse-resize touch-none',
    ]"
    :aria-label="label"
    @pointerdown.prevent="emit('resize-start', $event, 'corner')"
    @keydown="emit('resize-keydown', $event)"
  >
    <span class="lucide-move-diagonal-2 size-4" aria-hidden="true" />
  </button>
</template>

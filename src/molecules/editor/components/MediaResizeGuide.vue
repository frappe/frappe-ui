<script setup lang="ts">
/**
 * Live feedback for a media resize drag. A pill names the width — the snap it
 * holds ("50%", "Original size") or the free width in px. While a snap holds, a
 * line runs through the dragged edge from the top of the editor to the bottom,
 * so it shows what the media lines up with.
 */
import { computed } from 'vue'
import { usePortalTarget } from '#composables/usePortalTarget'
import type { ResizeGuide } from '#molecules/editor/composables/useNodeViewResize'

const props = defineProps<{
  /**
   * A getter, so only this overlay re-renders on every pointer move. If the
   * node view read the guide itself, each re-render would rewrite its
   * container's bound width over the drag's inline width.
   */
  guide: () => ResizeGuide | null
}>()

const current = computed(() => props.guide())
const portalTarget = usePortalTarget()
</script>

<template>
  <template v-if="current">
    <Teleport v-if="current.snap" :to="portalTarget ?? 'body'">
      <div
        class="pointer-events-none fixed z-50 w-px -translate-x-1/2 bg-surface-gray-7"
        :style="{
          left: `${current.snap.line.x}px`,
          top: `${current.snap.line.top}px`,
          height: `${current.snap.line.height}px`,
        }"
      />
    </Teleport>
    <div
      class="pointer-events-none absolute bottom-2.5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-4 bg-black-overlay-600 px-1.5 py-0.5 text-xs tabular-nums text-white"
    >
      {{ current.snap?.label ?? `${Math.round(current.width)}px` }}
    </div>
  </template>
</template>

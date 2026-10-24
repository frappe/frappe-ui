<script setup lang="ts">
/**
 * Live feedback for a media resize drag. A pill names the width — the snap it
 * holds ("50%", "Original size") or the free width in px. While a snap holds, a
 * line runs through the dragged edge from the top of the editor to the bottom,
 * so it shows what the media lines up with.
 */
import { computed, ref, useTemplateRef, watch } from 'vue'
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

// The pill's gap to each side of the media, the same 10px (`bottom-2.5`) it
// keeps from the bottom edge, so it never sits flush against the clipped edge.
const LABEL_INSET = 10

const current = computed(() => props.guide())
const label = computed(() => {
  const guide = current.value
  if (!guide) return null
  return guide.snap?.label ?? `${Math.round(guide.width)}px`
})

// Measured after each render that changes the text: the media clips its
// overflow, so a pill wider than a small image would read "riginal siz".
// Hidden with `invisible` rather than `v-if` so it keeps a width to measure.
const labelEl = useTemplateRef<HTMLElement>('labelEl')
const labelWidth = ref(0)
watch(
  [labelEl, label],
  () => {
    if (labelEl.value) labelWidth.value = labelEl.value.offsetWidth
  },
  { flush: 'post' },
)
const labelFits = computed(
  () =>
    !!current.value &&
    labelWidth.value <= current.value.width - LABEL_INSET * 2,
)

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
      ref="labelEl"
      class="pointer-events-none absolute bottom-2.5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-4 bg-black-overlay-600 px-1.5 py-0.5 text-xs tabular-nums text-white"
      :class="{ invisible: !labelFits }"
    >
      {{ label }}
    </div>
  </template>
</template>

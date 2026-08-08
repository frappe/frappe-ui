<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    :scroll-hide-delay="scrollHideDelay"
    class="relative overflow-hidden"
  >
    <ScrollAreaViewport
      ref="viewport"
      data-slot="scroll-area-viewport"
      :class="['h-full w-full', viewportClass]"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar v-if="orientation !== 'horizontal'" orientation="vertical" />
    <ScrollBar
      v-if="orientation === 'horizontal' || orientation === 'both'"
      orientation="horizontal"
    />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui'
import ScrollBar from './ScrollBar.vue'
import type { ScrollAreaExposed, ScrollAreaProps } from './types'

withDefaults(defineProps<ScrollAreaProps>(), {
  orientation: 'vertical',
  scrollHideDelay: 600,
})

defineSlots<{
  /** The scrolling content. */
  default?: () => any
}>()

const viewport = ref<InstanceType<typeof ScrollAreaViewport>>()

// Expose the actual scrolling element so consumers can drive virtualization
// (e.g. @vueuse useVirtualList) against the real scroll container rather than
// adding a second nested scroller. A getter (not a computed) so the published
// type is a plain, read-only `HTMLElement | null` (see imperative-api.md §2.3).
defineExpose<ScrollAreaExposed>({
  get viewportElement() {
    return viewport.value?.viewportElement ?? null
  },
})
</script>

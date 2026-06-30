<template>
  <ScrollAreaRoot
    :scroll-hide-delay="scrollHideDelay"
    class="relative overflow-hidden"
  >
    <ScrollAreaViewport :class="['h-full w-full', viewportClass]">
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
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui'
import ScrollBar from './ScrollBar.vue'

withDefaults(
  defineProps<{
    /** Which scrollbars to render. */
    orientation?: 'vertical' | 'horizontal' | 'both'
    /** Idle delay (ms) before the thumb fades out. */
    scrollHideDelay?: number
    /** Extra classes for the scrolling viewport (e.g. padding). */
    viewportClass?: string
  }>(),
  { orientation: 'vertical', scrollHideDelay: 600 },
)
</script>

<template>
  <ScrollAreaRoot
    :scroll-hide-delay="scrollHideDelay"
    class="relative overflow-hidden"
  >
    <ScrollAreaViewport
      ref="viewport"
      :class="[
        'h-full w-full',
        contentFullHeight && '[&>div]:h-full',
        viewportClass,
      ]"
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
import { computed, ref } from 'vue'
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
    /**
     * Stretch the scroll content to fill the viewport height. reka lays the
     * viewport content out as an auto-height `display: table` box, so a
     * percentage-height child (e.g. full-height columns in a horizontal board)
     * collapses to content height. Set this to make such children resolve
     * against the viewport instead — without reaching into the internal DOM.
     */
    contentFullHeight?: boolean
  }>(),
  { orientation: 'vertical', scrollHideDelay: 600 },
)

const viewport = ref<InstanceType<typeof ScrollAreaViewport>>()

// Expose the actual scrolling element so consumers can drive virtualization
// (e.g. @vueuse useVirtualList) against the real scroll container rather than
// adding a second nested scroller.
defineExpose({
  viewportElement: computed(() => viewport.value?.viewportElement ?? null),
})
</script>

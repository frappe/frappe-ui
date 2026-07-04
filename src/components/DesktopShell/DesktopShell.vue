<template>
  <div data-slot="desktop-shell" class="flex h-full">
    <slot name="rail" />
    <slot name="sidebar" />

    <div
      data-slot="desktop-shell-content"
      class="flex min-w-0 flex-1 flex-col overflow-hidden"
    >
      <!-- Pages teleport their headers here; it stays pinned above the scroll. -->
      <PageHeaderTarget />

      <!--
        The scroll region. Registered into the shared scroll-container registry
        (via ScrollArea's exposed viewport element) so `useScrollContainer()` /
        `getScrollContainer()` resolve it with zero app wiring.
      -->
      <ScrollArea v-if="scroll" ref="scrollArea" class="min-h-0 flex-1">
        <slot />
      </ScrollArea>

      <!--
        scroll=false: the content area fills the remaining height and never
        page-scrolls, so inner panes own their own overflow — a list + detail
        split, or a horizontally-scrolling board whose columns scroll on their
        own. Without this apps fake it with `absolute inset-0` / hardcoded
        `h-[calc(100vh-3rem)]` / `[&>div]:h-full`.
      -->
      <div v-else class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import ScrollArea from '../ScrollArea/ScrollArea.vue'
import PageHeaderTarget from '../PageHeader/PageHeaderTarget.vue'
import {
  registerScrollContainer,
  unregisterScrollContainer,
} from '../../composables/useScrollContainer'

withDefaults(
  defineProps<{
    /**
     * Whether the content area scrolls as one page (default). Set `false` for
     * multi-pane layouts where inner panes own their own scroll — the content
     * area then fills the remaining height and never page-scrolls.
     */
    scroll?: boolean
  }>(),
  { scroll: true },
)

const scrollArea = ref<InstanceType<typeof ScrollArea> | null>(null)

// Register the real scrolling viewport once ScrollArea exposes it, and follow it
// if it ever remounts. Unregister on teardown so a layout swap hands over to the
// other shell cleanly.
let registered: HTMLElement | null = null
watch(
  () => scrollArea.value?.viewportElement ?? null,
  (el) => {
    if (registered && registered !== el) {
      unregisterScrollContainer(registered)
      registered = null
    }
    if (el && el !== registered) {
      registerScrollContainer(el)
      registered = el
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (registered) unregisterScrollContainer(registered)
})
</script>

<template>
  <div data-slot="desktop-shell" class="flex h-full">
    <slot name="rail" />
    <slot name="sidebar" />

    <!--
      The content card. Structural classes are fixed; `cardClass` themes the
      look (radius/background/shadow/borders) and the float spacing via margin —
      flexbox sizes this `flex-1` child accounting for its margins, so no
      separate gutter wrapper is needed.
    -->
    <div
      data-slot="desktop-shell-content"
      class="flex min-w-0 flex-1 flex-col overflow-hidden"
      :class="cardClass"
    >
      <!-- Pages teleport their headers here; it stays pinned above the scroll. -->
      <PageHeaderTarget />

      <!--
        The scroll region. Registered into the shared scroll-container registry
        (via ScrollArea's exposed viewport element) so `useScrollContainer()` /
        `getScrollContainer()` resolve it with zero app wiring.
      -->
      <ScrollArea ref="scrollArea" class="min-h-0 flex-1">
        <slot />
      </ScrollArea>
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
import type { DesktopShellProps } from './types'

withDefaults(defineProps<DesktopShellProps>(), {
  cardClass: 'm-1 rounded-lg bg-surface-base shadow-sm',
})

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

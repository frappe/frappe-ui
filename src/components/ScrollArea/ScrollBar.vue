<template>
  <ScrollAreaScrollbar
    class="pointer-events-none z-20 flex touch-none select-none bg-transparent p-0.5 transition-colors duration-150 ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
    :orientation="orientation"
  >
    <ScrollAreaThumb
      class="relative flex-1 rounded-lg bg-gray-400 transition-opacity duration-150 ease-out before:absolute before:left-1/2 before:top-1/2 before:h-full before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] dark:bg-gray-700"
      :class="[
        isThumbVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
        // Grow the 44px touch target only along the scroll axis; a cross-axis
        // minimum would bleed the (invisible) hit area over adjacent content.
        orientation === 'horizontal' ? 'before:min-w-[44px]' : 'before:min-h-[44px]',
      ]"
    />
  </ScrollAreaScrollbar>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  injectScrollAreaRootContext,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from 'reka-ui'

withDefaults(
  defineProps<{
    orientation?: 'vertical' | 'horizontal'
  }>(),
  { orientation: 'vertical' },
)

// Overlay scrollbar that fades in on pointer/scroll activity and hides after an
// idle delay — keeps content flush to the edges (no reserved gutter) while still
// giving a draggable thumb.
//
// Because the bar overlays content (no gutter), the track is `pointer-events-none`
// and only the *visible* thumb is `pointer-events-auto`. Otherwise the transparent
// track — or an invisible (opacity-0) thumb parked over the top-right corner —
// would swallow clicks on the content beneath it.
const rootContext = injectScrollAreaRootContext()
const isThumbVisible = ref(false)
const isPointerDown = ref(false)

let idleTimeout: ReturnType<typeof window.setTimeout> | undefined

function clearIdleTimeout() {
  if (!idleTimeout) return
  window.clearTimeout(idleTimeout)
  idleTimeout = undefined
}

function scheduleHide() {
  clearIdleTimeout()
  idleTimeout = window.setTimeout(() => {
    isThumbVisible.value = false
    idleTimeout = undefined
  }, rootContext.scrollHideDelay.value)
}

function showThumb() {
  isThumbVisible.value = true
  if (!isPointerDown.value) scheduleHide()
}

function hideThumb() {
  if (isPointerDown.value) return
  clearIdleTimeout()
  isThumbVisible.value = false
}

function handlePointerDown() {
  isPointerDown.value = true
  clearIdleTimeout()
  isThumbVisible.value = true
}

function handlePointerUp() {
  if (!isPointerDown.value) return
  isPointerDown.value = false
  scheduleHide()
}

useEventListener(rootContext.scrollArea, 'pointerenter', showThumb)
useEventListener(rootContext.scrollArea, 'pointermove', showThumb)
useEventListener(rootContext.scrollArea, 'pointerdown', handlePointerDown)
useEventListener(rootContext.scrollArea, 'pointerleave', hideThumb)
useEventListener(rootContext.viewport, 'scroll', showThumb)
useEventListener(window, 'pointerup', handlePointerUp)

onUnmounted(clearIdleTimeout)
</script>

<template>
  <ScrollAreaScrollbar
    class="z-20 flex touch-none select-none bg-transparent p-0.5 transition-colors duration-150 ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
    :orientation="orientation"
  >
    <ScrollAreaThumb
      class="relative flex-1 rounded-lg bg-gray-400 transition-opacity duration-150 ease-out before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] dark:bg-gray-700"
      :class="isThumbVisible ? 'opacity-100' : 'opacity-0'"
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

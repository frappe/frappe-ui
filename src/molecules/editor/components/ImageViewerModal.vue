<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-in-out"
      leave-active-class="transition-opacity duration-150 ease-in-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="props.show && currentImage"
        class="fixed top-0 left-0 w-full h-full bg-black sm:bg-black/90 z-[50] flex flex-col justify-center items-center overflow-hidden touch-none"
        ref="imageContainer"
        @mousemove="handleActivity"
        @touchstart="handleActivity"
        @touchmove="handleActivity"
      >
        <!-- Dedicated Backdrop -->
        <div class="absolute inset-0 z-0" ref="backdropElement" @click="close"></div>

        <!-- Image Container -->
        <div class="relative z-10 flex flex-col items-center">
          <img
            :src="currentImage.src"
            :alt="currentImage.alt || 'Image preview'"
            class="max-w-screen max-h-screen object-contain block"
            :style="{
              transform: `scale(${zoomLevel / 100}) translate(${panPosition.x}px, ${panPosition.y}px)`,
              cursor:
                zoomLevel > 100 ? (isMousePanning ? 'grabbing' : 'grab') : 'default',
              transition:
                isPanning || isPinching || isAnimatingPan
                  ? 'none'
                  : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }"
            @mousedown="handlePanStart"
            draggable="false"
          />
        </div>

        <!-- Caption -->
        <div
          v-if="currentImage.alt"
          class="absolute bottom-4 p-2 text-center rounded-sm text-white text-sm bg-black/65 z-10 transition-opacity duration-300 ease-in-out"
          :class="{ 'opacity-0 pointer-events-none': !isControlsVisible }"
        >
          {{ currentImage.alt }}
        </div>

        <!-- Controls bar -->
        <ImageViewerControlsBar
          ref="controlsBar"
          :visible="isControlsVisible"
          :current-index="currentIndex"
          :total="props.images.length"
          :zoom-level="zoomLevel"
          :is-fullscreen="isFullscreen"
          @previous="previousImage"
          @next="nextImage"
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
          @reset-zoom="resetZoom"
          @download="downloadCurrent"
          @toggle-fullscreen="onToggleFullscreen"
          @close="close"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { useTouchHandler } from '@composables/useTouchHandler'
import { useImageNavigation } from '@composables/useImageNavigation'
import { useZoomPan } from '@composables/useZoomPan'
import { useControlsAutoHide } from '@molecules/editor/composables/useControlsAutoHide'
import { useFullscreen } from '@molecules/editor/composables/useFullscreen'
import { useElementSize } from '@molecules/editor/composables/useElementSize'
import ImageViewerControlsBar from './image-viewer/ImageViewerControlsBar.vue'
import { downloadImage } from './image-viewer/imageViewerDownload'
import { createImageViewerKeydown } from './image-viewer/imageViewerKeymap'
import type { ViewableImage } from '../extensions/image-viewer/collectImages'

const props = defineProps<{
  show: boolean
  images: ViewableImage[]
  initialIndex: number
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const imageContainer = ref<HTMLElement | null>(null)
const backdropElement = ref<HTMLElement | null>(null)
const controlsBar = ref<{ $el: HTMLElement } | null>(null)
const controlsBarEl = computed(() => controlsBar.value?.$el ?? null)
const touchStartZoom = ref(100)

const { isControlsVisible, handleActivity, showAndReset } = useControlsAutoHide({
  isPaused: () => isPanning.value || isPinching.value,
})
const { isFullscreen, toggleFullscreen } = useFullscreen()
// Measured for layout parity with the original ResizeObserver; single observer,
// disconnected on unmount inside the composable.
useElementSize(controlsBarEl)

const {
  zoomLevel,
  panPosition,
  isMousePanning,
  initialPanPositionOnGestureStart,
  zoomIn,
  zoomOut,
  resetZoom,
  handlePanStart,
  snapThresholdLower,
  snapThresholdUpper,
} = useZoomPan({
  containerRef: imageContainer,
  isEnabled: toRef(props, 'show'),
})

const { currentIndex, nextImage, previousImage } = useImageNavigation({
  initialIndex: toRef(props, 'initialIndex'),
  imageCount: computed(() => props.images.length),
  onNavigate: resetZoom,
})

const currentImage = computed(() => props.images[currentIndex.value])

const {
  isPanning: isTouchPanning,
  isPinching,
  isAnimatingPan,
} = useTouchHandler({
  targetRef: imageContainer,
  zoomLevel: zoomLevel,
  panThreshold: 10,
  onSwipeLeft: () => {
    if (zoomLevel.value <= 100) nextImage()
  },
  onSwipeRight: () => {
    if (zoomLevel.value <= 100) previousImage()
  },
  onDoubleTap: (event) => {
    if (controlsBarEl.value?.contains(event.target as Node)) return
    if (zoomLevel.value > 100) {
      resetZoom()
    } else {
      zoomLevel.value = 200
      panPosition.value = { x: 0, y: 0 }
    }
  },
  onTap: (event) => {
    if (event.target === backdropElement.value) close()
  },
  onPanStart: () => {
    if (zoomLevel.value <= 100) return
    initialPanPositionOnGestureStart.value = { ...panPosition.value }
  },
  onPanMove: (deltaX, deltaY) => {
    if (zoomLevel.value <= 100) return
    panPosition.value = {
      x: initialPanPositionOnGestureStart.value.x + deltaX,
      y: initialPanPositionOnGestureStart.value.y + deltaY,
    }
  },
  onPanAnimate: (deltaX, deltaY) => {
    panPosition.value = {
      x: panPosition.value.x + deltaX,
      y: panPosition.value.y + deltaY,
    }
  },
  onPinchStart: () => {
    touchStartZoom.value = zoomLevel.value
    initialPanPositionOnGestureStart.value = { ...panPosition.value }
  },
  onPinchMove: (scale) => {
    const newZoom = touchStartZoom.value * scale
    let finalZoom = Math.max(25, Math.min(300, Math.round(newZoom)))
    if (finalZoom > snapThresholdLower && finalZoom < snapThresholdUpper) {
      finalZoom = 100
    }
    zoomLevel.value = finalZoom
  },
  onPinchEnd: () => {
    if (zoomLevel.value < 100) resetZoom()
    initialPanPositionOnGestureStart.value = { x: 0, y: 0 }
  },
})

const isPanning = computed(() => isMousePanning.value || isTouchPanning.value)

function close() {
  emit('update:show', false)
  resetZoom()
}

function downloadCurrent() {
  downloadImage(currentImage.value)
}

function onToggleFullscreen() {
  if (imageContainer.value) toggleFullscreen(imageContainer.value)
}

const handleKeyDown = createImageViewerKeydown({
  isOpen: () => props.show,
  isPanning: () => isPanning.value,
  onActivity: handleActivity,
  next: nextImage,
  previous: previousImage,
  zoomIn,
  zoomOut,
  toggleFullscreen: onToggleFullscreen,
  close,
})

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      resetZoom()
      showAndReset()
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

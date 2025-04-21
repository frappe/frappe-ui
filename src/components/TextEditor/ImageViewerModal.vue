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
        v-if="props.show"
        class="fixed top-0 left-0 w-full h-full bg-black sm:bg-black/90 z-[50] flex flex-col justify-center items-center overflow-hidden touch-none"
        ref="imageContainer"
        @mousemove="handleActivity"
        @touchstart="handleActivity"
        @touchmove="handleActivity"
      >
        <!-- Dedicated Backdrop -->
        <div
          class="absolute inset-0 z-0"
          ref="backdropElement"
          @click="close"
        ></div>

        <!-- Image Container -->
        <div class="relative z-10 flex flex-col items-center">
          <img
            :src="currentImage.src"
            :alt="currentImage.alt || 'Image preview'"
            class="max-w-screen max-h-screen object-contain block"
            :style="{
              transform: `scale(${zoomLevel / 100}) translate(${panPosition.x}px, ${panPosition.y}px)`,
              cursor:
                zoomLevel > 100
                  ? isMousePanning
                    ? 'grabbing'
                    : 'grab'
                  : 'default',
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
        <div
          ref="controlsBar"
          class="absolute top-4 flex items-center space-x-3 p-2 text-white z-20 transition-opacity duration-300 ease-in-out"
          :class="{ 'opacity-0 pointer-events-none': !isControlsVisible }"
          @touchstart.stop
          @touchmove.stop
          @touchend.stop
          @mousedown.stop
          @wheel.stop
        >
          <!-- Navigation controls -->
          <div class="bg-black/65 rounded flex items-center">
            <Tooltip text="Previous image">
              <button
                class="p-2 hover:bg-gray-900 rounded-l focus:outline-none"
                @click.stop="previousImage"
              >
                <LucideChevronLeft class="size-4" />
              </button>
            </Tooltip>

            <span class="px-2 text-sm tabular-nums text-gray-400 select-none">
              {{ currentIndex + 1 }}/{{ props.images.length }}
            </span>

            <Tooltip text="Next image">
              <button
                class="p-2 hover:bg-gray-900 rounded-r focus:outline-none"
                @click.stop="nextImage"
              >
                <LucideChevronRight class="size-4" />
              </button>
            </Tooltip>
          </div>

          <!-- Zoom controls -->
          <div class="bg-black/65 rounded flex items-center">
            <Tooltip text="Zoom out">
              <button
                class="p-2 hover:bg-gray-900 rounded-l focus:outline-none"
                @click.stop="zoomOut"
              >
                <LucideMinus class="size-4" />
              </button>
            </Tooltip>

            <Tooltip text="Reset zoom">
              <button
                class="p-2 hover:bg-gray-900 text-sm text-gray-400 focus:outline-none"
                @click.stop="resetZoom"
              >
                {{ zoomLevel }}%
              </button>
            </Tooltip>

            <Tooltip text="Zoom in">
              <button
                class="p-2 hover:bg-gray-900 rounded-r focus:outline-none"
                @click.stop="zoomIn"
              >
                <LucidePlus class="size-4" />
              </button>
            </Tooltip>
          </div>

          <!-- Action controls -->
          <div class="bg-black/65 rounded flex items-center">
            <Tooltip text="Download image">
              <button
                class="p-2 hover:bg-gray-900 rounded-l focus:outline-none"
                @click.stop="downloadImage"
              >
                <LucideDownload class="size-4" />
              </button>
            </Tooltip>

            <Tooltip
              :text="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
            >
              <button
                class="p-2 hover:bg-gray-900 rounded-r focus:outline-none hidden sm:block"
                @click.stop="toggleFullscreen"
              >
                <LucideMaximize v-if="!isFullscreen" class="size-4" />
                <LucideMinimize v-else class="size-4" />
              </button>
            </Tooltip>
          </div>

          <!-- Close button -->
          <div class="bg-black/65 rounded flex items-center">
            <Tooltip text="Close">
              <button
                class="p-2 hover:bg-gray-900 rounded focus:outline-none"
                @click.stop="close"
              >
                <LucideX class="size-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  useTemplateRef,
  computed,
  toRef,
  watch,
} from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { useTouchHandler } from '../../composables/useTouchHandler'
import { useImageNavigation } from '../../composables/useImageNavigation'
import { useZoomPan } from '../../composables/useZoomPan'

import LucideDownload from '~icons/lucide/download'
import LucideMaximize from '~icons/lucide/maximize'
import LucideMinimize from '~icons/lucide/minimize'
import LucideChevronLeft from '~icons/lucide/chevron-left'
import LucideChevronRight from '~icons/lucide/chevron-right'
import LucidePlus from '~icons/lucide/plus'
import LucideMinus from '~icons/lucide/minus'
import LucideX from '~icons/lucide/x'

interface ImageInfo {
  src: string
  alt: string | null
}

const props = defineProps<{
  show: boolean
  images: ImageInfo[]
  initialIndex: number
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const imageContainer = useTemplateRef('imageContainer')
const backdropElement = useTemplateRef('backdropElement')
const controlsBar = useTemplateRef('controlsBar')
const controlsBarHeight = ref(0)

const isFullscreen = ref(false)
const touchStartZoom = ref(100)

const isControlsVisible = ref(true)
const inactivityTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const INACTIVITY_TIMEOUT = 3000 // 3 seconds

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
    if (controlsBar.value?.contains(event.target as Node)) return

    if (zoomLevel.value > 100) {
      resetZoom()
    } else {
      zoomLevel.value = 200
      panPosition.value = { x: 0, y: 0 }
    }
  },
  onTap: (event) => {
    if (event.target === backdropElement.value) {
      close()
    }
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
    if (zoomLevel.value < 100) {
      resetZoom()
    }
    initialPanPositionOnGestureStart.value = { x: 0, y: 0 }
  },
})

const isPanning = computed(() => isMousePanning.value || isTouchPanning.value)

function showControlsAndResetTimer() {
  isControlsVisible.value = true
  if (inactivityTimer.value) {
    clearTimeout(inactivityTimer.value)
  }
  inactivityTimer.value = setTimeout(() => {
    if (!isPanning.value && !isPinching.value) {
      isControlsVisible.value = false
    } else {
      showControlsAndResetTimer()
    }
  }, INACTIVITY_TIMEOUT)
}

function handleActivity() {
  if (!isPinching.value || !isControlsVisible.value) {
    showControlsAndResetTimer()
  }
}

function close() {
  emit('update:show', false)
  resetZoom()
  if (inactivityTimer.value) {
    clearTimeout(inactivityTimer.value)
    inactivityTimer.value = null
  }
}

function downloadImage() {
  const imageToDownload = currentImage.value

  const link = document.createElement('a')
  link.href = imageToDownload.src

  const filename =
    imageToDownload.alt?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ||
    imageToDownload.src.split('/').pop() ||
    'download'
  link.download = filename.includes('.') ? filename : `${filename}.jpg`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function toggleFullscreen() {
  const container = imageContainer.value

  if (!isFullscreen.value) {
    if (container?.requestFullscreen) {
      container.requestFullscreen()
      isFullscreen.value = true
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

function handleFullscreenChange() {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

function handleKeyDown(event: KeyboardEvent) {
  if (!props.show) return

  handleActivity()

  switch (event.key) {
    case 'ArrowLeft':
      if (!isPanning.value) previousImage()
      event.preventDefault()
      break
    case 'ArrowRight':
      if (!isPanning.value) nextImage()
      event.preventDefault()
      break
    case '+':
    case '=':
      zoomIn()
      event.preventDefault()
      break
    case '-':
      zoomOut()
      event.preventDefault()
      break
    case 'Escape':
      close()
      event.preventDefault()
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      event.preventDefault()
      break
  }
}

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      isControlsVisible.value = true
      resetZoom()
      showControlsAndResetTimer()
    } else {
      if (inactivityTimer.value) {
        clearTimeout(inactivityTimer.value)
        inactivityTimer.value = null
      }
      if (isFullscreen.value && document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  },
)

watch(controlsBar, (newVal) => {
  if (newVal) {
    const updateHeight = () => {
      controlsBarHeight.value = newVal.offsetHeight
    }
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(newVal)
    updateHeight()
    onUnmounted(() => resizeObserver.disconnect())
  } else {
    controlsBarHeight.value = 0
  }
})

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleKeyDown)

  if (inactivityTimer.value) {
    clearTimeout(inactivityTimer.value)
  }

  if (isFullscreen.value && document.exitFullscreen) {
    document.exitFullscreen()
  }
})
</script>

<template>
  <div
    class="absolute top-4 flex items-center space-x-3 p-2 text-white z-20 transition-opacity duration-300 ease-in-out"
    :class="{ 'opacity-0 pointer-events-none': !visible }"
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
          @click.stop="emit('previous')"
        >
          <span class="lucide-chevron-left size-4" />
        </button>
      </Tooltip>

      <span class="px-2 text-sm tabular-nums text-gray-400 select-none">
        {{ currentIndex + 1 }}/{{ total }}
      </span>

      <Tooltip text="Next image">
        <button
          class="p-2 hover:bg-gray-900 rounded-r focus:outline-none"
          @click.stop="emit('next')"
        >
          <span class="lucide-chevron-right size-4" />
        </button>
      </Tooltip>
    </div>

    <!-- Zoom controls -->
    <div class="bg-black/65 rounded flex items-center">
      <Tooltip text="Zoom out">
        <button
          class="p-2 hover:bg-gray-900 rounded-l focus:outline-none"
          @click.stop="emit('zoom-out')"
        >
          <span class="lucide-minus size-4" />
        </button>
      </Tooltip>

      <Tooltip text="Reset zoom">
        <button
          class="p-2 hover:bg-gray-900 text-sm text-gray-400 focus:outline-none"
          @click.stop="emit('reset-zoom')"
        >
          {{ zoomLevel }}%
        </button>
      </Tooltip>

      <Tooltip text="Zoom in">
        <button
          class="p-2 hover:bg-gray-900 rounded-r focus:outline-none"
          @click.stop="emit('zoom-in')"
        >
          <span class="lucide-plus size-4" />
        </button>
      </Tooltip>
    </div>

    <!-- Action controls -->
    <div class="bg-black/65 rounded flex items-center">
      <Tooltip text="Download image">
        <button
          class="p-2 hover:bg-gray-900 rounded-l focus:outline-none"
          @click.stop="emit('download')"
        >
          <span class="lucide-download size-4" />
        </button>
      </Tooltip>

      <Tooltip :text="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'">
        <button
          class="p-2 hover:bg-gray-900 rounded-r focus:outline-none hidden sm:block"
          @click.stop="emit('toggle-fullscreen')"
        >
          <span v-if="!isFullscreen" class="lucide-maximize size-4" />
          <span v-else class="lucide-minimize size-4" />
        </button>
      </Tooltip>
    </div>

    <!-- Close button -->
    <div class="bg-black/65 rounded flex items-center">
      <Tooltip text="Close">
        <button
          class="p-2 hover:bg-gray-900 rounded focus:outline-none"
          @click.stop="emit('close')"
        >
          <span class="lucide-x size-4" />
        </button>
      </Tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tooltip from '@components/Tooltip/Tooltip.vue'

defineProps<{
  visible: boolean
  currentIndex: number
  total: number
  zoomLevel: number
  isFullscreen: boolean
}>()

const emit = defineEmits<{
  previous: []
  next: []
  'zoom-in': []
  'zoom-out': []
  'reset-zoom': []
  download: []
  'toggle-fullscreen': []
  close: []
}>()
</script>

<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

import type { SliderProps } from './types'

const model = defineModel({ default: [] })

withDefaults(defineProps<SliderProps>(), {
  step: 1,
  max: 100,
  min: 0,
})
</script>

<template>
  <SliderRoot v-model="model" class="relative flex touch-none select-none items-center" :max="100">
    <SliderTrack class="relative h-1 grow rounded bg-surface-gray-3">
      <SliderRange class="absolute h-full rounded bg-surface-gray-7" />
    </SliderTrack>

    <SliderThumb
      v-for="(_, i) in model"
      :key="'slider-thumb-' + i"
      class="size-4 rounded-full bg-surface-white shadow-md ring-gray-600/20 transition-shadow duration-200 ease-out hover:ring-[6px] focus:outline-none dark:bg-surface-gray-7 dark:ring-gray-100/20"
      aria-label="Volume"
    />
  </SliderRoot>
</template>

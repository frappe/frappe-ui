<script setup lang="ts">
import { computed } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import type { SliderProps, SliderValue } from './types'

const props = withDefaults(defineProps<SliderProps>(), {
  step: 1,
  max: 100,
  min: 0,
})

const model = defineModel<SliderValue>()

const sliderValue = computed<SliderValue>({
  get() {
    return model.value?.length ? model.value : [props.min]
  },
  set(value) {
    model.value = value
  },
})
</script>

<template>
  <SliderRoot
    v-model="sliderValue"
    class="relative flex select-none touch-none items-center"
    :max="props.max"
    :min="props.min"
    :step="props.step"
  >
    <SliderTrack class="relative h-1 grow rounded bg-surface-gray-3">
      <SliderRange class="absolute h-full rounded bg-surface-gray-7" />
    </SliderTrack>

    <SliderThumb
      v-for="(_, i) in sliderValue"
      :key="`slider-thumb-${i}`"
      class="size-4 rounded-full bg-surface-white shadow-md ring-gray-600/20 transition-shadow duration-200 ease-out hover:ring-[6px] focus:outline-none dark:bg-surface-gray-7 dark:ring-gray-100/20"
      aria-label="Volume"
    />
  </SliderRoot>
</template>

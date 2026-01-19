<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "reka-ui";
import type { SliderProps } from "./types";

const model = defineModel({ default: [] });

withDefaults(defineProps<SliderProps>(), {
  step: 1,
  max: 100,
  min: 0,
});
</script>

<template>
  <SliderRoot
    v-model="model"
    class="relative flex items-center select-none touch-none"
    :max="100"
  >
    <SliderTrack class="bg-surface-gray-3 relative grow rounded h-1">
      <SliderRange class="absolute bg-surface-gray-7 rounded h-full" />
    </SliderTrack>

    <SliderThumb
      v-for="_,i in model"
      :key='"slider-thumb-" + i'
      class="
        size-4 rounded-full
        bg-surface-white dark:bg-surface-gray-7
        shadow-md
        transition-shadow duration-200 ease-out
        hover:ring-[6px] ring-gray-600/20 dark:ring-gray-100/20
        focus:outline-none
      "
      aria-label="Volume"
    />
  </SliderRoot>
</template>

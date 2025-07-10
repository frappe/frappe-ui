<template>
  <div class="w-full space-y-[10px]">
    <div
      v-if="props.label || props.hint"
      class="flex items-baseline justify-between"
    >
      <span v-if="props.label" class="text-base font-medium text-ink-gray-8">
        {{ props.label }}
      </span>
      <!-- Empty for alignment -->
      <span v-else></span>

      <span class="self-end" v-if="props.hint || $slots.hint">
        <slot name="hint">
          <span class="text-base font-medium text-ink-gray-4">
            {{ props.value }}%
          </span>
        </slot>
      </span>
    </div>

    <div
      class="overflow-hidden rounded-xl"
      :class="indicatorContainerClasses"
      :aria-valuemax="MAX_VALUE"
      :aria-valuemin="MIN_VALUE"
      :aria-valuenow="props.value"
      role="progressbar"
    >
      <!-- Continuous Progress Bar -->
      <div
        v-if="!props.intervals"
        class="h-full bg-surface-gray-7"
        :style="`width: ${props.value}%`"
      ></div>

      <!-- Interval Progress Bar -->
      <div
        v-else
        v-for="index in intervalCount"
        class="h-full w-full"
        :class="
          index <= filledIntervalCount
            ? 'bg-surface-gray-7'
            : 'bg-surface-gray-2'
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ProgressProps } from './types'

const MIN_VALUE = 0
const MAX_VALUE = 100

const props = withDefaults(defineProps<ProgressProps>(), {
  size: 'sm',
  hint: false,
  label: '',
  intervals: false,
  intervalCount: 6,
})

const indicatorContainerClasses = computed(() => {
  const heightClass = {
    sm: 'h-[2px]',
    md: 'h-1',
    lg: 'h-2',
    xl: 'h-3',
  }[props.size]

  const layoutClasses = props.intervals
    ? 'flex space-x-1'
    : 'relative bg-surface-gray-2'

  return [heightClass, layoutClasses]
})

const filledIntervalCount = computed(() => {
  if (props.value > MAX_VALUE) {
    return props.intervalCount
  }

  return Math.round((props.value / MAX_VALUE) * props.intervalCount)
})
</script>

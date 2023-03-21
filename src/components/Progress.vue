<template>
  <div class="min-w-50 space-y-[10px]">
    <div
      v-if="props.label || props.hint"
      class="flex items-baseline justify-between"
    >
      <span v-if="props.label" class="text-base font-medium text-gray-800">{{
        props.label
      }}</span>
      <!-- Empty for alignment -->
      <span v-else></span>

      <span
        class="self-end text-base font-medium text-gray-500"
        v-if="props.hint"
        >{{ props.value }}%</span
      >
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
        class="h-full bg-gray-900"
        :style="`width: ${props.value}%`"
      ></div>

      <!-- Interval Progress Bar -->
      <div
        v-else
        v-for="index in intervalCount"
        class="h-full w-full"
        :class="index <= filledIntervalCount ? 'bg-gray-900' : 'bg-gray-100'"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'

const MIN_VALUE = 0
const MAX_VALUE = 100

interface ProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  hint?: boolean
  intervals?: boolean
  intervalCount?: number
}

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
    : 'relative bg-gray-100'

  return [heightClass, layoutClasses]
})

const filledIntervalCount = computed(() => {
  if (props.value > MAX_VALUE) {
    return props.intervalCount
  }

  return Math.round((props.value / MAX_VALUE) * props.intervalCount)
})
</script>

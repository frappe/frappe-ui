<template>
  <div class="w-full space-y-[10px]">
    <div
      v-if="props.label || props.hint"
      class="flex items-baseline justify-between"
    >
      <span v-if="props.label" class="text-base-medium text-ink-gray-8">
        {{ props.label }}
      </span>
      <!-- Empty for alignment -->
      <span v-else></span>

      <span class="self-end" v-if="props.hint || $slots.hint">
        <slot name="hint">
          <span class="text-base-medium text-ink-gray-4">
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
      <!-- Scaled rather than resized: `transform` is composited, where animating
           `width` reflows the bar on every frame. The fill carries no radius of
           its own — the container clips it — so scaling distorts nothing. -->
      <div
        v-if="!props.intervals"
        class="h-full w-full origin-left bg-surface-gray-10 transition-transform duration-300 ease-linear motion-reduce:transition-none"
        :style="`transform: scaleX(${fillScale})`"
      ></div>

      <!-- Interval Progress Bar -->
      <div
        v-else
        v-for="index in intervalCount"
        class="h-full w-full"
        :class="
          index <= filledIntervalCount
            ? 'bg-surface-gray-10'
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

/**
 * Fraction the continuous fill is scaled to. Clamped because a scale above 1
 * would be silently clipped by the container and a negative one would flip the
 * fill across its origin, where the old `width: N%` simply resolved to nothing.
 */
const fillScale = computed(() => {
  const clamped = Math.min(Math.max(props.value, MIN_VALUE), MAX_VALUE)
  return clamped / MAX_VALUE
})

const filledIntervalCount = computed(() => {
  if (props.value > MAX_VALUE) {
    return props.intervalCount
  }

  return Math.round((props.value / MAX_VALUE) * props.intervalCount)
})

defineSlots<{
  /** Custom content for the hint area (usually displays the progress value).
   * If not provided, defaults to showing `props.value` followed by `%`.
   */
  hint?: () => any
}>()
</script>

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

    <!-- `transform-gpu` puts the track on its own layer. Without it Safari fails
         to clip the animating fill to the rounded corners.
         https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 -->
    <ProgressRoot
      :model-value="clampedValue"
      :max="MAX_VALUE"
      :get-value-label="() => valueLabel"
      class="transform-gpu overflow-hidden rounded-7"
      :class="indicatorContainerClasses"
    >
      <!-- Continuous Progress Bar -->
      <!-- The fill is full width and slid left so only `value`% of it shows.
           `transform` is composited, where animating `width` reflows the bar on
           every frame. -->
      <ProgressIndicator
        v-if="!props.intervals"
        class="h-full w-full bg-surface-gray-10 transition-transform duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        :style="`transform: translateX(${fillOffset}%)`"
      />

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
    </ProgressRoot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
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

  const layoutClasses = props.intervals ? 'flex space-x-1' : 'bg-surface-gray-2'

  return [heightClass, layoutClasses]
})

/**
 * Clamped so the fill can only ever be pulled fully off or fully into view. It
 * also keeps `ProgressRoot` quiet — it treats an out-of-range value as invalid,
 * logs an error and falls back to indeterminate.
 */
const clampedValue = computed(() =>
  Math.min(Math.max(Number(props.value), MIN_VALUE), MAX_VALUE),
)

/** Percentage the full-width fill is slid left by: 0 when full, -100 when empty. */
const fillOffset = computed(() => clampedValue.value - MAX_VALUE)

/**
 * A bare percentage (reka-ui's default) says how far along the bar is but not
 * what it measures, so prefer the visible label when there is one.
 */
const valueLabel = computed(
  () => props.label || `${Math.round(clampedValue.value)}%`,
)

const filledIntervalCount = computed(() =>
  Math.round((clampedValue.value / MAX_VALUE) * props.intervalCount),
)

defineSlots<{
  /** Custom content for the hint area (usually displays the progress value).
   * If not provided, defaults to showing `props.value` followed by `%`.
   */
  hint?: () => any
}>()
</script>

<template>
  <div
    class="inline-flex select-none items-center gap-1 overflow-clip rounded-full whitespace-nowrap"
    :class="classes"
  >
    <div
      v-if="$slots.prefix"
      class="inline-flex shrink-0 items-center justify-center"
      :class="iconSize"
    >
      <slot name="prefix"></slot>
    </div>
    <slot>{{ props.label?.toString() }}</slot>
    <div
      v-if="$slots.suffix"
      class="inline-flex shrink-0 items-center justify-center"
      :class="iconSize"
    >
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { BadgeProps } from './types'

const props = withDefaults(defineProps<BadgeProps>(), {
  theme: 'gray',
  size: 'md',
  variant: 'subtle',
})

// `orange` is kept as a deprecated alias for `amber`
const theme = computed(() => (props.theme === 'orange' ? 'amber' : props.theme))

const classes = computed(() => {
  // The semantic scale (Figma export → tailwind/generated/colors.json) is
  // consistent across all themes — gray is the only exception (`-7` is its
  // saturated step, since gray needs more headroom). Tailwind's JIT needs
  // literal class names so the per-theme strings are inlined below.
  //   surface/{color}-2  pale bg          surface/{color}-5  saturated bg
  //   outline/{color}-2  pale border
  //   ink/{color}-1      pale text        ink/{color}-4      saturated text
  const themeClasses = {
    gray: {
      solid: 'text-ink-white bg-surface-gray-7',
      subtle: 'text-ink-gray-6 bg-surface-gray-2',
      outline: 'text-ink-gray-6 border border-outline-gray-2',
      ghost: 'text-ink-gray-6',
    },
    blue: {
      solid: 'text-ink-blue-1 bg-surface-blue-5',
      subtle: 'text-ink-blue-4 bg-surface-blue-2',
      outline: 'text-ink-blue-4 border border-outline-blue-2',
      ghost: 'text-ink-blue-4',
    },
    green: {
      solid: 'text-ink-green-1 bg-surface-green-5',
      subtle: 'text-ink-green-4 bg-surface-green-2',
      outline: 'text-ink-green-4 border border-outline-green-2',
      ghost: 'text-ink-green-4',
    },
    amber: {
      solid: 'text-ink-amber-1 bg-surface-amber-5',
      subtle: 'text-ink-amber-4 bg-surface-amber-2',
      outline: 'text-ink-amber-4 border border-outline-amber-2',
      ghost: 'text-ink-amber-4',
    },
    red: {
      solid: 'text-ink-red-1 bg-surface-red-5',
      subtle: 'text-ink-red-4 bg-surface-red-2',
      outline: 'text-ink-red-4 border border-outline-red-2',
      ghost: 'text-ink-red-4',
    },
    violet: {
      solid: 'text-ink-violet-1 bg-surface-violet-5',
      subtle: 'text-ink-violet-4 bg-surface-violet-2',
      outline: 'text-ink-violet-4 border border-outline-violet-2',
      ghost: 'text-ink-violet-4',
    },
  }[theme.value]

  const variantClasses = themeClasses[props.variant]

  const sizeClasses = {
    sm: 'h-4 px-1.5 text-xs',
    md: 'h-5 px-1.5 text-xs',
    lg: 'h-6 px-2 text-[13px] tracking-[0.02em]',
  }[props.size]

  return [variantClasses, sizeClasses]
})

const iconSize = computed(() => (props.size === 'lg' ? 'size-3' : 'size-2.5'))

defineSlots<{
  /** Content shown before the badge label */
  prefix?: () => any

  /** Main badge content (overrides `label` prop) */
  default?: () => any

  /** Content shown after the badge label */
  suffix?: () => any
}>()
</script>

<template>
  <div
    class="inline-flex select-none items-center gap-1 rounded-full"
    :class="classes"
  >
    <div
      :class="[props.size == 'lg' ? 'max-h-6' : 'max-h-4']"
      v-if="$slots.prefix"
    >
      <slot name="prefix"></slot>
    </div>
    <slot>{{ props.label?.toString() }}</slot>
    <div
      :class="[props.size == 'lg' ? 'max-h-6' : 'max-h-4']"
      v-if="$slots.suffix"
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

const classes = computed(() => {
  let solidClasses = {
    gray: 'text-ink-white bg-surface-gray-7',
    blue: 'text-ink-blue-1 bg-surface-blue-2',
    green: 'text-ink-green-1 bg-surface-green-3',
    orange: 'text-ink-amber-1 bg-surface-amber-2',
    red: 'text-ink-red-1 bg-surface-red-4',
  }[props.theme]

  let subtleClasses = {
    gray: 'text-ink-gray-6 bg-surface-gray-2',
    blue: 'text-ink-blue-2 bg-surface-blue-1',
    green: 'text-ink-green-3 bg-surface-green-2',
    orange: 'text-ink-amber-3 bg-surface-amber-1',
    red: 'text-ink-red-4 bg-surface-red-1',
  }[props.theme]

  let outlineClasses = {
    gray: 'text-ink-gray-6 bg-transparent border border-outline-gray-1',
    blue: 'text-ink-blue-2 bg-transparent border border-outline-blue-1',
    green: 'text-ink-green-3 bg-transparent border border-outline-green-2',
    orange: 'text-ink-amber-3 bg-transparent border border-outline-amber-2',
    red: 'text-ink-red-4 bg-transparent border border-outline-red-2',
  }[props.theme]

  let ghostClasses = {
    gray: 'text-ink-gray-6 bg-transparent',
    blue: 'text-ink-blue-2 bg-transparent',
    green: 'text-ink-green-3 bg-transparent',
    orange: 'text-ink-amber-3 bg-transparent',
    red: 'text-ink-red-4 bg-transparent',
  }[props.theme]

  let variantClasses = {
    subtle: subtleClasses,
    solid: solidClasses,
    outline: outlineClasses,
    ghost: ghostClasses,
  }[props.variant]

  let sizeClasses = {
    sm: 'h-4 text-xs px-1.5',
    md: 'h-5 text-xs px-1.5',
    lg: 'h-6 text-sm px-2',
  }[props.size]

  return [variantClasses, sizeClasses]
})
</script>

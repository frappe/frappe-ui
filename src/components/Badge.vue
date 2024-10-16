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

interface Label {
  toString(): string
}

interface BadgeProps {
  theme?: 'gray' | 'blue' | 'green' | 'orange' | 'red'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'
  label?: Label | string | number
}

const props = withDefaults(defineProps<BadgeProps>(), {
  theme: 'gray',
  size: 'md',
  variant: 'subtle',
})

const classes = computed(() => {
  let solidClasses = {
    gray: 'text-text-icons-white bg-surface-gray-7',
    blue: 'text-text-icons-blue-1 bg-surface-blue-2',
    green: 'text-text-icons-green-1 bg-surface-green-3',
    orange: 'text-text-icons-amber-1 bg-surface-amber-2',
    red: 'text-text-icons-red-1 bg-surface-red-4',
  }[props.theme]

  let subtleClasses = {
    gray: 'text-text-icons-gray-6 bg-surface-gray-2',
    blue: 'text-text-icons-blue-2 bg-surface-blue-1',
    green: 'text-text-icons-green-3 bg-surface-green-2',
    orange: 'text-text-icons-amber-3 bg-surface-amber-1',
    red: 'text-text-icons-red-4 bg-surface-red-1',
  }[props.theme]

  let outlineClasses = {
    gray: 'text-text-icons-gray-6 bg-transparent border border-outline-gray-1',
    blue: 'text-text-icons-blue-2 bg-transparent border border-outline-blue-1',
    green:
      'text-text-icons-green-3 bg-transparent border border-outline-green-2',
    orange:
      'text-text-icons-amber-3 bg-transparent border border-outline-amber-2',
    red: 'text-text-icons-red-4 bg-transparent border border-outline-red-2',
  }[props.theme]

  let ghostClasses = {
    gray: 'text-text-icons-gray-6 bg-transparent',
    blue: 'text-text-icons-blue-2 bg-transparent',
    green: 'text-text-icons-green-3 bg-transparent',
    orange: 'text-text-icons-amber-3 bg-transparent',
    red: 'text-text-icons-red-4 bg-transparent',
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

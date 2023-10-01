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
    gray: 'text-white bg-gray-900',
    blue: 'text-white bg-blue-500',
    green: 'text-white bg-green-600',
    orange: 'text-white bg-amber-600',
    red: 'text-white bg-red-600',
  }[props.theme]

  let subtleClasses = {
    gray: 'text-gray-700 bg-gray-100',
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-800 bg-green-200',
    orange: 'text-amber-700 bg-amber-100',
    red: 'text-red-600 bg-red-100',
  }[props.theme]

  let outlineClasses = {
    gray: 'text-gray-700 bg-white border border-gray-300',
    blue: 'text-blue-600 bg-white border border-blue-300',
    green: 'text-green-800 bg-white border border-green-300',
    orange: 'text-amber-700 bg-white border border-amber-300',
    red: 'text-red-600 bg-white border border-red-300',
  }[props.theme]

  let ghostClasses = {
    gray: 'text-gray-700 bg-transparent',
    blue: 'text-blue-600 bg-transparent',
    green: 'text-green-800 bg-transparent',
    orange: 'text-amber-700 bg-transparent',
    red: 'text-red-600 bg-transparent',
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

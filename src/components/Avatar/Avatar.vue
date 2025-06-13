<template>
  <div
    class="relative inline-block shrink-0"
    :class="[sizeClasses, shapeClasses]"
  >
    <img
      v-if="image && !imgFetchError"
      :src="image"
      :alt="label"
      :class="[shapeClasses, 'h-full w-full object-cover']"
      @error="(err) => handleImageError(err)"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-surface-gray-2 uppercase text-ink-gray-5 select-none"
      :class="[labelClasses, shapeClasses]"
    >
      <div :class="iconClasses" v-if="$slots.default">
        <slot></slot>
      </div>
      <template v-else>
        {{ label && label[0] }}
      </template>
    </div>
    <div
      v-if="$slots.indicator"
      :class="[
        'absolute bottom-0 right-0 grid place-items-center rounded-full bg-surface-white',
        indicatorContainerClasses,
      ]"
    >
      <div :class="indicatorClasses">
        <slot name="indicator"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AvatarProps } from './types'

const imgFetchError = ref(false)

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
})

const shapeClasses = computed(() => {
  return {
    circle: 'rounded-full',
    square: {
      xs: 'rounded-[4px]',
      sm: 'rounded-[5px]',
      md: 'rounded-[5px]',
      lg: 'rounded-[6px]',
      xl: 'rounded-[6px]',
      '2xl': 'rounded-[8px]',
      '3xl': 'rounded-[10px]',
    }[props.size],
  }[props.shape]
})

const sizeClasses = computed(() => {
  return {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-11.5 h-11.5',
  }[props.size]
})

const labelClasses = computed(() => {
  let sizeClass = {
    xs: 'text-2xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
    '3xl': 'text-2xl',
  }[props.size]
  return ['font-medium', sizeClass]
})

const indicatorContainerClasses = computed(() => {
  return {
    xs: '-mr-[.1rem] -mb-[.1rem] h-2 w-2',
    sm: '-mr-[.1rem] -mb-[.1rem] h-[9px] w-[9px]',
    md: '-mr-[.1rem] -mb-[.1rem] h-2.5 w-2.5',
    lg: '-mr-[.1rem] -mb-[.1rem] h-3 w-3',
    xl: '-mr-[.1rem] -mb-[.1rem] h-3 w-3',
    '2xl': '-mr-[.1rem] -mb-[.1rem] h-3.5 w-3.5',
    '3xl': '-mr-[.2rem] -mb-[.2rem] h-4 w-4',
  }[props.size]
})

const indicatorClasses = computed(() => {
  return {
    xs: 'h-1 w-1',
    sm: 'h-[5px] w-[5px]',
    md: 'h-1.5 w-1.5',
    lg: 'h-2 w-2',
    xl: 'h-2 w-2',
    '2xl': 'h-2.5 w-2.5',
    '3xl': 'h-3 w-3',
  }[props.size]
})

const iconClasses = computed(() => {
  return {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-4 w-4',
    xl: 'h-4 w-4',
    '2xl': 'h-5 w-5',
    '3xl': 'h-5 w-5',
  }[props.size]
})

function handleImageError(err) {
  if (err.type) {
    imgFetchError.value = true
  }
}
</script>

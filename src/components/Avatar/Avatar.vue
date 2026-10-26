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
      :style="$slots.indicator && indicatorMask"
      @error="(err) => handleImageError(err)"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center uppercase select-none"
      :class="[labelClasses, fallbackThemeClasses, shapeClasses]"
      :style="$slots.indicator && indicatorMask"
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
      class="absolute grid place-items-center"
      :style="{
        width: indicatorBox.size,
        height: indicatorBox.size,
        right: `-${indicatorBox.offset}`,
        bottom: `-${indicatorBox.offset}`,
      }"
    >
      <div :class="indicatorClasses">
        <slot name="indicator"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import type { AvatarProps, AvatarTheme } from './types'

const imgFetchError = ref(false)

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
  theme: 'gray',
})

const fallbackThemeClasses = computed(() => {
  const classes: Record<AvatarTheme, string> = {
    gray: 'bg-surface-gray-2 text-ink-gray-5',
    blue: 'bg-surface-blue-2 text-ink-blue-7',
    green: 'bg-surface-green-2 text-ink-green-7',
    amber: 'bg-surface-amber-2 text-ink-amber-7',
    red: 'bg-surface-red-2 text-ink-red-7',
    violet: 'bg-surface-violet-2 text-ink-violet-7',
  }
  return classes[props.theme]
})

// Let a consumer size the avatar with a Tailwind utility (`class="size-16"`)
// instead of the `size` prop enum. When a sizing utility is present we drop the
// enum's `w-*/h-*` so the two don't both land on the root and fight; the class
// (applied via inheritAttrs) then wins on its own.
//
// Unprefixed tokens only. Tailwind emits variant utilities after the base ones,
// so `size-8 sm:size-16` already resolves the consumer's way at `sm`. Dropping
// the enum for a prefixed token instead leaves the avatar unsized everywhere
// the variant does not apply, and this root is `inline-block`, so it collapses
// to its content: an image-only avatar becomes 0x0.
const attrs = useAttrs()
const hasSizeOverride = computed(() => {
  const cls = Array.isArray(attrs.class)
    ? attrs.class.join(' ')
    : typeof attrs.class === 'string'
      ? attrs.class
      : ''
  return cls
    .split(/\s+/)
    .some(
      (token) =>
        !token.includes(':') &&
        /^-?(size|w|h|min-w|max-w|min-h|max-h)-/.test(token),
    )
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
  if (hasSizeOverride.value) return ''
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
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }[props.size]
  return ['font-medium', sizeClass]
})

// The box the indicator sits in, and how far it hangs past the avatar's
// bottom-right corner. The avatar masks out a circle the size of this box, so
// the gap around the indicator shows whatever is behind the avatar.
const indicatorBox = computed(() => {
  return {
    xs: { size: '0.5rem', offset: '0.1rem' },
    sm: { size: '9px', offset: '0.1rem' },
    md: { size: '0.625rem', offset: '0.1rem' },
    lg: { size: '0.75rem', offset: '0.1rem' },
    xl: { size: '0.75rem', offset: '0.1rem' },
    '2xl': { size: '0.875rem', offset: '0.1rem' },
    '3xl': { size: '1rem', offset: '0.2rem' },
  }[props.size]
})

const indicatorMask = computed(() => {
  const { size, offset } = indicatorBox.value
  const radius = `calc(${size} / 2)`
  const center = `calc(100% - ${radius} + ${offset})`
  return {
    maskImage: `radial-gradient(circle at ${center} ${center}, transparent ${radius}, #000 calc(${radius} + 0.5px))`,
  }
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

function handleImageError(err: Event) {
  if (err.type) {
    imgFetchError.value = true
  }
}

defineSlots<{
  /** Custom content shown inside the avatar (icon / initials replacement) */
  default?: () => any

  /** Small indicator shown at the bottom-right of the avatar */
  indicator?: () => any
}>()
</script>

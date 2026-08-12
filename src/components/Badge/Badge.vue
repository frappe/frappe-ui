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
import { resolvePropValue } from '../../utils/resolvePropValue'
import type { BadgeProps } from './types'

const props = withDefaults(defineProps<BadgeProps>(), {
  theme: 'gray',
  size: 'md',
  variant: 'subtle',
})

// The semantic scale (Figma export → tailwind/generated/colors.json) is
// consistent across all themes — gray is the only exception (`-7` is its
// saturated step, since gray needs more headroom). Tailwind's JIT needs
// literal class names so the per-theme strings are inlined below.
//   surface/{color}-2  pale bg          surface/{color}-5  saturated bg
//   outline/{color}-2  pale border
//   ink/{color}-1      pale text        ink/{color}-4      saturated text
const themeClasses = {
  gray: {
    solid: 'text-ink-base bg-surface-gray-10',
    subtle: 'text-ink-gray-6 bg-surface-gray-2',
    outline: 'text-ink-gray-6 border border-outline-gray-2',
    ghost: 'text-ink-gray-6',
  },
  blue: {
    solid: 'text-white bg-surface-blue-7',
    subtle: 'text-ink-blue-7 bg-surface-blue-2',
    outline: 'text-ink-blue-7 border border-outline-blue-3',
    ghost: 'text-ink-blue-7',
  },
  green: {
    solid: 'text-white bg-surface-green-7',
    subtle: 'text-ink-green-7 bg-surface-green-2',
    outline: 'text-ink-green-7 border border-outline-green-3',
    ghost: 'text-ink-green-7',
  },
  amber: {
    solid: 'text-white bg-surface-amber-7',
    subtle: 'text-ink-amber-7 bg-surface-amber-2',
    outline: 'text-ink-amber-7 border border-outline-amber-3',
    ghost: 'text-ink-amber-7',
  },
  red: {
    solid: 'text-white bg-surface-red-7',
    subtle: 'text-ink-red-7 bg-surface-red-2',
    outline: 'text-ink-red-7 border border-outline-red-3',
    ghost: 'text-ink-red-7',
  },
  violet: {
    solid: 'text-white bg-surface-violet-7',
    subtle: 'text-ink-violet-7 bg-surface-violet-2',
    outline: 'text-ink-violet-7 border border-outline-violet-3',
    ghost: 'text-ink-violet-7',
  },
}

const sizeClasses = {
  sm: 'h-4 px-1.5 text-xs',
  md: 'h-5 px-1.5 text-xs',
  lg: 'h-6 px-2 text-[13px] tracking-[0.02em]',
}

// Each axis resolves through `resolvePropValue`, so a value outside the union
// degrades to the prop's default instead of rendering wrong or throwing. Only
// `theme` could actually crash — it is the first of two chained lookups, so an
// unknown theme made the second one read a property of `undefined`. `variant`
// and `size` end their chains and merely rendered untinted or unsized, which
// is quieter but still wrong. All three now warn in dev.
const classes = computed(() => {
  const themeVariants = resolvePropValue(themeClasses, props.theme, 'gray', {
    component: 'Badge',
    prop: 'theme',
  })

  const variantClasses = resolvePropValue(
    themeVariants,
    props.variant,
    'subtle',
    { component: 'Badge', prop: 'variant' },
  )

  return [
    variantClasses,
    resolvePropValue(sizeClasses, props.size, 'md', {
      component: 'Badge',
      prop: 'size',
    }),
  ]
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

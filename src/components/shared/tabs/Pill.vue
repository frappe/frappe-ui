<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../../Icon'
import { browserTabCardClasses, tabRadiusClasses } from './styles'
import type { PillProps } from './pillTypes'

const props = withDefaults(defineProps<PillProps>(), {
  variant: 'subtle',
  size: 'md',
  active: false,
  browserTabBase: 'none',
  orientation: 'horizontal',
  underlineIndicator: true,
  activeSurface: true,
})

// `icon` means icon-only intent (label, if provided, is rendered as
// sr-only). `iconLeft` is an accent icon next to a visible label. Trailing
// content is the `#suffix` slot's job — counts and badges, not glyphs.
const isIconOnly = computed(() => Boolean(props.icon))

const sizeClasses = computed(() => {
  const isSm = props.size === 'sm'
  const vertical = props.orientation === 'vertical'

  // Icon-only pills are a square box: 28px (md) / 26px (sm), 5px padding.
  if (isIconOnly.value) {
    return isSm ? 'size-6.5 p-[5px]' : 'size-7 p-[5px]'
  }

  if (props.variant === 'underline') {
    // Horizontal: 32/28 tall, no x padding. Vertical: 28/26 tall, 8px x
    // padding so the label clears the rail-side indicator.
    if (vertical) return isSm ? 'h-6.5 gap-2 px-2' : 'h-7 gap-2 px-2'
    return isSm ? 'h-7 gap-2' : 'h-8 gap-2'
  }

  if (props.variant === 'browser-tab') {
    // Vertical tabs (attached or not): fixed 28/26 height so selection
    // cannot change row height. Horizontal: 32/28 tall.
    if (vertical) return isSm ? 'h-6.5 gap-2 px-2' : 'h-7 gap-2 px-2.5'
    return isSm ? 'h-7 gap-2 px-2 py-[5px]' : 'h-8 gap-2 px-2.5 py-[7px]'
  }

  // subtle / ghost: 28/26 tall, 10/8px x padding, 6/5px y padding.
  return isSm ? 'h-6.5 gap-2 px-2 py-[5px]' : 'h-7 gap-2 px-2.5 py-1.5'
})

const variantClasses = computed(() => {
  if (props.variant === 'underline') {
    if (!props.active) return 'hover:text-ink-gray-8'
    if (!props.underlineIndicator) return ''
    // 1px indicator drawn over the track's rail, matching the Figma
    // trigger-edge stroke (outline-gray-8).
    const indicator =
      props.orientation === 'vertical'
        ? 'after:absolute after:inset-y-0 after:-end-px after:w-px after:bg-[var(--outline-gray-8)]'
        : 'after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-[var(--outline-gray-8)]'
    return ['relative', indicator]
  }

  if (props.variant === 'browser-tab') {
    // Every browser tab carries a 1px border in both states so selection
    // never changes the trigger's box (no layout shift). Inactive tabs keep
    // it fully transparent.
    if (!props.active) {
      return 'border border-transparent hover:text-ink-gray-8'
    }
    // The track's sliding indicator carries the card between selections;
    // the pill keeps its inactive box so triggers never move.
    if (!props.activeSurface) return 'border border-transparent'
    // Active tab: white card with a 1px rail-colored border. The attached
    // edge stays transparent (the card background shows through), and the
    // after pseudo paints over the track's rail segment so the tab fuses
    // with the area beyond the rail.
    return ['relative', browserTabCardClasses(props.browserTabBase)]
  }

  if (!props.active) {
    return 'hover:text-ink-gray-8'
  }

  // The track's sliding indicator paints the active surface instead.
  if (!props.activeSurface) return ''

  // Shipped v1 subtle active pill (overrides Figma): elevation-3 so the
  // raised card stays lighter than the track in dark mode.
  return props.variant === 'ghost'
    ? 'bg-surface-gray-2'
    : 'bg-surface-elevation-3 shadow-base'
})

const rootClasses = computed(() => [
  'inline-flex box-border shrink-0 select-none items-center justify-center whitespace-nowrap outline-none transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
  // Shipped v1 subtle typography (overrides Figma): 13px regular at both
  // sizes, never medium.
  props.variant === 'subtle' ? 'text-sm leading-[16.1px]' : 'text-base',
  props.active ? 'text-ink-gray-8' : 'text-ink-gray-5',
  // Figma: md ghost/browser labels use text/base/medium (500, 0.015em);
  // md underline and all sm labels stay regular. The selected state
  // changes color only, never weight.
  props.size === 'md' &&
  props.variant !== 'underline' &&
  props.variant !== 'subtle'
    ? 'font-medium tracking-[0.015em]'
    : '',
  sizeClasses.value,
  tabRadiusClasses(props.variant, props.size, props.browserTabBase),
  variantClasses.value,
])

// 18px icons at md, 16px at sm. Underline pills with a visible label use
// 16px even at md; icon-only boxes go back to 18px.
const iconClass = computed(() => {
  if (props.size === 'sm') return 'size-4 shrink-0'
  if (props.variant === 'underline' && !isIconOnly.value) {
    return 'size-4 shrink-0'
  }
  return 'size-4.5 shrink-0'
})

function hasLabel(label: PillProps['label']) {
  return label !== undefined && label !== null && label !== ''
}

defineSlots<{
  prefix?: () => any
  default?: () => any
  suffix?: () => any
}>()
</script>

<template>
  <span :class="rootClasses" :data-state="active ? 'active' : 'inactive'">
    <Icon v-if="icon" :name="icon" :class="iconClass" />
    <Icon v-else-if="iconLeft" :name="iconLeft" :class="iconClass" />

    <span
      v-if="$slots.prefix"
      data-slot="tab-prefix"
      class="inline-flex items-center"
    >
      <slot name="prefix" />
    </span>

    <span
      v-if="hasLabel(label) || $slots.default"
      class="min-w-0 truncate"
      :class="isIconOnly ? 'sr-only' : undefined"
    >
      <slot>{{ label }}</slot>
    </span>

    <span
      v-if="$slots.suffix"
      data-slot="tab-suffix"
      class="inline-flex items-center"
    >
      <slot name="suffix" />
    </span>
  </span>
</template>

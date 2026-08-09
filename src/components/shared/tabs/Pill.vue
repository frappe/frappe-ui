<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../../Icon'
import { tabRadiusClasses } from './styles'
import type { PillProps } from './pillTypes'

const props = withDefaults(defineProps<PillProps>(), {
  variant: 'subtle',
  size: 'md',
  active: false,
  browserTabBase: 'none',
  orientation: 'horizontal',
  underlineIndicator: true,
})

// `icon` means icon-only intent (label, if provided, is rendered as
// sr-only). `iconLeft`/`iconRight` are accent icons next to a visible
// label. This matches Button's semantics.
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
    if (!props.active) return 'hover:text-ink-gray-7'
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
      return 'border border-transparent hover:bg-surface-gray-2 hover:text-ink-gray-7'
    }
    // Active tab: white card with a 1px rail-colored border. The attached
    // edge stays transparent (the card background shows through), and the
    // after pseudo paints over the track's rail segment so the tab fuses
    // with the area beyond the rail.
    if (props.browserTabBase === 'left') {
      return 'relative border border-outline-gray-1 border-l-transparent bg-surface-base after:absolute after:-inset-y-px after:-left-[2px] after:w-px after:bg-surface-base'
    }
    if (props.browserTabBase === 'right') {
      return 'relative border border-outline-gray-1 border-r-transparent bg-surface-base after:absolute after:-inset-y-px after:-right-[2px] after:w-px after:bg-surface-base'
    }
    return 'relative border border-outline-gray-1 border-b-transparent bg-surface-base after:absolute after:-inset-x-px after:-bottom-[2px] after:h-px after:bg-surface-base'
  }

  if (!props.active) {
    return 'hover:bg-surface-gray-3/80 hover:text-ink-gray-7'
  }

  return props.variant === 'ghost'
    ? 'bg-surface-gray-2'
    : 'bg-surface-elevation-1 shadow-base'
})

const rootClasses = computed(() => [
  'inline-flex box-border shrink-0 select-none items-center justify-center whitespace-nowrap text-base outline-none transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none',
  props.active ? 'text-ink-gray-8' : 'text-ink-gray-5',
  // Figma: md ghost/subtle/browser labels use text/base/medium (500,
  // 0.015em); md underline and all sm labels stay regular. The selected
  // state changes color only, never weight.
  props.size === 'md' && props.variant !== 'underline'
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

    <Icon
      v-if="iconRight && !isIconOnly"
      :name="iconRight"
      :class="iconClass"
    />
  </span>
</template>

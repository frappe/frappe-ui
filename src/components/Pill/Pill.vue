<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'
import type { PillProps } from './types'

const props = withDefaults(defineProps<PillProps>(), {
  variant: 'default',
  size: 'md',
  active: false,
  browserTabBase: 'none',
  orientation: 'horizontal',
  activeStyle: 'raised',
})

// `icon` means icon-only intent (label, if provided, is rendered as
// sr-only). `iconLeft`/`iconRight` are accent icons next to a visible
// label. This matches Button's semantics.
const isIconOnly = computed(() => Boolean(props.icon))

const rootClasses = computed(() => {
  const isSm = props.size === 'sm'
  const iconOnly = isIconOnly.value
  const active = props.active
  return [
    'inline-flex box-border shrink-0 select-none items-center justify-center whitespace-nowrap text-sm leading-[16.1px] outline-none transition-[background-color,color,box-shadow,border-color] duration-150 ease-out motion-reduce:transition-none',
    active ? 'text-ink-gray-9' : 'text-ink-gray-5',
    iconOnly
      ? isSm
        ? 'size-6.5 gap-1.5 p-[5px]'
        : 'size-7 gap-1.5 p-[5px]'
      : props.variant === 'underline'
        ? isSm
          ? 'h-7 gap-2'
          : 'h-7.5 gap-2'
        : isSm
          ? 'h-6.5 gap-2 px-2 py-[5px]'
          : 'h-7 gap-2 px-2.5 py-1.5',
    radiusClass.value,
    variantClass.value,
  ]
})

const radiusClass = computed(() => {
  if (props.variant === 'underline') return ''

  if (props.variant === 'browser-tab') {
    if (props.browserTabBase === 'left')
      return props.size === 'sm' ? 'rounded-r-[7px]' : 'rounded-r-[9px]'
    if (props.browserTabBase === 'right')
      return props.size === 'sm' ? 'rounded-l-[7px]' : 'rounded-l-[9px]'
    if (props.browserTabBase === 'default')
      return props.size === 'sm' ? 'rounded-t-[7px]' : 'rounded-t-[9px]'
    return props.size === 'sm' ? 'rounded-[7px]' : 'rounded-[9px]'
  }

  return props.size === 'sm' ? 'rounded-[7px]' : 'rounded-[9px]'
})

const variantClass = computed(() => {
  if (props.variant === 'underline') {
    const isVertical = props.orientation === 'vertical'
    const railSlot = isVertical
      ? 'border-r border-transparent'
      : 'border-b border-transparent'
    if (props.active) {
      // Indicator sits on the container's gray rail. Vertical uses a 2px
      // bar so it reads as a tab selector, not a text caret.
      const indicator = isVertical
        ? 'after:absolute after:top-0 after:bottom-0 after:-right-[3px] after:w-[3px] after:rounded-full after:bg-[var(--ink-gray-8)]'
        : 'after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-[var(--ink-gray-8)]'
      return ['relative', railSlot, indicator]
    }
    return [railSlot, 'hover:text-ink-gray-7']
  }

  if (props.variant === 'browser-tab') {
    if (!props.active) {
      return 'border border-transparent hover:bg-surface-gray-2 hover:text-ink-gray-7'
    }

    // Active tab has no bottom (or inner) border so it merges into the
    // panel below. The white pseudo must extend past the pill's borders
    // in the cross-axis (top:-px bottom:-px or left:-px right:-px) so the
    // gray rail doesn't peek out where the pill's own border sits.
    if (props.browserTabBase === 'left') {
      return 'relative border border-l-0 border-outline-gray-1 bg-surface-white after:absolute after:-left-px after:-top-px after:-bottom-px after:w-px after:bg-surface-white'
    }

    if (props.browserTabBase === 'right') {
      return 'relative border border-r-0 border-outline-gray-1 bg-surface-white after:absolute after:-right-px after:-top-px after:-bottom-px after:w-px after:bg-surface-white'
    }

    return 'relative border border-b-0 border-outline-gray-1 bg-surface-white after:absolute after:-inset-x-px after:-bottom-px after:h-px after:bg-surface-white'
  }

  if (props.variant === 'outline') {
    return props.active
      ? 'border border-transparent bg-surface-white shadow-sm'
      : 'border border-outline-gray-1 hover:bg-surface-gray-2 hover:text-ink-gray-7'
  }

  if (!props.active) {
    return 'hover:bg-surface-gray-3/80 hover:text-ink-gray-7'
  }

  return props.activeStyle === 'subtle'
    ? 'bg-surface-gray-2'
    : 'bg-surface-white shadow-sm'
})

const iconClass = computed(() =>
  props.size === 'sm' ? 'size-4 shrink-0' : 'size-[18px] shrink-0',
)

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
    <slot name="prefix">
      <Icon v-if="icon" :name="icon" :class="iconClass" />
      <Icon v-else-if="iconLeft" :name="iconLeft" :class="iconClass" />
    </slot>

    <span
      v-if="hasLabel(label) || $slots.default"
      class="min-w-0 truncate"
      :class="isIconOnly ? 'sr-only' : undefined"
    >
      <slot>{{ label }}</slot>
    </span>

    <slot name="suffix">
      <Icon v-if="iconRight && !isIconOnly" :name="iconRight" :class="iconClass" />
    </slot>
  </span>
</template>
</content>

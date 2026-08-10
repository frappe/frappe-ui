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
})

const slots = defineSlots<{
  prefix?: () => any
  default?: () => any
  suffix?: () => any
}>()

// `icon` means icon-only intent (label, if provided, is rendered as
// sr-only). `iconLeft` is an accent icon next to a visible label. Trailing
// content is the `#suffix` slot's job — counts and badges, not glyphs.
// A default slot cancels icon-only intent: the caller is supplying visible
// label content, so hiding it would drop what they passed. `TabTrigger` reads
// the same rule for the `aria-label`/`title` it derives from `label`.
const isIconOnly = computed(() => Boolean(props.icon) && !slots.default)

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
  // The pill never paints the active surface or the underline itself. Both
  // tracks (`TabList`, `TabButtons`) own a sliding indicator that carries
  // them between selections, so an active pill differs from an inactive one
  // only in text color — which is what lets the indicator slide.
  if (props.variant === 'browser-tab') {
    // Every browser tab carries a 1px border in both states so selection
    // never changes the trigger's box. Inactive tabs keep it transparent;
    // active ones keep the same box while the track's card slides beneath.
    return props.active
      ? 'border border-transparent'
      : 'border border-transparent hover:text-ink-gray-8'
  }

  return props.active ? '' : 'hover:text-ink-gray-8'
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

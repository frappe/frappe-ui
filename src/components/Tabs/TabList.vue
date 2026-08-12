<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { TabsIndicator, TabsList } from 'reka-ui'
import {
  browserTabCardClasses,
  tabIndicatorClipClasses,
  tabIndicatorInsetClasses,
  tabIndicatorMotionClasses,
  tabIndicatorSurfaceClasses,
  tabRadiusClasses,
  tabTrackClasses,
} from '../shared/tabs/styles'
import { tabListKey, tabsRootKey } from './context'
import type { TabListProps } from './types'

const props = withDefaults(defineProps<TabListProps>(), {
  variant: 'underline',
  size: 'sm',
  side: 'left',
})

const root = inject(tabsRootKey, null)

const orientation = computed(() => root?.orientation.value ?? 'horizontal')

provide(tabListKey, {
  variant: computed(() => props.variant),
  size: computed(() => props.size),
  side: computed(() => props.side),
})

const pillTrack = computed(
  () => props.variant === 'subtle' || props.variant === 'ghost',
)

const browserTrack = computed(() => props.variant === 'browser-tab')

const listClasses = computed(() => {
  const vertical = orientation.value === 'vertical'
  return [
    // `isolate` keeps the -z-10 sliding indicator above the track's own
    // background and rail border while staying behind the (static) triggers.
    // `self-start` keeps the pill track content-hugging: `inline-flex` alone
    // still stretches to the cross axis when the root is a flex container
    // (shorthand mode). Underline and browser-tab rails do want to span.
    pillTrack.value
      ? 'relative isolate inline-flex shrink-0 self-start'
      : browserTrack.value
        ? 'relative isolate flex'
        : 'relative flex',
    vertical ? 'flex-col' : 'items-center',
    ...tabTrackClasses({
      variant: props.variant,
      size: props.size,
      orientation: orientation.value,
      side: props.side,
    }),
  ]
})

// The animated underline indicator sits on the rail: 1px thick, shifted
// one pixel outward so it overlays the track border.
const indicatorClasses = computed(() =>
  orientation.value === 'vertical'
    ? 'end-0 top-0 w-px h-[--reka-tabs-indicator-size] translate-y-[--reka-tabs-indicator-position] translate-x-px rtl:-translate-x-px transition-[height,transform]'
    : 'left-0 bottom-0 h-px w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] translate-y-px transition-[width,transform]',
)

// Layer that clips the pill indicator's shadow to the track's rounded box.
const indicatorClipClasses = computed(() =>
  tabIndicatorClipClasses(props.variant, props.size),
)

// Sliding active-pill surface for subtle/ghost: rides behind the triggers,
// which never paint an active background themselves, and carries the
// background + shadow between selections.
const pillIndicatorClasses = computed(() => [
  ...tabIndicatorSurfaceClasses(props.variant, props.size),
  tabIndicatorInsetClasses({
    variant: props.variant,
    size: props.size,
    orientation: orientation.value,
  }),
  orientation.value === 'vertical'
    ? 'top-0 h-[--reka-tabs-indicator-size] translate-y-[--reka-tabs-indicator-position] transition-[height,transform]'
    : 'left-0 w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] transition-[width,transform]',
])

// Sliding card for browser-tab: the indicator IS the active card (opaque
// surface, 1px borders except the attached edge, rounded detached corners).
// Its `after` fusion mask over the track's rail travels with it, so the
// open edge in the rail moves continuously mid-flight.
const browserIndicatorClasses = computed(() => {
  const vertical = orientation.value === 'vertical'
  const base = vertical ? props.side : 'default'
  return [
    tabRadiusClasses('browser-tab', props.size, base),
    browserTabCardClasses(base),
    vertical
      ? 'inset-x-0 top-0 h-[--reka-tabs-indicator-size] translate-y-[--reka-tabs-indicator-position] transition-[height,transform]'
      : 'inset-y-0 left-0 w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] transition-[width,transform]',
  ]
})

defineSlots<{
  default?: () => any
}>()
</script>

<template>
  <TabsList
    data-slot="tab-list"
    :data-variant="props.variant"
    :data-size="props.size"
    :class="listClasses"
  >
    <TabsIndicator
      v-if="props.variant === 'underline'"
      aria-hidden="true"
      data-slot="tab-indicator"
      class="absolute motion-reduce:transition-none"
      :class="[indicatorClasses, tabIndicatorMotionClasses]"
    >
      <div class="size-full bg-[var(--outline-gray-8)]" />
    </TabsIndicator>

    <!-- Presentational clip layer, deliberately without a `data-slot`: it
         carries no contract, it only stops the indicator's shadow at the
         track edge. -->
    <div v-if="pillTrack" aria-hidden="true" :class="indicatorClipClasses">
      <TabsIndicator
        data-slot="tab-indicator"
        class="pointer-events-none absolute -z-10 motion-reduce:transition-none"
        :class="[pillIndicatorClasses, tabIndicatorMotionClasses]"
      />
    </div>

    <TabsIndicator
      v-if="browserTrack"
      aria-hidden="true"
      data-slot="tab-indicator"
      class="pointer-events-none absolute -z-10 motion-reduce:transition-none"
      :class="[browserIndicatorClasses, tabIndicatorMotionClasses]"
    />

    <slot />
  </TabsList>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { TabsIndicator, TabsList } from 'reka-ui'
import { tabTrackClasses } from '../shared/tabs/styles'
import { tabListKey, tabsRootKey } from './context'
import type { TabListProps } from './types'

const props = withDefaults(defineProps<TabListProps>(), {
  variant: 'underline',
  size: 'sm',
  direction: 'left',
})

const root = inject(tabsRootKey, null)

const orientation = computed(() => root?.orientation.value ?? 'horizontal')

provide(tabListKey, {
  variant: computed(() => props.variant),
  size: computed(() => props.size),
  direction: computed(() => props.direction),
})

const listClasses = computed(() => {
  const vertical = orientation.value === 'vertical'
  const pillTrack = props.variant === 'subtle' || props.variant === 'ghost'
  return [
    pillTrack ? 'inline-flex shrink-0' : 'relative flex',
    vertical ? 'flex-col' : 'items-center',
    ...tabTrackClasses({
      variant: props.variant,
      size: props.size,
      orientation: orientation.value,
      direction: props.direction,
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
      class="absolute duration-300 motion-reduce:transition-none"
      :class="indicatorClasses"
    >
      <div class="size-full bg-[var(--outline-gray-8)]" />
    </TabsIndicator>

    <slot />
  </TabsList>
</template>

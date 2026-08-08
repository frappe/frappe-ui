<template>
  <div
    data-slot="sidebar"
    :data-state="shouldCollapse ? 'collapsed' : 'expanded'"
    class="flex h-full flex-shrink-0 flex-col overflow-x-hidden bg-surface-sidebar transition-[width] duration-300 ease-in-out"
    :style="{ width: shouldCollapse ? collapsedWidth : width }"
  >
    <!-- The app owns the entire body: header, scroll region, footer. Compose
         it from SidebarHeader / SidebarSection / SidebarLabel / SidebarItem
         and plain markup. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, provide } from 'vue'
import { SidebarProps, sidebarCollapsedKey, sidebarToggleKey } from './types'

const props = withDefaults(defineProps<SidebarProps>(), {
  width: '15rem',
  collapsedWidth: '3rem',
})

defineSlots<{
  /** The sidebar body — header, scroll region, footer, all composed by the app. */
  default?: () => any
}>()

// `defineModel` already declares this event, but it carries no place to write
// the event's own description. Redeclaring it here is what puts the sentence
// in the generated API table.
defineEmits<{
  /** Fired when the sidebar is collapsed or expanded. */
  'update:collapsed': [value: boolean | null]
}>()

/** v-model. Whether the sidebar is collapsed. Left unset, it collapses automatically below the `sm` breakpoint. */
const isCollapsed = defineModel<boolean | null>('collapsed', { default: null })

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')

// Unset (`null`) falls back to collapsing on mobile; `disableCollapse` pins open.
const shouldCollapse = computed(
  () => (isCollapsed.value ?? isMobile.value) && !props.disableCollapse,
)

function toggle() {
  isCollapsed.value = !shouldCollapse.value
}

provide(sidebarCollapsedKey, shouldCollapse)
provide(sidebarToggleKey, toggle)
</script>

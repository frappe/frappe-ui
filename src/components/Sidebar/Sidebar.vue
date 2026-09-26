<template>
  <!-- A <nav> landmark, so screen-reader users can jump to the app's
       navigation. It is the only one the sidebar family emits: SidebarSection
       bodies are `role="group"`, because nested landmarks add noise instead of
       structure. Keep app-written wrappers inside the slot as plain divs. -->
  <nav
    data-slot="sidebar"
    :data-state="shouldCollapse ? 'collapsed' : 'expanded'"
    :aria-label="ariaLabel"
    class="flex h-full flex-shrink-0 flex-col overflow-x-hidden bg-surface-sidebar transition-[width] duration-300 ease-in-out"
    :style="{ width: shouldCollapse ? collapsedWidth : width }"
  >
    <!-- The app owns the entire body: header, scroll region, footer. Compose
         it from SidebarHeader / SidebarSection / SidebarLabel / SidebarItem
         and plain markup. -->
    <slot />
  </nav>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, provide } from 'vue'
import { SidebarProps, sidebarCollapsedKey, sidebarToggleKey } from './types'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: true,
  width: '15rem',
  collapsedWidth: '3rem',
  ariaLabel: 'Main',
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

const shouldCollapse = computed(
  () => props.collapsible && (isCollapsed.value ?? isMobile.value),
)

function toggle() {
  isCollapsed.value = !shouldCollapse.value
}

provide(sidebarCollapsedKey, shouldCollapse)
provide(sidebarToggleKey, toggle)
</script>

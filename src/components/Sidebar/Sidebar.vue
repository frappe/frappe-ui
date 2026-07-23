<template>
  <div
    data-slot="sidebar"
    :data-state="shouldCollapse ? 'collapsed' : 'expanded'"
    class="flex h-full flex-shrink-0 flex-col overflow-x-hidden bg-surface-sidebar transition-[width] duration-300 ease-in-out"
    :class="{ 'border-r border-outline-gray-1': isLegacy }"
    :style="{ width: shouldCollapse ? collapsedWidth : width }"
  >
    <!-- Composition: the app owns the entire body (header, scroll, footer). -->
    <slot v-if="!isLegacy" />

    <!--
      Legacy config-object layout, kept for one release. Rendered only when no
      default slot is supplied and `header`/`sections` are passed.
    -->
    <template v-else>
      <div class="flex h-full flex-col p-2">
        <SidebarHeader
          v-if="header"
          :title="header.title"
          :subtitle="header.subtitle"
          :logo="header.logo"
          :menu-items="header.menuItems"
        >
          <template v-if="slots['header-logo']" #logo>
            <slot name="header-logo" />
          </template>
        </SidebarHeader>

        <!-- -mx/px: rows sit flush with the clip edge, so without this the
             active item's shadow ring is cut off at both sides. -->
        <div class="-mx-1 flex-1 overflow-y-auto overflow-x-hidden px-1">
          <SidebarSection
            v-for="section in sections"
            :key="section.label"
            :label="section.label"
            :items="section.items"
            :collapsible="section.collapsible"
          >
            <!-- Forward the per-item slot so `:sections` consumers can customise each
                 row (e.g. a trailing actions menu), matching SidebarSection's own slot. -->
            <template v-if="slots['sidebar-item']" #sidebar-item="itemProps">
              <slot name="sidebar-item" v-bind="itemProps" />
            </template>
          </SidebarSection>
        </div>

        <div class="mt-auto">
          <slot name="footer-items" />
          <SidebarCollapseToggle v-if="!disableCollapse" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, provide, useSlots } from 'vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarSection from './SidebarSection.vue'
import SidebarCollapseToggle from './SidebarCollapseToggle.vue'
import { SidebarProps, sidebarCollapsedKey, sidebarToggleKey } from './types'

const props = withDefaults(defineProps<SidebarProps>(), {
  width: '15rem',
  collapsedWidth: '3rem',
})

const slots = useSlots()
// Composition wins whenever the consumer supplies default-slot content.
const isLegacy = computed(
  () => !slots.default && (Boolean(props.header) || Boolean(props.sections)),
)

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

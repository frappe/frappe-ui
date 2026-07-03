<template>
  <div data-slot="sidebar-label" class="relative flex h-7 items-center pl-2">
    <h3
      class="text-base text-ink-gray-5 transition-all duration-300 ease-in-out"
      :class="
        isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
      "
    >
      <slot />
    </h3>

    <!-- While collapsed, a section label has no room; show a divider instead so
         groups stay visually separated. Opt in with `divider`. -->
    <div
      v-if="divider && isCollapsed"
      aria-hidden="true"
      class="absolute inset-0 flex items-center"
    >
      <hr class="w-full border-t border-ink-gray-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { SidebarLabelProps, sidebarCollapsedKey } from './types'

defineProps<SidebarLabelProps>()

const isCollapsed = inject(
  sidebarCollapsedKey,
  computed(() => false),
)
</script>

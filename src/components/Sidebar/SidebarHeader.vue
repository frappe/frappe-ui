<template>
  <!-- Fixed 48px region so the sidebar header lines up with PageHeader
       (min-h-12). The trigger sits 40px tall, centered in that region, and owns
       the sidebar gutter (px-2) itself — so consumers drop it straight into
       <Sidebar> without a wrapping padding div. -->
  <div
    class="flex h-12 shrink-0 items-center"
    :class="isCollapsed ? 'justify-center' : 'px-1'"
  >
    <Dropdown :options="props.menuItems" match-trigger-width>
      <template v-slot="{ open }">
        <button
          class="flex h-10 items-center rounded px-1.5 duration-300 ease-in-out"
          :class="
            isCollapsed
              ? 'w-auto'
              : open
                ? 'w-full bg-surface-elevation-2 shadow-sm'
                : 'w-full hover:bg-surface-gray-3'
          "
        >
          <div
            v-if="showLogo"
            class="size-7 shrink-0 rounded-[6px] overflow-hidden"
          >
            <slot name="logo">
              <img
                v-if="typeof props.logo === 'string'"
                :src="props.logo"
                class="w-full h-full object-cover"
                alt="Logo"
              />
              <div
                v-else-if="!props.logo"
                class="w-full h-full bg-surface-gray-4 flex items-center justify-center text-ink-gray-7"
              >
                {{ props.title.charAt(0).toUpperCase() }}
              </div>
              <component v-else :is="props.logo" class="w-full h-full" />
            </slot>
          </div>
          <div
            class="flex flex-1 flex-col text-left duration-300 ease-in-out truncate"
            :class="
              isCollapsed
                ? 'ml-0 w-0 overflow-hidden opacity-0'
                : showLogo
                  ? 'ml-2 w-auto opacity-100'
                  : 'ml-0 w-auto opacity-100'
            "
          >
            <div class="leading-none">
              <span class="text-base-medium text-ink-gray-8">
                {{ props.title }}
              </span>
            </div>
            <div class="mt-0.5 leading-none">
              <span class="text-sm text-ink-gray-6">
                {{ props.subtitle }}
              </span>
            </div>
          </div>
          <div
            class="duration-300 ease-in-out"
            :class="
              isCollapsed
                ? 'ml-0 w-0 overflow-hidden opacity-0'
                : 'ml-2 w-auto opacity-100'
            "
          >
            <span class="lucide-chevron-down size-4 text-ink-gray-7" />
          </div>
        </button>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Dropdown from '../Dropdown/Dropdown.vue'
import { SidebarHeaderProps, sidebarCollapsedKey } from './types'

// `showLogo` must default to `true` (see SidebarHeaderProps). A bare
// `defineProps<{ showLogo?: boolean }>()` would let Vue's Boolean-prop casting
// coerce an absent value to `false`, so the default is set explicitly here.
const props = withDefaults(defineProps<SidebarHeaderProps>(), {
  showLogo: true,
})
const isCollapsed = inject(
  sidebarCollapsedKey,
  computed(() => false),
)
const showLogo = computed(() => props.showLogo !== false)
</script>

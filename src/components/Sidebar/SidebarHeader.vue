<template>
  <Dropdown :options="props.menuItems">
    <template v-slot="{ open }">
      <button
        class="flex h-12 w-[14rem] items-center rounded-md py-2 duration-300 ease-in-out"
        :class="
          isCollapsed
            ? 'w-auto px-0'
            : open
              ? 'bg-surface-white px-2 shadow-sm'
              : 'px-2 hover:bg-surface-gray-3'
        "
      >
        <div class="h-8 w-8 overflow-hidden rounded">
          <slot name="logo">
            <img
              v-if="typeof props.logo === 'string'"
              :src="props.logo"
              class="h-full w-full object-cover"
              alt="Logo"
            />
            <div
              v-else-if="!props.logo"
              class="flex h-full w-full items-center justify-center bg-surface-gray-4 text-ink-gray-7"
            >
              {{ props.title.charAt(0).toUpperCase() }}
            </div>
            <component v-else :is="props.logo" class="h-full w-full" />
          </slot>
        </div>
        <div
          class="flex flex-1 flex-col truncate text-left duration-300 ease-in-out"
          :class="isCollapsed ? 'ml-0 w-0 overflow-hidden opacity-0' : 'ml-2 w-auto opacity-100'"
        >
          <div class="text-base font-medium leading-none text-ink-gray-8">
            {{ props.title }}
          </div>
          <div class="mt-1 text-sm leading-none text-ink-gray-6">
            {{ props.subtitle }}
          </div>
        </div>
        <div
          class="duration-300 ease-in-out"
          :class="isCollapsed ? 'ml-0 w-0 overflow-hidden opacity-0' : 'ml-2 w-auto opacity-100'"
        >
          <LucideChevronDown class="h-4 w-4 text-ink-gray-7" />
        </div>
      </button>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import LucideChevronDown from '~icons/lucide/chevron-down'

import Dropdown from '../Dropdown/Dropdown.vue'
import { SidebarHeaderProps } from './types'

const props = defineProps<SidebarHeaderProps>()
const isCollapsed = inject('isSidebarCollapsed', false)
</script>

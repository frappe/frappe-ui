<template>
  <Dropdown :options="dropdownItems">
    <template v-slot="{ open }">
      <button
        class="flex h-12 items-center rounded-md py-2 duration-300 ease-in-out w-[14rem]"
        :class="
          isCollapsed
            ? 'w-auto px-0'
            : open
              ? 'bg-surface-white px-2 shadow-sm'
              : 'px-2 hover:bg-surface-gray-3'
        "
      >
        <slot name="logo">
          <div class="w-8 h-8 rounded bg-surface-gray-4 flex items-center justify-center text-ink-gray-7">
            {{ props.title.charAt(0).toUpperCase() }}
          </div>
        </slot>
        <div
          class="flex flex-1 flex-col text-left duration-300 ease-in-out truncate"
          :class="
            isCollapsed
              ? 'ml-0 w-0 overflow-hidden opacity-0'
              : 'ml-2 w-auto opacity-100'
          "
          >
          <div class="text-base font-medium text-ink-gray-8 leading-none">{{ props.title }}</div>
          <div class="mt-1 text-sm text-ink-gray-6 leading-none">
            {{ props.subtitle }}
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
          <LucideChevronDown class="h-4 w-4 text-ink-gray-7"/>
        </div>
      </button>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { clear as clearIndexDb } from 'idb-keyval';
import { computed, onMounted } from 'vue';
import Dropdown from '../Dropdown/Dropdown.vue';

import LucideInfo from '~icons/lucide/info';
import LucideListRestart from '~icons/lucide/list-restart';
import LucideMoon from '~icons/lucide/moon';

const props = defineProps<{
  title: string;
  subtitle: string;
  isCollapsed?: boolean;
}>();

const dropdownItems = computed(() => [
  {
    icon: LucideMoon,
    label: 'Toggle theme',
    onClick: toggleTheme,
  },
  {
    icon: LucideListRestart,
    label: 'Clear cache',
    onClick: clearCache,
  },
  {
    icon: LucideInfo,
    label: 'About',
  },
  {
    icon: 'log-out',
    label: 'Log out',
  },
])

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  let theme = currentTheme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

function clearCache() {
  localStorage.clear()
  sessionStorage.clear()
  clearIndexDb().then(() => {
    console.log('Cache cleared')
    window.location.reload()
  })
}

onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light'
  if (['light', 'dark'].includes(theme)) {
    document.documentElement.setAttribute('data-theme', theme)
  }
})
</script>

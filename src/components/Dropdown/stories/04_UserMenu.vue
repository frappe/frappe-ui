<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dropdown } from 'frappe-ui'
import GameplanLogo from './GameplanLogo.vue'
import LucideCheck from '~icons/lucide/check'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideInfo from '~icons/lucide/info'
import LucideLayoutGrid from '~icons/lucide/layout-grid'
import LucideListRestart from '~icons/lucide/list-restart'
import LucideLogOut from '~icons/lucide/log-out'
import LucideMoon from '~icons/lucide/moon'
import LucideSettings from '~icons/lucide/settings'
import LucideUser from '~icons/lucide/user'

const theme = ref<'light' | 'dark' | 'system'>('system')

const userMenuItems = computed(() => [
  {
    icon: LucideUser,
    label: 'My Profile',
    onClick: () => console.log('My Profile clicked'),
  },
  {
    icon: LucideLayoutGrid,
    label: 'Apps',
    submenu: [
      {
        label: 'Gameplan',
        selected: true,
        onClick: () => console.log('Gameplan clicked'),
      },
      {
        label: 'Drive',
        onClick: () => console.log('Drive clicked'),
      },
      {
        label: 'Helpdesk',
        onClick: () => console.log('Helpdesk clicked'),
      },
    ],
  },
  {
    icon: LucideSettings,
    label: 'Settings & Members',
    onClick: () => console.log('Settings & Members clicked'),
  },
  {
    icon: LucideMoon,
    label: 'Theme',
    submenu: [
      {
        label: 'Light Mode',
        selected: theme.value === 'light',
        onClick: () => {
          theme.value = 'light'
        },
      },
      {
        label: 'Dark Mode',
        selected: theme.value === 'dark',
        onClick: () => {
          theme.value = 'dark'
        },
      },
      {
        label: 'System Default',
        selected: theme.value === 'system',
        onClick: () => {
          theme.value = 'system'
        },
      },
    ],
  },
  {
    group: 'Account',
    items: [
      {
        icon: LucideListRestart,
        label: 'Clear cache',
        onClick: () => console.log('Clear cache clicked'),
      },
      {
        icon: LucideInfo,
        label: 'About',
        onClick: () => console.log('About clicked'),
      },
      {
        icon: LucideLogOut,
        label: 'Log out',
        onClick: () => console.log('Log out clicked'),
      },
    ],
  },
])
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Dropdown :options="userMenuItems">
      <template #default="{ open }">
        <button
          class="flex w-56 items-center rounded-md px-2 py-2 text-left transition-colors"
          :class="open ? 'bg-surface-gray-3' : 'hover:bg-surface-gray-2'"
        >
          <GameplanLogo class="size-8 rounded" />
          <div class="ml-2 min-w-0">
            <div
              class="truncate text-base font-medium text-ink-gray-8 leading-none"
            >
              Gameplan
            </div>
            <div class="mt-1 truncate text-p-sm text-ink-gray-5 leading-none">
              Faris
            </div>
          </div>
          <LucideChevronDown
            class="ml-auto size-4 text-ink-gray-6 transition-transform"
            :class="open ? 'rotate-180' : ''"
          />
        </button>
      </template>

      <template #item-suffix="{ selected }">
        <LucideCheck v-if="selected" class="size-4 text-ink-gray-7" />
      </template>
    </Dropdown>

    <div class="text-p-sm text-ink-gray-5">
      Selected theme: <span class="text-ink-gray-7">{{ theme }}</span>
    </div>
  </div>
</template>

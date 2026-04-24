<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dropdown } from 'frappe-ui'
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
          <!-- Gameplan logo -->
          <svg
            class="size-8 rounded"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 44 44"
          >
            <path
              fill="#F90"
              d="M31.429 0H12.57C5.628 0 0 5.628 0 12.571V31.43C0 38.372 5.628 44 12.571 44H31.43C38.372 44 44 38.372 44 31.429V12.57C44 5.628 38.372 0 31.429 0Z"
            />
            <path
              fill="#fff"
              d="M12.571 28.082v-8.093H9.43v7.307a3.93 3.93 0 0 0 3.928 3.929h9.554v-3.143h-10.34Z"
            />
            <path
              fill="#fff"
              d="M30.643 12.76H9.429v3.143h22v12.179h-5.045l-3.457 4.305 2.42 1.996 2.53-3.159h2.766a3.93 3.93 0 0 0 3.928-3.928V16.689a3.93 3.93 0 0 0-3.928-3.929Z"
            />
          </svg>
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

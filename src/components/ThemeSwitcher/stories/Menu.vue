<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Dropdown, useTheme, type DropdownOptions } from 'frappe-ui'

const { currentTheme, setTheme } = useTheme()

const themes = [
  { label: 'Light', icon: 'lucide-sun', value: 'light' },
  { label: 'Dark', icon: 'lucide-moon', value: 'dark' },
  { label: 'System', icon: 'lucide-monitor', value: 'system' },
] as const

const menuOptions = computed<DropdownOptions>(() => [
  { icon: 'lucide-user', label: 'My Profile', onClick: () => {} },
  {
    icon: 'lucide-sun-moon',
    label: 'Theme',
    submenu: themes.map((theme) => ({
      label: theme.label,
      icon: theme.icon,
      selected: currentTheme.value === theme.value,
      onClick: () => setTheme(theme.value),
    })),
  },
  { icon: 'lucide-log-out', label: 'Log out', onClick: () => {} },
])

const crmLogo = 'https://raw.githubusercontent.com/frappe/crm/develop/.github/logo.svg'
</script>

<template>
  <Dropdown :options="menuOptions">
    <template #default="{ open }">
      <button
        class="flex items-center gap-2 rounded-md px-2 py-2"
        :class="open ? 'bg-surface-gray-3' : 'hover:bg-surface-gray-2'"
      >
        <Avatar shape='square' :image="crmLogo" label="CRM" />
        <div class="text-start">
          <div class="text-base font-medium leading-none text-ink-gray-9">
            CRM
          </div>
          <div class="mt-1 text-sm text-ink-gray-7">faris@example.com</div>
        </div>
        <LucideChevronDown class="ml-2 size-4 text-ink-gray-5" />
      </button>
    </template>

    <template #item-suffix="{ selected }">
      <LucideCheck v-if="selected" class="size-4 text-ink-gray-7" />
    </template>
  </Dropdown>
</template>

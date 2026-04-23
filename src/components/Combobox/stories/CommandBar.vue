<script setup lang="ts">
import { h, ref } from 'vue'
import { Combobox } from 'frappe-ui'
import LucideFile from '~icons/lucide/file'
import LucidePlus from '~icons/lucide/plus'
import LucideSettings from '~icons/lucide/settings'
import LucideSearch from '~icons/lucide/search'
import LucideUsers from '~icons/lucide/users'
import LucideMoon from '~icons/lucide/moon'

const value = ref<string | null>(null)
const lastAction = ref('')

function shortcut(keys: string[]) {
  return h(
    'div',
    { class: 'flex items-center gap-1' },
    keys.map((k) =>
      h(
        'kbd',
        {
          class:
            'inline-flex min-w-[1.25rem] items-center justify-center rounded border border-outline-gray-2 bg-surface-white px-1 font-mono text-[10px] font-medium leading-4 text-ink-gray-6 shadow-sm',
        },
        k,
      ),
    ),
  )
}

type Command = {
  key: string
  label: string
  icon: any
  keys?: string[]
  action: () => void
}

const commands: { group: string; items: Command[] }[] = [
  {
    group: 'Actions',
    items: [
      {
        key: 'new-page',
        label: 'New page',
        icon: LucidePlus,
        keys: ['⌘', 'N'],
        action: () => (lastAction.value = 'Created new page'),
      },
      {
        key: 'search',
        label: 'Search everywhere',
        icon: LucideSearch,
        keys: ['⌘', 'K'],
        action: () => (lastAction.value = 'Opened search'),
      },
      {
        key: 'invite',
        label: 'Invite teammates',
        icon: LucideUsers,
        keys: ['⌘', 'I'],
        action: () => (lastAction.value = 'Invite dialog opened'),
      },
    ],
  },
  {
    group: 'Navigate',
    items: [
      {
        key: 'recent',
        label: 'Open recent file…',
        icon: LucideFile,
        action: () => (lastAction.value = 'Recent file list opened'),
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: LucideSettings,
        keys: ['⌘', ','],
        action: () => (lastAction.value = 'Settings opened'),
      },
      {
        key: 'theme',
        label: 'Toggle theme',
        icon: LucideMoon,
        keys: ['⌘', 'T'],
        action: () => (lastAction.value = 'Theme toggled'),
      },
    ],
  },
]

// Render each command as a `type: 'custom'` option so no value is committed —
// a command bar runs actions rather than persisting a selection.
const options = commands.map((group) => ({
  group: group.group,
  options: group.items.map((command) => ({
    type: 'custom' as const,
    key: command.key,
    label: command.label,
    slots: {
      prefix: () => h(command.icon, { class: 'size-4 text-ink-gray-6' }),
      suffix: () => (command.keys ? shortcut(command.keys) : null),
    },
    onClick: command.action,
  })),
}))
</script>

<template>
  <div class="grid gap-3">
    <Combobox
      v-model="value"
      :options="options"
      placeholder="Type a command or search…"
      size="md"
      variant="outline"
      open-on-focus
      class="w-96"
    >
      <template #prefix>
        <LucideSearch class="size-4 text-ink-gray-4" />
      </template>
    </Combobox>

    <div class="text-sm text-ink-gray-5">
      {{ lastAction || 'Open the menu to see available commands' }}
    </div>
  </div>
</template>

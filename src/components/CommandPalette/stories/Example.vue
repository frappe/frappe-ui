<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  CommandPalette,
  CommandPaletteItem,
  KeyboardShortcut,
} from 'frappe-ui'

type CommandItem = {
  name: string
  title: string
  description?: string
  disabled?: boolean
}

type CommandGroup = {
  title: string
  component: typeof CommandPaletteItem
  items: CommandItem[]
  hideTitle?: boolean
}

const show = ref(false)
const searchQuery = ref('')
const lastSelected = ref('None')

const groups: CommandGroup[] = [
  {
    title: 'Navigation',
    component: CommandPaletteItem,
    items: [
      {
        name: 'dashboard',
        title: 'Go to dashboard',
        description: 'Navigation',
      },
      {
        name: 'calendar',
        title: 'Open calendar',
        description: 'Navigation',
      },
      {
        name: 'reports',
        title: 'View reports',
        description: 'Navigation',
      },
    ],
  },
  {
    title: 'Actions',
    component: CommandPaletteItem,
    items: [
      {
        name: 'task',
        title: 'Create task',
        description: 'Create',
      },
      {
        name: 'invite',
        title: 'Invite teammate',
        description: 'People',
      },
      {
        name: 'export',
        title: 'Export current view',
        description: 'Tools',
      },
    ],
  },
  {
    title: 'Settings',
    component: CommandPaletteItem,
    items: [
      {
        name: 'preferences',
        title: 'Open preferences',
        description: 'Settings',
      },
      {
        name: 'billing',
        title: 'Manage billing',
        description: 'Restricted',
        disabled: true,
      },
    ],
  },
]

function selectCommand(item: CommandItem) {
  lastSelected.value = item.title
}
</script>

<template>
  <div
    class="flex min-h-[280px] w-full max-w-[640px] flex-col gap-4 rounded-lg border border-outline-gray-1 bg-surface-base p-4 shadow-sm"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <div class="text-base-medium text-ink-gray-8">
          Workspace command menu
        </div>
        <div class="mt-1 text-p-sm text-ink-gray-5">
          Last selected: {{ lastSelected }}
        </div>
      </div>
      <Button variant="solid" @click="show = true">
        <template #prefix>
          <span class="lucide-search size-4" aria-hidden="true" />
        </template>
        Open
      </Button>
    </div>

    <div
      class="grid gap-2 rounded-md border border-outline-gray-1 bg-surface-gray-1 p-2"
    >
      <div
        v-for="group in groups"
        :key="group.title"
        class="rounded bg-surface-base px-3 py-2"
      >
        <div class="text-xs-medium uppercase text-ink-gray-5">
          {{ group.title }}
        </div>
        <div class="mt-1 flex flex-wrap gap-1.5">
          <span
            v-for="item in group.items"
            :key="item.name"
            class="inline-flex items-center rounded border border-outline-gray-1 px-2 py-1 text-p-sm"
            :class="item.disabled ? 'text-ink-gray-4' : 'text-ink-gray-7'"
          >
            {{ item.title }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 text-p-sm text-ink-gray-5">
      <KeyboardShortcut combo="Mod+K" bg />
      <span>opens the palette from anywhere in the app.</span>
    </div>

    <CommandPalette
      v-model:show="show"
      v-model:search-query="searchQuery"
      :groups="groups"
      @select="selectCommand"
    />
  </div>
</template>

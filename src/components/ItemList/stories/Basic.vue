<script setup lang="ts">
import { ItemList } from 'frappe-ui'
import LucideArchive from '~icons/lucide/archive'
import LucideCheck from '~icons/lucide/check'
import LucideFileText from '~icons/lucide/file-text'
import LucideMessageSquare from '~icons/lucide/message-square'
import LucideUsers from '~icons/lucide/users'

const groups = [
  {
    group: 'Recently viewed',
    items: [
      {
        label: 'Product kickoff notes',
        description: 'Updated 2h ago · Discussion',
        selected: true,
        icon: LucideMessageSquare,
      },
      {
        label: 'Hiring plan',
        description: 'Updated yesterday · Doc',
        icon: LucideFileText,
      },
    ],
  },
  {
    group: 'Actions',
    items: [
      {
        label: 'Invite teammates',
        description: 'Share access with your team',
        icon: LucideUsers,
      },
      {
        label: 'Archive workspace',
        description: 'Move this workspace out of the active list',
        icon: LucideArchive,
        disabled: true,
      },
    ],
  },
]

const items = [
  {
    label: 'Product kickoff notes',
    selected: true,
    icon: LucideMessageSquare,
  },
  {
    label: 'Hiring plan',
    icon: LucideFileText,
  },
  {
    label: 'Invite teammates',
    icon: LucideUsers,
  },
  {
    label: 'Archive workspace',
    icon: LucideArchive,
    disabled: true,
  },
]
</script>

<template>
  <div class="grid grid-cols-2 w-full gap-10">
    <div class="border border-dashed border-outline-gray-3 rounded-lg p-1.5">
      <ItemList :items="items">
        <template #item-prefix="{ item }">
          <component :is="item.icon" class="size-4 text-ink-gray-6" />
        </template>

        <template #item-suffix="{ item }">
          <LucideCheck v-if="item.selected" class="size-4 text-ink-gray-6" />
        </template>
      </ItemList>
    </div>

    <div class="border border-dashed border-outline-gray-3 rounded-lg p-1.5">
      <ItemList :groups="groups">
        <template #item-prefix="{ item }">
          <component :is="item.icon" class="size-4 text-ink-gray-6" />
        </template>

        <template #item-suffix="{ item }">
          <LucideCheck v-if="item.selected" class="size-4 text-ink-gray-6" />
        </template>
      </ItemList>
    </div>
  </div>
</template>

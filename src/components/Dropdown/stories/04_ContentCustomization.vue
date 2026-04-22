<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dropdown } from 'frappe-ui'
import LucideBell from '~icons/lucide/bell'
import LucideBuilding2 from '~icons/lucide/building-2'
import LucideCheck from '~icons/lucide/check'
import LucideCreditCard from '~icons/lucide/credit-card'
import LucideKanban from '~icons/lucide/kanban'
import LucideList from '~icons/lucide/list'
import LucideSearchX from '~icons/lucide/search-x'
import LucideSparkles from '~icons/lucide/sparkles'
import LucideTimeline from '~icons/lucide/activity'
import LucideTrash2 from '~icons/lucide/trash-2'
import LucideUserPlus from '~icons/lucide/user-plus'

const selectedView = ref('board')

const itemSlotOptions = computed(() => [
  {
    label: 'Board view',
    value: 'board',
    icon: LucideKanban,
    description: 'Great for tracking progress across columns.',
    selected: selectedView.value === 'board',
    onClick: () => {
      selectedView.value = 'board'
    },
  },
  {
    label: 'List view',
    value: 'list',
    icon: LucideList,
    description: 'Best when you need dense scanning and sorting.',
    selected: selectedView.value === 'list',
    onClick: () => {
      selectedView.value = 'list'
    },
  },
  {
    label: 'Timeline view',
    value: 'timeline',
    icon: LucideTimeline,
    description: 'Useful for roadmaps and date-driven planning.',
    selected: selectedView.value === 'timeline',
    onClick: () => {
      selectedView.value = 'timeline'
    },
  },
  {
    label: 'Coming soon',
    value: 'coming-soon',
    icon: LucideSparkles,
    description: 'Disabled item styling should still look consistent.',
    disabled: true,
  },
])

const namedSlotOptions = [
  {
    label: 'Acme Product',
    icon: LucideBuilding2,
    slot: 'workspace',
    description: 'Current workspace · 14 active members',
    onClick: () => console.log('Switch workspace clicked'),
  },
  {
    label: 'Invite people',
    icon: LucideUserPlus,
    onClick: () => console.log('Invite people clicked'),
  },
  {
    label: 'Notifications',
    icon: LucideBell,
    slot: 'notifications',
    description: '3 unread updates from your team',
    onClick: () => console.log('Notifications clicked'),
  },
  {
    label: 'Billing & plans',
    icon: LucideCreditCard,
    onClick: () => console.log('Billing clicked'),
  },
  {
    group: 'Danger zone',
    items: [
      {
        label: 'Delete workspace',
        icon: LucideTrash2,
        slot: 'danger',
        theme: 'red',
        description: 'Permanently remove this workspace and all of its data.',
        onClick: () => console.log('Delete workspace clicked'),
      },
    ],
  },
]

const emptyOptions = [
  {
    label: 'Admin only action',
    condition: () => false,
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-3 gap-10">
    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">Shared item slots</div>
      <Dropdown :options="itemSlotOptions">
        <template #item-label="{ item }">
          <div class="min-w-0">
            <div class="truncate">{{ item.label }}</div>
            <div class="truncate text-p-sm text-ink-gray-5">
              {{ item.description }}
            </div>
          </div>
        </template>

        <template #item-suffix="{ selected }">
          <LucideCheck v-if="selected" class="size-4 text-ink-gray-7" />
        </template>
      </Dropdown>
    </div>

    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">Named label slots</div>
      <Dropdown :options="namedSlotOptions">
        <template #item-workspace="{ item }">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <div class="truncate">{{ item.label }}</div>
              <span
                class="rounded bg-surface-gray-2 px-1.5 py-0.5 text-xs text-ink-gray-5"
              >
                Current
              </span>
            </div>
          </div>
        </template>

        <template #item-notifications="{ item }">
          <div class="min-w-0">
            <div class="truncate">{{ item.label }}</div>
          </div>
        </template>

        <template #item-danger="{ item }">
          <div class="min-w-0">
            <div class="truncate">{{ item.label }}</div>
          </div>
        </template>
      </Dropdown>
    </div>

    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">Empty state</div>
      <Dropdown :options="emptyOptions">
        <template #empty>
          <div
            class="m-1.5 flex w-64 flex-col items-center gap-2 rounded-lg bg-surface-gray-1 px-4 py-6 text-center"
          >
            <div
              class="flex size-9 items-center justify-center rounded-full bg-surface-gray-2"
            >
              <LucideSearchX class="size-4 text-ink-gray-5" />
            </div>
            <div class="text-base text-ink-gray-7">No available actions</div>
            <div class="text-p-sm text-ink-gray-5">
              This menu is empty for your current role and permissions.
            </div>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

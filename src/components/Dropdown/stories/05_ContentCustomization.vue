<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dropdown } from 'frappe-ui'
import LucideCheck from '~icons/lucide/check'
import LucideKanban from '~icons/lucide/kanban'
import LucideList from '~icons/lucide/list'
import LucideSearchX from '~icons/lucide/search-x'
import LucideSparkles from '~icons/lucide/sparkles'
import LucideTimeline from '~icons/lucide/activity'

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

const emptyOptions = [
  {
    label: 'Admin only action',
    condition: () => false,
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-10">
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

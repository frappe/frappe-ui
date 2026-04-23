<script setup lang="ts">
import { Avatar, ItemList } from 'frappe-ui'

const groups = [
  {
    group: 'Product',
    items: [
      {
        label: 'Faris',
        role: 'Writing the v1 release notes',
        tasks: 3,
        online: true,
      },
      {
        label: 'Aakvatech',
        role: 'Reviewing discussion flows',
        tasks: 5,
        online: false,
      },
    ],
  },
  {
    group: 'Design',
    items: [
      {
        label: 'Hadi',
        role: 'Polishing menu density and spacing',
        tasks: 2,
        online: true,
      },
      {
        label: 'Mariam',
        role: 'Preparing onboarding illustrations',
        tasks: 1,
        online: true,
      },
    ],
  },
]
</script>

<template>
  <div class="rounded-xl border border-outline-gray-2 bg-surface-modal p-1.5">
    <ItemList :groups="groups">
      <template #group-label="{ group }">
        {{ group.group }} · {{ group.items.length }} people
      </template>

      <template #item="{ item }">
        <div class="flex items-center gap-3 rounded px-2 py-1.5">
          <Avatar size="md" :label="item.label" />

          <div class="min-w-0 flex-1">
            <div class="truncate text-base text-ink-gray-8">
              {{ item.label }}
            </div>
            <div class="truncate text-p-sm text-ink-gray-5">
              {{ item.role }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="rounded-full bg-surface-gray-2 px-1.5 py-0.5 text-sm text-ink-gray-6"
            >
              {{ item.tasks }}
            </span>
          </div>
        </div>
      </template>
    </ItemList>
  </div>
</template>

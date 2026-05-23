<script setup>
import { Badge } from 'frappe-ui'

const leads = [
  {
    name: 'Acme Corp',
    owner: 'Jane Cooper',
    status: 'Qualified',
    theme: 'green',
    dotClass: 'bg-surface-green-5',
    value: '$24.5k',
  },
  {
    name: 'Globex',
    owner: 'Sammy Well',
    status: 'In Progress',
    theme: 'blue',
    dotClass: 'bg-surface-blue-5',
    value: '$18.2k',
  },
  {
    name: 'Initech',
    owner: 'Brian Robinson',
    status: 'On Hold',
    theme: 'amber',
    dotClass: 'bg-surface-amber-5',
    value: '$9.8k',
  },
  {
    name: 'Soylent',
    owner: 'Matt Clinton',
    status: 'Lost',
    theme: 'red',
    dotClass: 'bg-surface-red-5',
    value: '$4.1k',
  },
  {
    name: 'Umbrella',
    owner: 'Jane Cooper',
    status: 'New',
    theme: 'gray',
    dotClass: 'bg-surface-gray-5',
    value: '$12.0k',
  },
]
</script>

<template>
  <div
    class="w-full max-w-[640px] overflow-hidden rounded-lg border border-outline-gray-1 bg-surface-white shadow-sm"
  >
    <div class="flex items-center justify-between border-b border-outline-gray-1 px-3 py-2.5">
      <h3 class="m-0 text-base-medium text-ink-gray-8">Lead pipeline</h3>
      <Badge theme="gray" variant="outline">5 leads</Badge>
    </div>

    <div
      class="grid grid-cols-[minmax(0,1fr)_7.5rem_6.5rem_5rem] gap-3 border-b border-outline-gray-1 bg-surface-gray-1 px-3 py-1.5 text-sm font-medium text-ink-gray-5"
    >
      <span>Company</span>
      <span>Owner</span>
      <span>Status</span>
      <span>Value</span>
    </div>

    <div class="divide-y divide-outline-gray-1">
      <div
        v-for="lead in leads"
        :key="lead.name"
        class="grid grid-cols-[minmax(0,1fr)_7.5rem_6.5rem_5rem] items-center gap-3 px-3 py-2 transition-colors hover:bg-surface-gray-1"
      >
        <div class="flex min-w-0 items-center gap-2">
          <div
            class="flex size-6 shrink-0 items-center justify-center rounded bg-surface-gray-2 text-xs font-medium text-ink-gray-6"
          >
            {{ lead.name.slice(0, 1) }}
          </div>
          <span class="truncate text-sm text-ink-gray-8">{{ lead.name }}</span>
        </div>
        <span class="truncate text-sm text-ink-gray-6">{{ lead.owner }}</span>
        <Badge :theme="lead.theme" class="justify-self-start">
          <template #prefix>
            <span class="size-1 rounded-full" :class="lead.dotClass" />
          </template>
          {{ lead.status }}
        </Badge>
        <span class="text-sm font-medium text-ink-gray-7">{{ lead.value }}</span>
      </div>
    </div>
  </div>
</template>

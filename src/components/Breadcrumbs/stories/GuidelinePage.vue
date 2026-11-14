<script setup lang="ts">
// Page-scale Helpdesk shell shared by the Breadcrumbs guideline cards. It is
// not a story of its own: Guidelines.vue renders it inside a `bleed` card,
// which crops it like a screenshot. `#header` holds the trail, `#overlay`
// anything floating over the page, like an open menu.
import { Checkbox, TextInput } from 'frappe-ui'

const rail = [
  'lucide-search',
  'lucide-bell',
  'lucide-ticket',
  'lucide-layout-grid',
  'lucide-book-open',
  'lucide-bar-chart-3',
  'lucide-user',
]

const tickets = [
  {
    id: '#06070',
    title: 'Update website content for new products',
    status: 'New',
    dot: 'bg-surface-amber-6',
  },
  {
    id: '#06071',
    title: 'Design logo variations for client review',
    status: 'In progress',
    dot: 'bg-surface-amber-6',
  },
  {
    id: '#06072',
    title: 'Fix login authentication bug',
    status: 'Queued',
    dot: 'bg-surface-violet-6',
  },
  {
    id: '#06073',
    title: 'Prepare quarterly financial report',
    status: 'Resolved',
    dot: 'bg-surface-green-6',
  },
  {
    id: '#06074',
    title: 'Schedule team-building activities',
    status: 'New',
    dot: 'bg-surface-amber-6',
  },
]

const rowGrid = 'grid grid-cols-[20px_88px_1fr_120px] items-center gap-4 px-2'
</script>

<template>
  <div class="flex h-[420px] w-[760px]">
    <!-- app rail -->
    <div
      class="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-outline-gray-2 bg-surface-gray-1 py-3"
    >
      <span
        class="mb-3 grid size-9 place-items-center rounded-5 bg-surface-violet-7"
      >
        <span class="lucide-ticket size-5 text-white" aria-hidden="true" />
      </span>
      <span
        v-for="icon in rail"
        :key="icon"
        class="grid size-9 place-items-center rounded-5"
        :class="
          icon === 'lucide-layout-grid' ? 'bg-surface-base shadow-sm' : ''
        "
      >
        <span :class="[icon, 'size-5 text-ink-gray-7']" aria-hidden="true" />
      </span>
    </div>

    <!-- page -->
    <div class="relative flex min-w-0 flex-1 flex-col">
      <div
        class="flex h-14 shrink-0 items-center border-b border-outline-gray-2 px-4"
      >
        <slot name="header" />
      </div>
      <div class="flex flex-col gap-4 p-5">
        <TextInput class="w-80" placeholder="Try “first due” or ticket type">
          <template #prefix>
            <span
              class="lucide-sparkles size-4 text-ink-gray-5"
              aria-hidden="true"
            />
          </template>
        </TextInput>
        <div class="flex flex-col">
          <div :class="[rowGrid, 'h-9 text-base text-ink-gray-5']">
            <Checkbox />
            <span>ID</span>
            <span>Ticket</span>
            <span>Status</span>
          </div>
          <div
            v-for="t in tickets"
            :key="t.id"
            :class="[
              rowGrid,
              'h-11 border-t border-outline-gray-1 text-base text-ink-gray-8',
            ]"
          >
            <Checkbox />
            <span>{{ t.id }}</span>
            <span class="truncate">{{ t.title }}</span>
            <span class="flex items-center gap-2">
              <span class="size-2 rounded-full" :class="t.dot" />
              {{ t.status }}
            </span>
          </div>
        </div>
      </div>
      <slot name="overlay" />
    </div>
  </div>
</template>

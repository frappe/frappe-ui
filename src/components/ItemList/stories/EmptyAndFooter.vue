<script setup lang="ts">
import { ItemList } from 'frappe-ui'
import LucidePlus from '~icons/lucide/plus'
import LucideSearch from '~icons/lucide/search'

const recentDrafts = [
  {
    label: 'Launch checklist',
    description: 'Edited 12 minutes ago',
  },
  {
    label: 'Hiring feedback summary',
    description: 'Edited yesterday',
  },
  {
    label: 'Customer interview notes',
    description: 'Edited 3 days ago',
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-10">
    <div
      class="w-[320px] rounded-xl border border-outline-gray-2 bg-surface-modal p-1.5"
    >
      <div
        class="px-2 h-7 text-sm font-medium text-ink-gray-7 flex items-center"
      >
        Empty state
      </div>

      <ItemList :items="[]">
        <template #empty>
          <div class="flex flex-col items-center px-4 py-8 text-center">
            <div
              class="flex size-8 items-center justify-center rounded-full bg-surface-gray-2"
            >
              <LucideSearch class="size-4 text-ink-gray-5" />
            </div>
            <div class="mt-3 text-base text-ink-gray-7">
              No matching discussions
            </div>
            <div class="mt-1 text-p-sm text-ink-gray-5">
              Try a broader keyword or clear the filters.
            </div>
          </div>
        </template>
      </ItemList>
    </div>

    <div
      class="w-[320px] rounded-xl border border-outline-gray-2 bg-surface-modal"
    >
      <div class="p-1.5 pb-0">
        <div
          class="px-2 h-7 text-sm font-medium text-ink-gray-7 flex items-center"
        >
          Footer action
        </div>
      </div>

      <ItemList
        :items="recentDrafts"
        class="[&>[data-slot='group']]:px-1.5 [&>[data-slot='group']]:pb-1.5 [&>[data-slot='footer']]:border-t [&>[data-slot='footer']]:border-outline-gray-2 [&>[data-slot='footer']]:p-1.5"
      >
        <template #footer>
          <button
            class="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-base text-ink-gray-7 transition-colors hover:bg-surface-gray-2 active:bg-surface-gray-3"
            type="button"
          >
            <span>Create new draft</span>
            <LucidePlus class="size-4 text-ink-gray-5" />
          </button>
        </template>
      </ItemList>
    </div>
  </div>
</template>

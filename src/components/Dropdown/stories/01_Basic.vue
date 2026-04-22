<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Dropdown } from 'frappe-ui'
import LucideCheck from '~icons/lucide/check'
import LucideChevronDown from '~icons/lucide/chevron-down'

const selectedView = ref('board')

const actionOptions = [
  { label: 'Edit', icon: 'edit', onClick: () => console.log('Edit clicked') },
  {
    label: 'Duplicate',
    icon: 'copy',
    onClick: () => console.log('Duplicate clicked'),
  },
  {
    label: 'Delete',
    icon: 'trash-2',
    theme: 'red',
    onClick: () => console.log('Delete clicked'),
  },
]

const viewOptions = computed(() => [
  {
    label: 'Board',
    value: 'board',
    selected: selectedView.value === 'board',
    onClick: () => {
      selectedView.value = 'board'
    },
  },
  {
    label: 'List',
    value: 'list',
    selected: selectedView.value === 'list',
    onClick: () => {
      selectedView.value = 'list'
    },
  },
  {
    label: 'Timeline',
    value: 'timeline',
    selected: selectedView.value === 'timeline',
    onClick: () => {
      selectedView.value = 'timeline'
    },
  },
])
</script>

<template>
  <div class="grid grid-cols-2 w-full gap-10">
    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">Simple actions</div>
      <Dropdown :options="actionOptions" />
    </div>

    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">
        Selected menu item
      </div>
      <Dropdown :options="viewOptions">
        <template #default="{ open }">
          <Button>
            {{
              viewOptions.find((o) => o.value === selectedView)?.label ??
              'Select view'
            }}
            <template #suffix>
              <LucideChevronDown
                :class="open ? 'rotate-180' : ''"
                class="size-4 text-ink-gray-6"
              />
            </template>
          </Button>
        </template>
        <template #item-suffix="{ selected }">
          <LucideCheck v-if="selected" class="size-4 text-ink-gray-7" />
        </template>
      </Dropdown>
      <div class="text-sm text-ink-gray-5">Active view: {{ selectedView }}</div>
    </div>
  </div>
</template>

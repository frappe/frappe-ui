<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, ItemList } from 'frappe-ui'
import LucideCheck from '~icons/lucide/check'
import LucidePlus from '~icons/lucide/plus'

const activeProject = ref('gameplan')

const items = computed(() => [
  {
    label: 'Gameplan',
    value: 'gameplan',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=80&h=80&fit=crop',
    description: '12 people · Product planning',
    count: 8,
    selected: activeProject.value === 'gameplan',
  },
  {
    label: 'Brand refresh',
    value: 'brand-refresh',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop',
    description: '5 people · Marketing',
    count: 3,
    selected: activeProject.value === 'brand-refresh',
  },
  {
    label: 'Create new project',
    value: 'create',
    slot: 'create',
  },
])

function handleItemClick(item: { value?: string | number | boolean }) {
  if (item.value === 'create') {
    console.log('Create new project clicked')
    return
  }

  if (typeof item.value === 'string') {
    activeProject.value = item.value
  }
}
</script>

<template>
  <div
    class="flex w-[320px] flex-col gap-3 rounded-lg border border-outline-gray-2 bg-surface-modal p-2"
  >
    <ItemList :items="items" @item-click="handleItemClick">
      <template #item-prefix="{ item }">
        <Avatar v-if="item.image" size="sm" :image="item.image" />
      </template>

      <template #item-label="{ item }">
        <div class="min-w-0">
          <div class="truncate">{{ item.label }}</div>
          <div
            v-if="item.description"
            class="truncate text-p-sm text-ink-gray-5"
          >
            {{ item.description }}
          </div>
        </div>
      </template>

      <template #item-suffix="{ item }">
        <span
          v-if="item.count"
          class="rounded bg-surface-gray-2 px-1.5 py-0.5 text-sm text-ink-gray-6"
        >
          {{ item.count }}
        </span>
        <LucideCheck v-else-if="item.selected" class="size-4 text-ink-gray-6" />
      </template>

      <template #item-create>
        <div class="flex items-center gap-2 text-ink-gray-6">
          <div class="w-5 flex items-center justify-center">
            <LucidePlus class="size-4" />
          </div>
          <span>Create new project</span>
        </div>
      </template>
    </ItemList>
  </div>
  <div class="text-sm text-ink-gray-5">
    Active project: <span class="text-ink-gray-8">{{ activeProject }}</span>
  </div>
</template>

<script setup lang="ts">
import type { CommandPaletteItem } from './CommandPalette.vue'

withDefaults(
  defineProps<{
    item: CommandPaletteItem
    active?: boolean
  }>(),
  {
    active: false,
  },
)
</script>

<template>
  <div
    class="flex w-full min-w-0 items-center rounded px-2 py-2 text-base-medium text-ink-gray-8"
    :class="{ 'bg-surface-gray-2': active }"
  >
    <span
      v-if="typeof item.icon === 'string'"
      :class="[item.icon, 'mr-3 h-4 w-4 shrink-0 text-ink-gray-7']"
      aria-hidden="true"
    />
    <component
      v-else-if="item.icon"
      :is="item.icon"
      class="mr-3 h-4 w-4 text-ink-gray-7"
    />
    <span class="overflow-hidden text-ellipsis whitespace-nowrap">
      {{ item.title }}
    </span>
    <span
      v-if="item.description"
      class="ml-auto whitespace-nowrap pl-2 text-ink-gray-5"
    >
      {{ item.suffix || item.description }}
    </span>
  </div>
</template>

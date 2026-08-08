<template>
  <div
    class="flex w-full min-w-0 items-center rounded px-2 py-2 text-base-medium text-ink-gray-8"
    :class="{ 'bg-surface-gray-2': active }"
  >
    <OptionIcon v-if="item.icon" :icon="item.icon" class="mr-3" />
    <span class="overflow-hidden text-ellipsis whitespace-nowrap">
      {{ item.title }}
    </span>
    <span
      v-if="item.description"
      class="ml-auto whitespace-nowrap pl-2 text-ink-gray-5"
    >
      {{ item.description }}
    </span>
  </div>
</template>

<script setup lang="ts">
import OptionIcon from '../shared/selection/OptionIcon.vue'
import type { CommandPaletteItemData } from './types'

defineOptions({ name: 'CommandPaletteItem' })

defineProps<{
  /** The item to render. */
  item: CommandPaletteItemData
  /** Whether this item is the currently highlighted (keyboard/hover) option. */
  active?: boolean
}>()
</script>

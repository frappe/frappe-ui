<template>
  <button
    type="button"
    :class="[
      'flex w-full items-center whitespace-nowrap rounded-md px-2 py-1.5 text-sm text-ink-gray-9',
      selected ? 'bg-surface-gray-2' : '',
      itemClass,
    ]"
    @click="$emit('select')"
    @mouseover="$emit('hover')"
  >
    <slot :item="item">
      <span>{{ fallbackLabel }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { BaseSuggestionItem } from '#molecules/editor/extensions/shared/suggestion-types'

const props = defineProps({
  item: {
    type: Object as PropType<BaseSuggestionItem>,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  itemClass: {
    type: String,
    default: '',
  },
})

defineEmits<{
  (e: 'select'): void
  (e: 'hover'): void
}>()

const fallbackLabel = computed(() => {
  const item = props.item
  return item.display ?? item.title ?? item.name ?? ''
})
</script>

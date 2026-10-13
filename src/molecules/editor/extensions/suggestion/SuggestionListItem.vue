<template>
  <button
    type="button"
    data-slot="item"
    :data-highlighted="selected ? '' : undefined"
    :class="[
      'flex min-h-7 w-full items-center gap-2 whitespace-nowrap rounded-4 px-2 py-1.5 text-base leading-tighter text-ink-gray-7',
      selected ? 'bg-surface-alpha-gray-2' : '',
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
  return item.display ?? item.label ?? item.title ?? item.name ?? ''
})
</script>

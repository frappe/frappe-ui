<template>
  <div data-slot="list" :role="hasHeader ? 'table' : 'list'" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { provideListContext } from './list-context'
import type { ListProps } from './types'

const props = defineProps<ListProps>()

const selection = defineModel<string[]>('selection', { default: () => [] })

const hasHeader = ref(false)

const style = computed(() => ({
  ...(props.columns ? { '--list-columns-default': props.columns.join(' ') } : {}),
  ...(props.selectable ? { '--list-checkbox-width': '32px' } : {}),
  ...(props.rowHeight ? { '--list-row-height': `${props.rowHeight}px` } : {}),
}))

function isSelected(value: string) {
  return selection.value.includes(value)
}

function toggleSelection(value: string) {
  selection.value = isSelected(value)
    ? selection.value.filter((selected) => selected !== value)
    : [...selection.value, value]
}

provideListContext({
  divider: computed(() => props.divider ?? (props.columns ? 'full' : 'inset')),
  selectable: computed(() => !!props.selectable),
  rowHeight: computed(() => props.rowHeight),
  hasHeader,
  isSelected,
  toggleSelection,
})
</script>

<template>
  <div data-slot="list" :role="hasHeader ? 'table' : 'list'" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue'
import { provideListContext } from './list-context'
import type { ListProps } from './types'

const props = defineProps<ListProps>()

const selection = defineModel<string[]>('selection', { default: () => [] })
// Single active row. Unlike `selection` there's no explicit mode flag: binding
// v-model:active is the opt-in, detected via the update listener below so a
// highlight never appears on a list that doesn't track one.
const active = defineModel<string | undefined>('active')

const instance = getCurrentInstance()
const activatable = computed(
  () => 'onUpdate:active' in (instance?.vnode.props ?? {}),
)

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

function isActive(value: string) {
  return active.value === value
}

function activate(value: string) {
  active.value = value
}

// The full set of selectable row values, fed by <ListRows>. Drives the header
// select-all without depending on which rows are currently mounted.
const allValues = ref<string[]>([])
function setAllValues(values: string[]) {
  allValues.value = values
}

const selectAllState = computed<'none' | 'some' | 'all'>(() => {
  const universe = allValues.value
  if (!universe.length) return 'none'
  const selectedCount = universe.filter((value) =>
    selection.value.includes(value),
  ).length
  if (selectedCount === 0) return 'none'
  return selectedCount === universe.length ? 'all' : 'some'
})

function toggleSelectAll() {
  if (selectAllState.value === 'all') {
    // Clear only the current universe; preserve any selected values outside it
    // (e.g. carried over from a previous filter or page).
    const universe = new Set(allValues.value)
    selection.value = selection.value.filter((value) => !universe.has(value))
  } else {
    selection.value = [...new Set([...selection.value, ...allValues.value])]
  }
}

provideListContext({
  divider: computed(() => props.divider ?? (props.columns ? 'full' : 'inset')),
  selectable: computed(() => !!props.selectable),
  rowHeight: computed(() => props.rowHeight),
  hasHeader,
  isSelected,
  toggleSelection,
  activatable,
  isActive,
  activate,
  setAllValues,
  selectAllState,
  toggleSelectAll,
})
</script>

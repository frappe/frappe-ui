<template>
  <div class="relative flex w-full h-full flex-1 flex-col overflow-x-auto">
    <div
      class="flex w-max min-w-full h-full flex-col overflow-y-hidden"
      :class="attrClass"
      :style="attrStyle"
    >
      <slot v-bind="{ showGroupedRows, selectable }">
        <ListHeader />
        <template v-if="props.rows.length">
          <ListGroups v-if="showGroupedRows" />
          <ListRows v-else />
        </template>
        <ListEmptyState v-else />
        <ListSelectBanner v-if="selectable" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  provide,
  reactive,
  ref,
  useAttrs,
  useSlots,
  watch,
  withDefaults,
} from 'vue'
import ListEmptyState from './ListEmptyState.vue'
import ListGroups from './ListGroups.vue'
import ListHeader from './ListHeader.vue'
import ListRows from './ListRows.vue'
import ListSelectBanner from './ListSelectBanner.vue'
import {
  type Row,
  type ListViewEmits,
  type ListViewOptions,
  type ListViewProps,
} from './types'

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<ListViewEmits>()
const props = withDefaults(defineProps<ListViewProps>(), {
  id: 'list-view',
  columns: () => [],
  rows: () => [],
  options: () => ({}),
})

const slots = useSlots()
const attrs = useAttrs()
const attrClass = computed(() => attrs.class as string)
const attrStyle = computed(() => attrs.style as string)

let selections = reactive(new Set<string>())
let activeRow = ref<string>('')

watch(selections, (value) => {
  if (selections.size) {
    activeRow.value = ''
  }
  emit('update:selections', value)
})

watch(activeRow, (value) => {
  emit('update:active-row', value)
})

let _options = computed((): ListViewOptions => {
  function defaultTrue(value: boolean | undefined): boolean {
    return value === undefined ? true : value
  }

  function defaultFalse(value: boolean | undefined): boolean {
    return value === undefined ? false : value
  }

  return {
    getRowRoute: props.options?.getRowRoute || undefined,
    onRowClick: props.options?.onRowClick || undefined,
    showTooltip: defaultTrue(props.options?.showTooltip),
    selectionText:
      props.options?.selectionText ||
      ((count: number) =>
        count === 1 ? '1 row selected' : `${count} rows selected`),
    enableActive: defaultFalse(props.options?.enableActive),
    selectable: defaultTrue(props.options?.selectable),
    resizeColumn: defaultFalse(props.options?.resizeColumn),
    rowHeight: props.options?.rowHeight || 40,
    emptyState: props.options?.emptyState || {
      title: 'No Data',
      description: 'No data available',
    },
  }
})

const allRowsSelected = computed(() => {
  if (!props.rows.length) return false
  if (showGroupedRows.value) {
    return (
      selections.size ===
      props.rows.reduce((acc, row) => acc + row.rows.length, 0)
    )
  }
  return selections.size === props.rows.length
})

const selectable = computed(() => {
  return _options.value.selectable
})

let showGroupedRows = computed(() => {
  return props.rows.every(
    (row) => row.group && row.rows && Array.isArray(row.rows),
  )
})

function toggleRow(row_id: string) {
  if (!selections.delete(row_id)) {
    selections.add(row_id)
  }
}

function toggleAllRows(select?: boolean) {
  if (!select || allRowsSelected.value) {
    selections.clear()
    return
  }
  if (showGroupedRows.value) {
    props.rows.forEach((row: Row) => {
      row.rows.forEach((r: Row) => selections.add(r[props.rowKey]))
    })
    return
  }
  props.rows.forEach((row: Row) => selections.add(row[props.rowKey]))
}

const listContext = computed(() => ({
  id: props.id || 'list-view',
  rowKey: props.rowKey,
  rows: props.rows,
  columns: props.columns,
  options: _options.value,
  selections: selections,
  activeRow: activeRow,
  allRowsSelected: allRowsSelected.value,
  slots: slots,
  toggleRow,
  toggleAllRows,
}))

provide('list', listContext)

defineExpose({
  selections,
  allRowsSelected,
  toggleRow,
  toggleAllRows,
})
</script>

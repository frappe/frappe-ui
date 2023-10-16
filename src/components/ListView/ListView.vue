<template>
  <div class="relative flex w-full flex-1 flex-col overflow-x-auto">
    <div
      class="flex w-max min-w-full flex-col overflow-y-hidden"
      :class="$attrs.class"
    >
      <slot>
        <ListHeader />
        <ListRows />
        <ListSelectBanner />
      </slot>
    </div>
  </div>
</template>
<script setup>
import ListHeader from './ListHeader.vue'
import ListRows from './ListRows.vue'
import ListSelectBanner from './ListSelectBanner.vue'
import { reactive, computed, provide } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  columns: {
    type: Array,
    default: [],
  },
  rows: {
    type: Array,
    default: [],
  },
  rowKey: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    default: {
      getRowRoute: {
        type: Function,
        default: null,
      },
      onRowClick: {
        type: Function,
        default: null,
      },
    },
  },
})

let selections = reactive(new Set())

const allRowsSelected = computed(() => {
  if (!props.rows.length) return false
  return selections.size === props.rows.length
})

function toggleRow(row) {
  if (!selections.delete(row)) {
    selections.add(row)
  }
}

function toggleAllRows(select) {
  if (!select || allRowsSelected.value) {
    selections.clear()
    return
  }
  props.rows.forEach((row) => selections.add(row[props.rowKey]))
}

provide('list', {
  rowKey: props.rowKey,
  rows: props.rows,
  columns: props.columns,
  options: props.options,
  selections,
  allRowsSelected,
  toggleRow,
  toggleAllRows,
})
</script>

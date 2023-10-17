<template>
  <div class="relative flex w-full flex-1 flex-col overflow-x-auto">
    <div
      class="flex w-max min-w-full flex-col overflow-y-hidden"
      :class="$attrs.class"
    >
      <slot>
        <ListHeader />
        <ListRows />
        <ListSelectBanner v-if="_options.selectable" />
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
      getRowRoute: null,
      onRowClick: null,
      showTooltip: true,
      selectable: true,
    },
  },
})

let selections = reactive(new Set())

let _options = computed(() => {
  function defaultTrue(value) {
    return value === undefined ? true : value
  }

  return {
    getRowRoute: props.options.getRowRoute || null,
    onRowClick: props.options.onRowClick || null,
    showTooltip: defaultTrue(props.options.showTooltip),
    selectable: defaultTrue(props.options.selectable),
  }
})

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

provide(
  'list',
  computed(() => ({
    rowKey: props.rowKey,
    rows: props.rows,
    columns: props.columns,
    options: _options.value,
    selections: selections,
    allRowsSelected: allRowsSelected.value,
    toggleRow,
    toggleAllRows,
  }))
)
</script>

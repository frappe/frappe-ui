<template>
  <component
    :is="list.options.getRowRoute ? 'router-link' : 'div'"
    class="flex cursor-pointer flex-col transition-all duration-300 ease-in-out"
    v-bind="
      list.options.getRowRoute
        ? { to: list.options.getRowRoute(row) }
        : { onClick: () => list.options.onRowClick(row) }
    "
  >
    <component
      :is="list.options.getRowRoute ? 'template' : 'button'"
      class="[all:unset] hover:[all:unset]"
    >
      <div
        class="grid items-center space-x-4 rounded px-2 py-2.5"
        :class="
          list.selections.has(row[list.rowKey])
            ? 'bg-gray-100 hover:bg-gray-200'
            : 'hover:bg-gray-50'
        "
        :style="{
          gridTemplateColumns: getGridTemplateColumns(
            list.columns,
            list.options.selectable
          ),
        }"
      >
        <Checkbox
          v-if="list.options.selectable"
          :modelValue="list.selections.has(row[list.rowKey])"
          @click.stop="list.toggleRow(row[list.rowKey])"
          class="cursor-pointer duration-300"
        />
        <div
          v-for="column in list.columns"
          :key="column.key"
          :class="alignmentMap[column.align]"
        >
          <slot v-bind="{ column, item: row[column.key] }">
            <ListRowItem :item="row[column.key]" :align="column.align" />
          </slot>
        </div>
      </div>
      <div v-if="!isLastRow" class="mx-2 h-px border-t border-gray-200" />
    </component>
  </component>
</template>

<script setup>
import Checkbox from '../Checkbox.vue'
import ListRowItem from './ListRowItem.vue'
import { alignmentMap, getGridTemplateColumns } from './utils'
import { computed, inject } from 'vue'

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
})

const list = inject('list')

const isLastRow = computed(() => {
  if (!list.value.rows?.length) return false
  return (
    list.value.rows[list.value.rows.length - 1][list.value.rowKey] ===
    props.row[list.value.rowKey]
  )
})
</script>

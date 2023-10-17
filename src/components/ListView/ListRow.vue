<template>
  <component
    :is="options.getRowRoute ? 'router-link' : 'div'"
    class="flex cursor-pointer flex-col transition-all duration-300 ease-in-out"
    v-bind="
      options.getRowRoute
        ? { to: options.getRowRoute(row) }
        : { onClick: () => options.onRowClick(row) }
    "
  >
    <component
      :is="options.getRowRoute ? 'template' : 'button'"
      class="[all:unset] hover:[all:unset]"
    >
      <div
        class="grid items-center space-x-4 rounded px-2 py-2.5"
        :class="
          selections.has(row[rowKey])
            ? 'bg-gray-100 hover:bg-gray-200'
            : 'hover:bg-gray-50'
        "
        :style="{
          gridTemplateColumns: getGridTemplateColumns(
            columns,
            options.selectable
          ),
        }"
      >
        <Checkbox
          v-if="options.selectable"
          :modelValue="selections.has(row[rowKey])"
          @click.stop="toggleRow(row[rowKey])"
          class="cursor-pointer duration-300"
        />
        <div
          v-for="column in columns"
          :key="column.key"
          :class="alignmentMap[column.align]"
        >
          <slot v-bind="{ column, item: row[column.key] }">
            <ListRowItem
              :item="row[column.key]"
              :type="column.type"
              :align="column.align"
            />
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

const isLastRow = computed(() => {
  return rows[rows.length - 1][rowKey] === props.row[rowKey]
})

const { rows, columns, rowKey, options, selections, toggleRow } = inject('list')
</script>

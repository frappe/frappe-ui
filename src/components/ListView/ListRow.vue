<template>
  <component
    :is="row.route ? 'router-link' : 'div'"
    class="mx-5 flex cursor-pointer flex-col transition-all duration-300 ease-in-out"
    v-bind="row.route ? { to: row.route } : { onClick: row.onClick }"
  >
    <component
      :is="row.route ? 'template' : 'button'"
      class="[all:unset] hover:[all:unset]"
    >
      <div
        class="flex items-center space-x-4 rounded px-2 py-2.5"
        :class="
          selections.has(row[rowKey])
            ? 'bg-gray-100 hover:bg-gray-200'
            : 'hover:bg-gray-50'
        "
      >
        <Checkbox
          :modelValue="selections.has(row[rowKey])"
          @click.stop="toggleRow(row[rowKey])"
          class="cursor-pointer duration-300"
        />
        <div
          v-for="column in columns"
          :key="column.key"
          :class="[
            customWidth(column.size) ? '' : getWidth(column.size),
            column.align,
          ]"
          :style="customWidth(column.size) ? { width: column.size } : ''"
        >
          <slot v-bind="{ column, item: _row(row)[column.key] }">
            <ListRowItem
              :item="_row(row)[column.key]"
              :type="column.type"
              :align="column.align"
            />
          </slot>
        </div>
      </div>
      <div
        v-if="idx < rows.length - 1"
        class="mx-2 h-px border-t border-gray-200"
      />
    </component>
  </component>
</template>

<script setup>
import Checkbox from '../Checkbox.vue'
import ListRowItem from './ListRowItem.vue'
import { getWidth, customWidth } from './utils'
import { inject } from 'vue'

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
  idx: {
    type: Number,
    required: true,
  },
})

function _row(row) {
  if (row.row && typeof row.row === 'object' && (row.onClick || row.route)) {
    return row.row
  }
  return row
}

const { rows, columns, rowKey, selections, toggleRow } = inject('list')
</script>

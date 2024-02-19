<template>
  <div
    class="mb-2 grid items-center space-x-4 rounded bg-gray-100 p-2"
    :style="{ gridTemplateColumns: columnsWidths }"
  >
    <Checkbox
      v-if="list.options.selectable"
      class="cursor-pointer duration-300"
      :modelValue="list.allRowsSelected"
      @click.stop="list.toggleAllRows"
    />
    <slot>
      <ListHeaderItem
        v-for="column in list.columns"
        :key="column.key"
        :item="column"
        @updateWidth="(w) => (column.width = w)"
      />
    </slot>
  </div>
</template>

<script setup>
import Checkbox from '../Checkbox.vue'
import ListHeaderItem from './ListHeaderItem.vue'
import { inject, computed } from 'vue'

const list = inject('list')

const columnsWidths = computed(() => {
  let checkBoxWidth = list.value.options.selectable ? '14px ' : ''
  let columnsWidth = list.value.columns
    .map((col) => {
      let width = col.width || 1
      if (typeof width === 'number') {
        return width + 'fr'
      }
      return width
    })
    .join(' ')
  return checkBoxWidth + columnsWidth
})
</script>

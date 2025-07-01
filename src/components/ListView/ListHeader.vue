<template>
  <div
    v-if="list"
    class="mb-2 grid items-center space-x-4 rounded bg-surface-gray-2 p-2"
    :style="{
      gridTemplateColumns: getGridTemplateColumns(
        list.columns,
        list.options.selectable,
      ),
    }"
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
        @columnWidthUpdated="emit('columnWidthUpdated', column)"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, inject } from 'vue'
import Checkbox from '../Checkbox/Checkbox.vue'
import ListHeaderItem from './ListHeaderItem.vue'
import type { ListColumn, ListContext } from './types'
import { getGridTemplateColumns } from './utils'

interface ListHeaderEmits {
  (event: 'columnWidthUpdated', column: ListColumn): void
}

const emit = defineEmits<ListHeaderEmits>()

const list = inject<ComputedRef<ListContext>>('list')
</script>

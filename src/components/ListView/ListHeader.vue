<template>
  <div
    class="mb-2 grid items-center space-x-4 rounded bg-gray-100 p-2"
    :style="{
      gridTemplateColumns: getGridTemplateColumns(
        list.columns,
        list.options.selectable
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
      />
    </slot>
  </div>
</template>

<script setup>
import Checkbox from '../Checkbox.vue'
import ListHeaderItem from './ListHeaderItem.vue'
import { getGridTemplateColumns } from './utils'
import { inject } from 'vue'

const list = inject('list')
</script>

<template>
  <div
    class="mx-5 mb-2 grid items-center space-x-4 rounded bg-gray-100 p-2"
    :style="{ gridTemplateColumns: getGridTemplateColumns(columns) }"
  >
    <Checkbox
      class="cursor-pointer duration-300"
      :modelValue="allRowsSelected"
      @click.stop="toggleAllRows"
    />
    <div
      v-for="column in columns"
      :key="column"
      class="flex items-center space-x-2 text-base text-gray-600"
      :class="alignmentMap[column.align]"
    >
      <slot name="prefix" v-bind="{ column }" />
      <div>
        {{ column.label }}
      </div>
      <slot name="suffix" v-bind="{ column }" />
    </div>
  </div>
</template>

<script setup>
import Checkbox from '../Checkbox.vue'
import { alignmentMap, getGridTemplateColumns } from './utils'
import { inject } from 'vue'

const { columns, allRowsSelected, toggleAllRows } = inject('list')
</script>

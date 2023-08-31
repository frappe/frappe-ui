<script setup>
import { inject } from 'vue'
import Checkbox from '../Checkbox.vue'

const list = inject('list')
const props = defineProps({
  as: { type: String, default: 'div' },
  row: { type: Object, default: () => ({}), required: true },
})
</script>

<template>
  <component
    :is="as"
    class="mx-2 flex cursor-pointer items-center space-x-4 border-b py-2 transition-all duration-300 ease-in-out"
    :class="
      list.selections.has(row.name)
        ? 'bg-gray-100 hover:bg-gray-200'
        : 'hover:bg-gray-50'
    "
  >
    <Checkbox
      :modelValue="list.selections.has(row.name)"
      @click.stop="list.toggleSelection(row.name)"
      class="cursor-pointer duration-300"
    />
    <slot></slot>
  </component>
</template>

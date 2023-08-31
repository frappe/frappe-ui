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
    class="flex space-x-4 items-center mx-2 py-2 border-b cursor-pointer transition-all duration-300 ease-in-out"
    :class="
      list.selections.has(row.name)
        ? 'bg-gray-100 hover:bg-gray-200'
        : 'hover:bg-gray-50'
    "
  >
    <Checkbox
      :modelValue="list.selections.has(row.name)"
      @click.stop="list.toggleSelection(row.name)"
      class="duration-300 cursor-pointer"
    />
    <slot></slot>
  </component>
</template>

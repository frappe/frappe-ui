<template>
  <div
    class="flex items-center space-x-2 text-base text-gray-600"
    :class="alignmentMap[column.align]"
  >
    <slot name="prefix" v-bind="{ column }" />
    <div>
      {{ column.label }}
    </div>
    <slot name="suffix" v-bind="{ column }" />
  </div>
</template>

<script setup>
import { alignmentMap } from './utils'
const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
})
</script>

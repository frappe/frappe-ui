<template>
  <div
    class="flex items-center space-x-2 text-base text-gray-600"
    :class="alignmentMap[item.align]"
  >
    <slot name="prefix" v-bind="{ item }" />
    <div>
      {{ item.label }}
    </div>
    <slot name="suffix" v-bind="{ item }" />
  </div>
</template>

<script setup>
import { alignmentMap } from './utils'
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

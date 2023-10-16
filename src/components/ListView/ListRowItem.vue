<template>
  <Tooltip
    :text="label"
    class="flex items-center space-x-2"
    :class="alignmentMap[align]"
  >
    <slot name="prefix" />
    <slot v-bind="{ label }">
      <div class="truncate text-base">
        {{ label }}
      </div>
    </slot>
    <slot name="suffix" />
  </Tooltip>
</template>
<script setup>
import { alignmentMap } from './utils'
import Tooltip from '../Tooltip.vue'
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: [String, Number, Object],
    default: '',
  },
  align: {
    type: String,
    default: 'left',
  },
})

const label = computed(() => {
  return getValue(props.item).label || ''
})

function getValue(value) {
  if (value && typeof value === 'object') {
    return value
  }
  return { label: value }
}
</script>

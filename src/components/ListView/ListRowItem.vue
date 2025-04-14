<template>
  <div class="flex items-center space-x-2" :class="alignmentMap[align]">
    <slot name="prefix">
      <component
        v-if="column.prefix"
        :is="
          typeof column.prefix === 'function'
            ? column.prefix({ row })
            : column.prefix
        "
      />
    </slot>
    <component
      :is="list.options.showTooltip ? Tooltip : 'div'"
      v-bind="list.options.showTooltip ? { text: label } : {}"
    >
      <slot v-bind="{ label }">
        <div class="truncate text-base">
          {{ column?.getLabel ? column.getLabel({ row }) : label }}
        </div>
      </slot>
    </component>
    <slot name="suffix" />
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import { Tooltip } from '../../index'
import { alignmentMap } from './utils'

const props = defineProps({
  column: {
    type: Object,
    default: {},
  },
  row: {
    type: Object,
    default: {},
  },
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

const list = inject('list')
</script>

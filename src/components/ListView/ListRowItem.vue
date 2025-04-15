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
    <Tooltip
      v-bind="
        list.options.showTooltip
          ? {
              text: tooltip,
            }
          : { text: '' }
      "
    >
      <slot v-bind="{ label }">
        <div class="truncate text-base">{{ label }}</div>
      </slot>
    </Tooltip>
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
  if (props.column?.getLabel) return props.column?.getLabel({ row: props.row })
  return getValue(props.item).label || ''
})

const tooltip = computed(() => {
  if (!list.value.options.showTooltip) return ''
  return props.column.getTooltip
    ? props.column.getTooltip(props.row)
    : getValue(props.item).label
})

function getValue(value) {
  if (value && typeof value === 'object') {
    return value
  }
  return { label: value }
}

const list = inject('list')
</script>

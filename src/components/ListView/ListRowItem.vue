<template>
  <div
    v-if="list"
    class="flex items-center space-x-2"
    :class="alignmentMap[align]"
  >
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
<script setup lang="ts">
import { computed, ComputedRef, inject, withDefaults } from 'vue'
import { Tooltip } from '../../index'
import type { ColumnAlignment, ListColumn, ListContext, Row } from './types'
import { alignmentMap } from './utils'

interface ListRowItemProps {
  column?: ListColumn
  row?: Row
  item?: string | number | object
  align?: ColumnAlignment
}

const list = inject<ComputedRef<ListContext>>('list')

const props = withDefaults(defineProps<ListRowItemProps>(), {
  column: () => ({}) as ListColumn,
  row: () => ({}) as Row,
  item: '',
  align: 'left',
})

const label = computed(() => {
  if (props.column.getLabel) return props.column.getLabel({ row: props.row })
  return getValue(props.item).label || ''
})

const tooltip = computed(() => {
  if (!list?.value.options.showTooltip) return ''
  return props.column.getTooltip
    ? props.column.getTooltip(props.row)
    : getValue(props.item).label
})

function getValue(value: any) {
  if (value && typeof value === 'object') {
    return value
  }
  return { label: value }
}
</script>

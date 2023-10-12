<template>
  <Tooltip
    :text="tooltipText"
    class="flex items-center space-x-2"
    :class="align == 'text-right' ? 'justify-end' : ''"
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
import { dateFormat, timeAgo, htmlToText } from './utils'
import Tooltip from '../Tooltip.vue'
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  align: {
    type: String,
    default: 'left',
  },
  item: {
    type: [String, Number, Object],
    default: '',
  },
})

const _label = computed(() => {
  return getValue(props.item).label
})

const tooltipText = computed(() => {
  if (props.type === 'html') return ''
  if (props.type === 'pretty_date') {
    return dateFormat(_label.value, 'ddd, MMM D, YYYY h:mm A')
  }
  return _label.value?.toString()
})

const label = computed(() => {
  if (props.type === 'pretty_date') {
    return timeAgo(_label.value)
  }
  if (props.type === 'html') {
    return htmlToText(_label.value?.toString())
  }
  return _label.value?.toString()
})

function getValue(value) {
  if (value && typeof value === 'object') {
    value.label = value.full_name || value.label
    value.image = value.image || value.user_image || value.logo
    value.image_label = value.image_label || value.label
    return value
  }
  return { label: value }
}
</script>

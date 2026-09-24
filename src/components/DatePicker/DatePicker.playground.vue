<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, DateRangePicker, DateTimePicker } from 'frappe-ui'
import type { DateRangeValue } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

// Each picker keeps its own value, since their models have different shapes.
const date = ref('')
const dateTime = ref('')
const range = ref<DateRangeValue>([])

const tags: Record<string, string> = {
  date: 'DatePicker',
  datetime: 'DateTimePicker',
  range: 'DateRangePicker',
}

const knobs: Knob[] = [
  {
    name: 'picker',
    type: 'tabs',
    default: 'date',
    options: Object.keys(tags).map((t) => ({ label: t, value: t })),
  },
  { name: 'label', type: 'text', default: 'Due date' },
  {
    name: 'size',
    type: 'tabs',
    default: 'sm',
    options: [
      { label: 'xs', value: 'xs' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
    ],
  },
  {
    name: 'variant',
    type: 'tabs',
    default: 'subtle',
    options: [
      { label: 'subtle', value: 'subtle' },
      { label: 'outline', value: 'outline' },
      { label: 'ghost', value: 'ghost' },
    ],
  },
  { name: 'clearable', type: 'switch', default: false },
  { name: 'typeable', type: 'switch', default: true },
  { name: 'disabled', type: 'switch', default: false },
  {
    name: 'dualPane',
    type: 'switch',
    default: false,
    disabledWhen: (v) => v.picker !== 'range',
  },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.label) attrs.push(`label="${v.label}"`)
  attrs.push('placeholder="Pick a date"')
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.clearable) attrs.push('clearable')
  if (!v.typeable) attrs.push(':typeable="false"')
  if (v.disabled) attrs.push('disabled')
  if (v.picker === 'range' && v.dualPane) attrs.push('dual-pane')
  attrs.push('v-model="value"')
  return [`<${tags[v.picker]}`, ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="140px">
    <template #preview="{ values }">
      <div class="w-full max-w-xs">
        <DateRangePicker
          v-if="values.picker === 'range'"
          v-model="range"
          :label="values.label || undefined"
          placeholder="Pick a date"
          :size="values.size"
          :variant="values.variant"
          :clearable="values.clearable"
          :typeable="values.typeable"
          :disabled="values.disabled"
          :dual-pane="values.dualPane"
        />
        <DateTimePicker
          v-else-if="values.picker === 'datetime'"
          v-model="dateTime"
          :label="values.label || undefined"
          placeholder="Pick a date"
          :size="values.size"
          :variant="values.variant"
          :clearable="values.clearable"
          :typeable="values.typeable"
          :disabled="values.disabled"
        />
        <DatePicker
          v-else
          v-model="date"
          :label="values.label || undefined"
          placeholder="Pick a date"
          :size="values.size"
          :variant="values.variant"
          :clearable="values.clearable"
          :typeable="values.typeable"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

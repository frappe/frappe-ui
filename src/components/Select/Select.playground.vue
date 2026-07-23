<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref<string>('')

const options = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' },
]

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Status', width: '12rem' },
  {
    name: 'placeholder',
    type: 'text',
    default: 'Select status',
    width: '14rem',
  },
  {
    name: 'size',
    type: 'tabs',
    default: 'sm',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
      { label: 'xl', value: 'xl' },
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
  { name: 'required', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.placeholder) attrs.push(`placeholder="${v.placeholder}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.required) attrs.push('required')
  if (v.disabled) attrs.push('disabled')
  attrs.push(':options="options"')
  attrs.push('v-model="value"')
  return ['<Select', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="140px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Select
          v-model="model"
          :label="values.label || undefined"
          :placeholder="values.placeholder || undefined"
          :size="values.size"
          :variant="values.variant"
          :required="values.required"
          :disabled="values.disabled"
          :options="options"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

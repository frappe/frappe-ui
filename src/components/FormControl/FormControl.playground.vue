<script setup lang="ts">
import { ref } from 'vue'
import { FormControl } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref<any>('')

const selectOptions = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

const knobs: Knob[] = [
  {
    name: 'type',
    type: 'tabs',
    default: 'text',
    options: [
      { label: 'text', value: 'text' },
      { label: 'textarea', value: 'textarea' },
      { label: 'select', value: 'select' },
      { label: 'checkbox', value: 'checkbox' },
      { label: 'combobox', value: 'combobox' },
      { label: 'date', value: 'date' },
    ],
  },
  { name: 'label', type: 'text', default: 'Status', width: '12rem' },
  { name: 'description', type: 'text', default: '', width: '20rem' },
  {
    name: 'size',
    type: 'tabs',
    default: 'sm',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
    ],
  },
  {
    name: 'variant',
    type: 'tabs',
    default: 'subtle',
    options: [
      { label: 'subtle', value: 'subtle' },
      { label: 'outline', value: 'outline' },
    ],
  },
  { name: 'required', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.type !== 'text') attrs.push(`type="${v.type}"`)
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.required) attrs.push('required')
  if (v.type === 'select' || v.type === 'combobox') {
    attrs.push(':options="options"')
  }
  attrs.push('v-model="value"')
  return ['<FormControl', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}

function optionsFor(type: string) {
  return type === 'select' || type === 'combobox' ? selectOptions : undefined
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="160px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <FormControl
          v-model="model"
          :type="values.type"
          :label="values.label || undefined"
          :description="values.description || undefined"
          :size="values.size"
          :variant="values.variant"
          :required="values.required"
          :options="optionsFor(values.type)"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioGroup } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref('email')

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Notify me by', width: '14rem' },
  { name: 'description', type: 'text', default: '', width: '20rem' },
  {
    name: 'size',
    type: 'tabs',
    default: 'sm',
    options: [
      { label: 'xs', value: 'xs' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
    ],
  },
  { name: 'padded', type: 'switch', default: false },
  {
    name: 'orientation',
    type: 'tabs',
    default: 'vertical',
    options: [
      { label: 'vertical', value: 'vertical' },
      { label: 'horizontal', value: 'horizontal' },
    ],
  },
  { name: 'required', type: 'switch', default: false },
  { name: 'error', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
]

const ERROR_MESSAGE = 'Please choose an option.'

function buildCode(v: Record<string, any>) {
  const attrs = ['v-model="value"']
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.padded) attrs.push('padded')
  if (v.orientation !== 'vertical') attrs.push(`orientation="${v.orientation}"`)
  if (v.required) attrs.push('required')
  if (v.error) attrs.push(`error="${ERROR_MESSAGE}"`)
  if (v.disabled) attrs.push('disabled')
  return [
    '<RadioGroup',
    ...attrs.map((a) => '  ' + a),
    '>',
    '  <Radio value="email" label="Email" />',
    '  <Radio value="sms" label="SMS" />',
    '</RadioGroup>',
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="140px">
    <template #preview="{ values }">
      <RadioGroup
        v-model="model"
        :label="values.label || undefined"
        :description="values.description || undefined"
        :size="values.size"
        :padded="values.padded"
        :orientation="values.orientation"
        :required="values.required"
        :error="values.error ? ERROR_MESSAGE : undefined"
        :disabled="values.disabled"
      >
        <Radio value="email" label="Email" />
        <Radio value="sms" label="SMS" />
      </RadioGroup>
    </template>
  </PlaygroundFrame>
</template>

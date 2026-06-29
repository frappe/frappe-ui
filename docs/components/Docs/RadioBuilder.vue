<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'frappe-ui'
import ComponentPlayground, { type Knob } from './ComponentPlayground.vue'

// A radio is one option within a group; the playground shows a single selected
// option so the knobs can demonstrate its states.
const model = ref('option')

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Email', width: '14rem' },
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
  {
    name: 'variant',
    type: 'tabs',
    default: 'default',
    options: [
      { label: 'default', value: 'default' },
      { label: 'padded', value: 'padded' },
    ],
  },
  { name: 'error', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
]

const ERROR_MESSAGE = 'Please choose an option.'

function buildCode(v: Record<string, any>) {
  const attrs = ['value="email"']
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'default') attrs.push(`variant="${v.variant}"`)
  if (v.error) attrs.push(`error="${ERROR_MESSAGE}"`)
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Radio', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <ComponentPlayground :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <Radio
        v-model="model"
        value="option"
        :label="values.label || undefined"
        :description="values.description || undefined"
        :size="values.size"
        :variant="values.variant"
        :error="values.error ? ERROR_MESSAGE : undefined"
        :disabled="values.disabled"
      />
    </template>
  </ComponentPlayground>
</template>

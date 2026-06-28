<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'frappe-ui'
import ComponentPlayground, { type Knob } from './ComponentPlayground.vue'

const model = ref(true)

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Notifications', width: '14rem' },
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
  {
    name: 'switchPosition',
    type: 'tabs',
    default: 'start',
    options: [
      { label: 'start', value: 'start' },
      { label: 'end', value: 'end' },
    ],
  },
  { name: 'required', type: 'switch', default: false },
  { name: 'error', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
]

const ERROR_MESSAGE = 'This field is required.'

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'default') attrs.push(`variant="${v.variant}"`)
  if (v.switchPosition !== 'start')
    attrs.push(`switch-position="${v.switchPosition}"`)
  if (v.required) attrs.push('required')
  if (v.error) attrs.push(`error="${ERROR_MESSAGE}"`)
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Switch', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <ComponentPlayground :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div
        :class="
          values.switchPosition === 'start'
            ? 'flex w-full justify-center'
            : 'w-full max-w-sm mx-auto'
        "
      >
        <Switch
          v-model="model"
          :label="values.label || undefined"
          :description="values.description || undefined"
          :size="values.size"
          :variant="values.variant"
          :switch-position="values.switchPosition"
          :required="values.required"
          :error="values.error ? ERROR_MESSAGE : undefined"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </ComponentPlayground>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

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
  { name: 'padded', type: 'switch', default: false },
  {
    name: 'controlPosition',
    type: 'tabs',
    default: 'end',
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
  if (v.padded) attrs.push('padded')
  if (v.controlPosition !== 'end')
    attrs.push(`control-position="${v.controlPosition}"`)
  if (v.required) attrs.push('required')
  if (v.error) attrs.push(`error="${ERROR_MESSAGE}"`)
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Switch', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div
        :class="
          values.controlPosition === 'start'
            ? 'flex w-full justify-center'
            : 'w-full max-w-sm mx-auto'
        "
      >
        <Switch
          v-model="model"
          :label="values.label || undefined"
          :description="values.description || undefined"
          :size="values.size"
          :padded="values.padded"
          :control-position="values.controlPosition"
          :required="values.required"
          :error="values.error ? ERROR_MESSAGE : undefined"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

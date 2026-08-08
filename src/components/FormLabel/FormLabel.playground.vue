<script setup lang="ts">
import { FormLabel } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  {
    name: 'label',
    type: 'text',
    default: 'Email',
    width: '12rem',
  },
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
    name: 'required',
    type: 'switch',
    default: false,
  },
]

function buildCode(v: Record<string, any>) {
  const attrs = [`label="${v.label}"`]
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.required) attrs.push('required')
  return ['<FormLabel', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="60px">
    <template #preview="{ values }">
      <FormLabel :label="values.label" :size="values.size" :required="values.required" />
    </template>
  </PlaygroundFrame>
</template>

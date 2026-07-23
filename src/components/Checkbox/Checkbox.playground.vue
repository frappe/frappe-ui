<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref<boolean>(true)

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'I agree', width: '14rem' },
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
  { name: 'required', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.required) attrs.push('required')
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Checkbox', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <Checkbox
        v-model="model"
        :label="values.label || undefined"
        :description="values.description || undefined"
        :size="values.size"
        :required="values.required"
        :disabled="values.disabled"
      />
    </template>
  </PlaygroundFrame>
</template>

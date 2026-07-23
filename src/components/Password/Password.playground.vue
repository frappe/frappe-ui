<script setup lang="ts">
import { ref } from 'vue'
import { Password } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref('')

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Password', width: '12rem' },
  { name: 'description', type: 'text', default: '', width: '20rem' },
  { name: 'placeholder', type: 'text', default: '••••••••', width: '12rem' },
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
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.placeholder) attrs.push(`placeholder="${v.placeholder}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.required) attrs.push('required')
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Password', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Password
          v-model="model"
          :label="values.label || undefined"
          :description="values.description || undefined"
          :placeholder="values.placeholder || undefined"
          :size="values.size"
          :variant="values.variant"
          :required="values.required"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

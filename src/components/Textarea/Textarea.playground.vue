<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref('')

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Notes', width: '12rem' },
  { name: 'description', type: 'text', default: '', width: '20rem' },
  {
    name: 'placeholder',
    type: 'text',
    default: 'Write something…',
    width: '16rem',
  },
  { name: 'rows', type: 'text', default: '3', width: '4rem' },
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
  const rowsNum = Number(v.rows)
  if (rowsNum && rowsNum !== 3) attrs.push(`:rows="${rowsNum}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.required) attrs.push('required')
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Textarea', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="140px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Textarea
          v-model="model"
          :label="values.label || undefined"
          :description="values.description || undefined"
          :placeholder="values.placeholder || undefined"
          :rows="Number(values.rows) || 3"
          :size="values.size"
          :variant="values.variant"
          :required="values.required"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

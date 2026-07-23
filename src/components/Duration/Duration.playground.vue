<script setup lang="ts">
import { ref } from 'vue'
import { Duration } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref<number | null>(5445)

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Time spent', width: '12rem' },
  { name: 'description', type: 'text', default: '', width: '20rem' },
  { name: 'placeholder', type: 'text', default: '1h 30m 45s', width: '12rem' },
  {
    name: 'format',
    type: 'tabs',
    default: 'short',
    options: [
      { label: 'short', value: 'short' },
      { label: 'long', value: 'long' },
      { label: 'colon', value: 'colon' },
      { label: 'token', value: 'token' },
    ],
  },
  {
    name: 'template',
    type: 'text',
    default: 'hh:mm:ss',
    width: '14rem',
    visibleWhen: (v) => v.format === 'token',
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

// `token` is a meta-option that swaps the preset for a free-form template the
// user types into the `template` knob; every other value is a preset as-is.
function resolveFormat(v: Record<string, any>) {
  return v.format === 'token' ? v.template.trim() : v.format
}

function buildCode(v: Record<string, any>) {
  const format = resolveFormat(v)
  const attrs = []
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.placeholder !== '1h 30m 45s')
    attrs.push(`placeholder="${v.placeholder}"`)
  if (format && format !== 'short') attrs.push(`format="${format}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.required) attrs.push('required')
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Duration', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Duration
          v-model="model"
          :label="values.label || undefined"
          :description="values.description || undefined"
          :placeholder="values.placeholder || undefined"
          :format="resolveFormat(values) || 'short'"
          :size="values.size"
          :variant="values.variant"
          :required="values.required"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

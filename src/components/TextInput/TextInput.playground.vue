<script setup lang="ts">
import { ref } from 'vue'
import { TextInput } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref('')

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Email', width: '12rem' },
  { name: 'description', type: 'text', default: '', width: '20rem' },
  {
    name: 'placeholder',
    type: 'text',
    default: 'jane@example.com',
    width: '14rem',
  },
  {
    name: 'type',
    type: 'tabs',
    default: 'text',
    options: [
      { label: 'text', value: 'text' },
      { label: 'email', value: 'email' },
      { label: 'number', value: 'number' },
      { label: 'password', value: 'password' },
      { label: 'date', value: 'date' },
    ],
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
  { name: 'prefix', type: 'switch', default: false },
  { name: 'suffix', type: 'switch', default: false },
  { name: 'required', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.placeholder) attrs.push(`placeholder="${v.placeholder}"`)
  if (v.type !== 'text') attrs.push(`type="${v.type}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.required) attrs.push('required')
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  const slots = []
  if (v.prefix) {
    slots.push(
      '  <template #prefix><span class="lucide-mail size-4" /></template>',
    )
  }
  if (v.suffix) {
    slots.push(
      '  <template #suffix><span class="lucide-check size-4" /></template>',
    )
  }
  if (!slots.length) {
    return ['<TextInput', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
  }
  return [
    '<TextInput',
    ...attrs.map((a) => '  ' + a),
    '>',
    ...slots,
    '</TextInput>',
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <TextInput
          v-model="model"
          :label="values.label || undefined"
          :description="values.description || undefined"
          :placeholder="values.placeholder || undefined"
          :type="values.type"
          :size="values.size"
          :variant="values.variant"
          :required="values.required"
          :disabled="values.disabled"
        >
          <template v-if="values.prefix" #prefix>
            <span class="lucide-mail size-4 text-ink-gray-5" />
          </template>
          <template v-if="values.suffix" #suffix>
            <span class="lucide-check size-4 text-ink-gray-5" />
          </template>
        </TextInput>
      </div>
    </template>
  </PlaygroundFrame>
</template>

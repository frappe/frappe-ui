<script setup lang="ts">
import { Tag } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Discover' },
  {
    name: 'variant',
    type: 'tabs',
    default: 'subtle',
    options: [
      { label: 'solid', value: 'solid' },
      { label: 'subtle', value: 'subtle' },
      { label: 'outline', value: 'outline' },
      { label: 'ghost', value: 'ghost' },
    ],
  },
  {
    name: 'theme',
    type: 'tabs',
    default: 'blue',
    options: [
      { label: 'gray', value: 'gray' },
      { label: 'blue', value: 'blue' },
      { label: 'green', value: 'green' },
      { label: 'amber', value: 'amber' },
      { label: 'red', value: 'red' },
      { label: 'violet', value: 'violet' },
    ],
  },
  {
    name: 'size',
    type: 'tabs',
    default: 'md',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
    ],
  },
  { name: 'dismissible', type: 'switch', default: true },
  { name: 'disabled', type: 'switch', default: false },
  { name: 'prefix', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = [
    `variant="${v.variant}"`,
    `theme="${v.theme}"`,
    `size="${v.size}"`,
  ]
  if (v.dismissible) attrs.push('dismissible', '@dismiss="remove"')
  if (v.disabled) attrs.push('disabled')
  if (!v.prefix) {
    return [
      '<Tag',
      ...attrs.map((a) => '  ' + a),
      `  label="${v.label}"`,
      '/>',
    ].join('\n')
  }
  return [
    '<Tag',
    ...attrs.map((a) => '  ' + a),
    '>',
    '  <template #prefix><span class="lucide-hash" /></template>',
    `  ${v.label}`,
    '</Tag>',
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode">
    <template #preview="{ values }">
      <Tag
        :theme="values.theme"
        :variant="values.variant"
        :size="values.size"
        :dismissible="values.dismissible"
        :disabled="values.disabled"
      >
        <template v-if="values.prefix" #prefix>
          <span class="lucide-hash" />
        </template>
        {{ values.label }}
      </Tag>
    </template>
  </PlaygroundFrame>
</template>

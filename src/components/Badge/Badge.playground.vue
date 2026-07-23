<script setup lang="ts">
import { Badge } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Gamma' },
  {
    name: 'variant',
    type: 'tabs',
    default: 'solid',
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
    default: 'green',
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
    default: 'lg',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
    ],
  },
  { name: 'prefix', type: 'switch', default: true },
  { name: 'suffix', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = [
    `variant="${v.variant}"`,
    `theme="${v.theme}"`,
    `size="${v.size}"`,
  ]
  const slots: string[] = []
  if (v.prefix) {
    slots.push('  <template #prefix><span class="lucide-check" /></template>')
  }
  slots.push(`  ${v.label}`)
  if (v.suffix) {
    slots.push(
      '  <template #suffix><span class="lucide-chevron-down" /></template>',
    )
  }
  return [
    '<Badge',
    ...attrs.map((a) => '  ' + a),
    '>',
    ...slots,
    '</Badge>',
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode">
    <template #preview="{ values }">
      <Badge
        :theme="values.theme"
        :variant="values.variant"
        :size="values.size"
      >
        <template v-if="values.prefix" #prefix>
          <span class="lucide-check" />
        </template>
        {{ values.label }}
        <template v-if="values.suffix" #suffix>
          <span class="lucide-chevron-down" />
        </template>
      </Badge>
    </template>
  </PlaygroundFrame>
</template>

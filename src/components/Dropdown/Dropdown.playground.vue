<script setup lang="ts">
import { Dropdown } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const options = [
  { label: 'Edit', icon: 'lucide-pencil', onClick: () => {} },
  { label: 'Duplicate', icon: 'lucide-copy', onClick: () => {} },
  { label: 'Archive', icon: 'lucide-archive', onClick: () => {} },
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    theme: 'red' as const,
    onClick: () => {},
  },
]

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Actions', width: '12rem' },
  {
    name: 'align',
    type: 'tabs',
    default: 'start',
    options: [
      { label: 'start', value: 'start' },
      { label: 'center', value: 'center' },
      { label: 'end', value: 'end' },
    ],
  },
  {
    name: 'side',
    type: 'tabs',
    default: 'bottom',
    options: [
      { label: 'top', value: 'top' },
      { label: 'right', value: 'right' },
      { label: 'bottom', value: 'bottom' },
      { label: 'left', value: 'left' },
    ],
  },
]

function buildCode(v: Record<string, any>) {
  const attrs = [`:button="{ label: '${v.label}' }"`]
  if (v.align !== 'start') attrs.push(`align="${v.align}"`)
  if (v.side !== 'bottom') attrs.push(`side="${v.side}"`)
  attrs.push(':options="options"')
  return ['<Dropdown', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="220px">
    <template #preview="{ values }">
      <Dropdown
        :button="{ label: values.label }"
        :align="values.align"
        :side="values.side"
        :options="options"
      />
    </template>
  </PlaygroundFrame>
</template>

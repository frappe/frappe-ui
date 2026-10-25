<script setup lang="ts">
import { Tooltip, Button } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'text', type: 'text', default: 'Save changes' },
  {
    name: 'side',
    type: 'tabs',
    default: 'top',
    options: [
      { label: 'top', value: 'top' },
      { label: 'right', value: 'right' },
      { label: 'bottom', value: 'bottom' },
      { label: 'left', value: 'left' },
    ],
  },
  { name: 'hoverDelay', type: 'number', default: 500, min: 0, step: 100 },
  { name: 'disabled', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = [`text="${v.text}"`]
  if (v.side !== 'top') attrs.push(`side="${v.side}"`)
  const hd = v.hoverDelay ?? 0
  if (hd !== 500) attrs.push(`:hover-delay="${hd}"`)
  if (v.disabled) attrs.push('disabled')
  return [
    '<Tooltip',
    ...attrs.map((a) => '  ' + a),
    '>',
    '  <Button label="Hover me" />',
    '</Tooltip>',
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="160px">
    <template #preview="{ values }">
      <Tooltip
        :text="values.text"
        :side="values.side"
        :hover-delay="values.hoverDelay ?? 0"
        :disabled="values.disabled"
      >
        <Button label="Hover me" />
      </Tooltip>
    </template>
  </PlaygroundFrame>
</template>

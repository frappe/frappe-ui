<script setup lang="ts">
import { Tooltip, Button } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'text', type: 'text', default: 'Save changes', width: '16rem' },
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
  { name: 'hoverDelay', type: 'text', default: '0.5', width: '4rem' },
  { name: 'disabled', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = [`text="${v.text}"`]
  if (v.side !== 'top') attrs.push(`side="${v.side}"`)
  const hd = Number(v.hoverDelay)
  if (!Number.isNaN(hd) && hd !== 0.5) attrs.push(`:hover-delay="${hd}"`)
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
        :hover-delay="Number(values.hoverDelay) || 0"
        :disabled="values.disabled"
      >
        <Button label="Hover me" />
      </Tooltip>
    </template>
  </PlaygroundFrame>
</template>

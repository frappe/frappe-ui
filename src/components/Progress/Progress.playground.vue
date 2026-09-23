<script setup lang="ts">
import { Progress } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'value', type: 'text', default: '60' },
  { name: 'label', type: 'text', default: 'Upload' },
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
  { name: 'hint', type: 'switch', default: true },
  { name: 'intervals', type: 'text', default: '' },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = [`:value="${Number(v.value) || 0}"`]
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.hint) attrs.push('hint')
  const intervals = Number(v.intervals)
  if (intervals > 0) attrs.push(`:intervals="${intervals}"`)
  return ['<Progress', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="100px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Progress
          :value="Number(values.value) || 0"
          :label="values.label || undefined"
          :size="values.size"
          :hint="values.hint"
          :intervals="Number(values.intervals) || undefined"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

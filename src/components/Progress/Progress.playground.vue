<script setup lang="ts">
import { Progress } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'value', type: 'number', default: 60, min: 0, max: 100 },
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
  { name: 'intervals', type: 'number', default: null, min: 0 },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = [`:value="${v.value ?? 0}"`]
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.hint) attrs.push('hint')
  const intervals = v.intervals ?? 0
  if (intervals > 0) attrs.push(`:intervals="${intervals}"`)
  return ['<Progress', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="100px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Progress
          :value="values.value ?? 0"
          :label="values.label || undefined"
          :size="values.size"
          :hint="values.hint"
          :intervals="values.intervals || undefined"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref(3)

const knobs: Knob[] = [
  { name: 'max', type: 'text', default: '5', width: '4rem' },
  {
    name: 'step',
    type: 'tabs',
    default: '1',
    options: [
      { label: '1', value: '1' },
      { label: '0.5', value: '0.5' },
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
  { name: 'readonly', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  const max = Number(v.max)
  if (max && max !== 5) attrs.push(`:max="${max}"`)
  if (v.step !== '1') attrs.push(`:step="${v.step}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.readonly) attrs.push('readonly')
  attrs.push('v-model="value"')
  return ['<Rating', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="100px">
    <template #preview="{ values }">
      <Rating
        v-model="model"
        :max="Number(values.max) || 5"
        :step="Number(values.step) as 1 | 0.5"
        :size="values.size"
        :readonly="values.readonly"
      />
    </template>
  </PlaygroundFrame>
</template>

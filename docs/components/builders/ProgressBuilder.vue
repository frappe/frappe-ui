<script setup lang="ts">
import { Progress } from 'frappe-ui'
import ComponentPlayground, { type Knob } from './ComponentPlayground.vue'

const knobs: Knob[] = [
  { name: 'value', type: 'text', default: '60', width: '5rem' },
  { name: 'label', type: 'text', default: 'Upload', width: '12rem' },
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
  { name: 'intervals', type: 'switch', default: false },
  { name: 'intervalCount', type: 'text', default: '6', width: '4rem' },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = [`:value="${Number(v.value) || 0}"`]
  if (v.label) attrs.push(`label="${v.label}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.hint) attrs.push('hint')
  if (v.intervals) {
    attrs.push('intervals')
    const ic = Number(v.intervalCount)
    if (ic && ic !== 6) attrs.push(`:interval-count="${ic}"`)
  }
  return ['<Progress', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <ComponentPlayground
    :knobs="knobs"
    :code="buildCode"
    preview-min-height="100px"
  >
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Progress
          :value="Number(values.value) || 0"
          :label="values.label || undefined"
          :size="values.size"
          :hint="values.hint"
          :intervals="values.intervals"
          :interval-count="Number(values.intervalCount) || 6"
        />
      </div>
    </template>
  </ComponentPlayground>
</template>

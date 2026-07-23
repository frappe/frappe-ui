<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref<number[]>([40])

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Volume', width: '12rem' },
  { name: 'min', type: 'text', default: '0', width: '4rem' },
  { name: 'max', type: 'text', default: '100', width: '4rem' },
  { name: 'step', type: 'text', default: '1', width: '4rem' },
  {
    name: 'size',
    type: 'tabs',
    default: 'sm',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
    ],
  },
  { name: 'range', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = []
  if (v.label) attrs.push(`label="${v.label}"`)
  const min = Number(v.min)
  const max = Number(v.max)
  const step = Number(v.step)
  if (min !== 0) attrs.push(`:min="${min}"`)
  if (max !== 100) attrs.push(`:max="${max}"`)
  if (step !== 1) attrs.push(`:step="${step}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.disabled) attrs.push('disabled')
  attrs.push('v-model="value"')
  return ['<Slider', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}

function valueFor(range: boolean) {
  if (range && model.value.length === 1) model.value = [20, 80]
  if (!range && model.value.length === 2) model.value = [40]
  return model.value
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div class="w-full max-w-sm">
        <Slider
          :model-value="valueFor(values.range)"
          @update:model-value="(v) => (model = v ?? [])"
          :label="values.label || undefined"
          :min="Number(values.min) || 0"
          :max="Number(values.max) || 100"
          :step="Number(values.step) || 1"
          :size="values.size"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

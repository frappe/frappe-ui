<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const model = ref<number[]>([40])

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Volume' },
  { name: 'min', type: 'number', default: 0 },
  { name: 'max', type: 'number', default: 100 },
  { name: 'step', type: 'number', default: 1, min: 0 },
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
  const min = v.min ?? 0
  const max = v.max ?? 100
  const step = v.step || 1
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
          :min="values.min ?? 0"
          :max="values.max ?? 100"
          :step="values.step || 1"
          :size="values.size"
          :disabled="values.disabled"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

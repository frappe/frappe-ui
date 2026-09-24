<script setup lang="ts">
import { Spinner } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  {
    name: 'size',
    type: 'tabs',
    default: 'md',
    options: [
      { label: 'xs', value: 'xs' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
    ],
  },
  {
    name: 'theme',
    type: 'tabs',
    default: 'inherit',
    options: [
      { label: 'inherit', value: 'inherit' },
      { label: 'gray', value: 'gray' },
      { label: 'red', value: 'red' },
    ],
  },
  { name: 'track', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = []
  attrs.push(`size="${v.size}"`)
  if (v.theme !== 'inherit') attrs.push(`theme="${v.theme}"`)
  if (v.track) attrs.push('track')
  return `<Spinner ${attrs.join(' ')} />`
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div class="text-ink-gray-6">
        <Spinner
          :size="values.size"
          :theme="values.theme === 'inherit' ? undefined : values.theme"
          :track="values.track"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

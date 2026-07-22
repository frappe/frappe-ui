<script setup lang="ts">
import { Alert } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'title', type: 'text', default: 'Heads up', width: '14rem' },
  {
    name: 'description',
    type: 'text',
    default: 'You can dismiss this alert.',
    width: '20rem',
  },
  {
    name: 'theme',
    type: 'tabs',
    default: 'blue',
    options: [
      { label: 'none', value: 'none' },
      { label: 'yellow', value: 'yellow' },
      { label: 'blue', value: 'blue' },
      { label: 'green', value: 'green' },
      { label: 'red', value: 'red' },
    ],
  },
  {
    name: 'variant',
    type: 'tabs',
    default: 'subtle',
    options: [
      { label: 'subtle', value: 'subtle' },
      { label: 'outline', value: 'outline' },
    ],
  },
  { name: 'dismissible', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const attrs = [`title="${v.title}"`]
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.theme !== 'none') attrs.push(`theme="${v.theme}"`)
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (!v.dismissible) attrs.push(':dismissible="false"')
  return ['<Alert', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <div class="w-full max-w-md">
        <Alert
          :title="values.title"
          :description="values.description || undefined"
          :theme="values.theme === 'none' ? undefined : values.theme"
          :variant="values.variant"
          :dismissible="values.dismissible"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

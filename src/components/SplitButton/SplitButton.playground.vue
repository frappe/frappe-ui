<script setup lang="ts">
import { SplitButton } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const options = [
  { label: 'Publish to staging', icon: 'lucide-flask-conical', onClick() {} },
  { label: 'Unpublish', icon: 'lucide-cloud-off', onClick() {} },
]

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Publish' },
  { name: 'menuLabel', type: 'text', default: 'More ways to publish' },
  {
    name: 'variant',
    type: 'tabs',
    default: 'solid',
    options: [
      { label: 'solid', value: 'solid' },
      { label: 'subtle', value: 'subtle' },
      { label: 'outline', value: 'outline' },
    ],
  },
  {
    name: 'size',
    type: 'tabs',
    default: 'sm',
    options: [
      { label: 'xs', value: 'xs' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
    ],
  },
  { name: 'iconLeft', type: 'switch', default: false },
  { name: 'disabled', type: 'switch', default: false },
  { name: 'loading', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = [
    `label="${v.label}"`,
    `menu-label="${v.menuLabel}"`,
    `variant="${v.variant}"`,
  ]
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.iconLeft) attrs.push('icon-left="lucide-globe"')
  if (v.disabled) attrs.push('disabled')
  if (v.loading) attrs.push('loading')
  attrs.push(':options="options"', '@click="publish"')
  return ['<SplitButton', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode">
    <template #preview="{ values }">
      <SplitButton
        :label="values.label"
        :menu-label="values.menuLabel"
        :variant="values.variant"
        :size="values.size"
        :icon-left="values.iconLeft ? 'lucide-globe' : undefined"
        :disabled="values.disabled"
        :loading="values.loading"
        :options="options"
      />
    </template>
  </PlaygroundFrame>
</template>

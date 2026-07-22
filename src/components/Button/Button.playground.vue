<script setup lang="ts">
import { Button } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Save' },
  {
    name: 'variant',
    type: 'tabs',
    default: 'subtle',
    options: [
      { label: 'solid', value: 'solid' },
      { label: 'subtle', value: 'subtle' },
      { label: 'outline', value: 'outline' },
      { label: 'ghost', value: 'ghost' },
    ],
  },
  {
    name: 'theme',
    type: 'tabs',
    default: 'gray',
    options: [
      { label: 'gray', value: 'gray' },
      { label: 'red', value: 'red' },
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
  {
    name: 'iconLeft',
    type: 'switch',
    default: false,
    disabledWhen: (v) => v.icon,
  },
  { name: 'icon', type: 'switch', default: false },
  {
    name: 'iconRight',
    type: 'switch',
    default: false,
    disabledWhen: (v) => v.icon,
  },
  { name: 'disabled', type: 'switch', default: false },
  { name: 'loading', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs = [
    `variant="${v.variant}"`,
    `theme="${v.theme}"`,
    `size="${v.size}"`,
    `label="${v.label}"`,
  ]
  if (v.icon) {
    attrs.push(`icon="lucide-plus"`)
  } else {
    if (v.iconLeft) attrs.push(`icon-left="lucide-plus"`)
    if (v.iconRight) attrs.push(`icon-right="lucide-chevron-right"`)
  }
  if (v.disabled) attrs.push('disabled')
  if (v.loading) attrs.push('loading')

  return ['<Button', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode">
    <template #preview="{ values }">
      <Button
        :theme="values.theme"
        :variant="values.variant"
        :size="values.size"
        :label="values.label"
        :icon-left="!values.icon && values.iconLeft ? 'lucide-plus' : undefined"
        :icon="values.icon ? 'lucide-plus' : undefined"
        :icon-right="
          !values.icon && values.iconRight ? 'lucide-chevron-right' : undefined
        "
        :loading="values.loading"
        :disabled="values.disabled"
      />
    </template>
  </PlaygroundFrame>
</template>

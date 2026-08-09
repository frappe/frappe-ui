<script setup lang="ts">
import { Alert } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  {
    name: 'title',
    type: 'text',
    default: 'Your trial ends soon!',
    width: '14rem',
  },
  {
    name: 'description',
    type: 'text',
    default: 'Upgrade to keep enjoying features.',
    width: '20rem',
  },
  {
    name: 'theme',
    type: 'tabs',
    default: 'gray',
    options: [
      { label: 'gray', value: 'gray' },
      { label: 'blue', value: 'blue' },
      { label: 'green', value: 'green' },
      { label: 'amber', value: 'amber' },
      { label: 'red', value: 'red' },
    ],
  },
  {
    name: 'icon',
    type: 'tabs',
    default: 'auto',
    options: [
      { label: 'auto', value: 'auto' },
      { label: 'show', value: 'show' },
      { label: 'hide', value: 'hide' },
    ],
  },
  { name: 'primaryAction', type: 'switch', default: true },
  { name: 'secondaryAction', type: 'switch', default: false },
  { name: 'dismissible', type: 'switch', default: false },
]

function iconProp(value: string) {
  if (value === 'show') return true
  if (value === 'hide') return false
  return undefined
}

function buildCode(v: Record<string, any>) {
  const attrs = [`title="${v.title}"`]
  if (v.description) attrs.push(`description="${v.description}"`)
  if (v.theme !== 'gray') attrs.push(`theme="${v.theme}"`)
  if (v.icon === 'show') attrs.push(':icon="true"')
  if (v.icon === 'hide') attrs.push(':icon="false"')
  if (v.primaryAction) {
    attrs.push(
      `:primary-action="{ label: 'Update now', onClick: ({ dismiss }) => dismiss() }"`,
    )
  }
  if (v.secondaryAction) {
    attrs.push(`:secondary-action="{ label: 'View plans' }"`)
  }
  if (v.dismissible) attrs.push('dismissible')
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
          :theme="values.theme"
          :icon="iconProp(values.icon)"
          :primary-action="
            values.primaryAction
              ? { label: 'Update now', onClick: ({ dismiss }) => dismiss() }
              : undefined
          "
          :secondary-action="
            values.secondaryAction ? { label: 'View plans' } : undefined
          "
          :dismissible="values.dismissible"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

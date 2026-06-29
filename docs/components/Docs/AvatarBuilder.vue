<script setup lang="ts">
import { Avatar } from 'frappe-ui'
import ComponentPlayground, { type Knob } from './ComponentPlayground.vue'

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'John Doe', width: '12rem' },
  { name: 'image', type: 'text', default: '', width: '20rem' },
  {
    name: 'size',
    type: 'tabs',
    default: 'md',
    options: [
      { label: 'xs', value: 'xs' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
      { label: 'xl', value: 'xl' },
      { label: '2xl', value: '2xl' },
      { label: '3xl', value: '3xl' },
    ],
  },
  {
    name: 'shape',
    type: 'tabs',
    default: 'circle',
    options: [
      { label: 'circle', value: 'circle' },
      { label: 'square', value: 'square' },
    ],
  },
]

function buildCode(v: Record<string, any>) {
  const attrs = [`label="${v.label}"`]
  if (v.image) attrs.push(`image="${v.image}"`)
  if (v.size !== 'md') attrs.push(`size="${v.size}"`)
  if (v.shape !== 'circle') attrs.push(`shape="${v.shape}"`)
  return ['<Avatar', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <ComponentPlayground :knobs="knobs" :code="buildCode" preview-min-height="120px">
    <template #preview="{ values }">
      <Avatar
        :label="values.label"
        :image="values.image || undefined"
        :size="values.size"
        :shape="values.shape"
      />
    </template>
  </ComponentPlayground>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Breadcrumbs } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const allItems = [
  { label: 'Workspace' },
  { label: 'Projects' },
  { label: 'Frappe UI' },
  { label: 'Pull Requests' },
  { label: '#716' },
]

const knobs: Knob[] = [
  {
    name: 'count',
    type: 'tabs',
    default: '3',
    options: [
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
    ],
  },
]

function itemsFor(count: number) {
  return allItems.slice(0, count)
}

function buildCode(v: Record<string, any>) {
  const count = Number(v.count)
  const items = itemsFor(count)
  const lines = items.map((i) => `    { label: '${i.label}' },`).join('\n')
  return `<Breadcrumbs :items="[\n${lines}\n  ]" />`
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="80px">
    <template #preview="{ values }">
      <Breadcrumbs :items="itemsFor(Number(values.count))" />
    </template>
  </PlaygroundFrame>
</template>

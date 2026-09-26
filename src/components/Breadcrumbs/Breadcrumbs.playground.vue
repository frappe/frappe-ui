<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const allItems = [
  { label: 'Workspace', icon: 'lucide-layout-grid' },
  { label: 'Projects', icon: 'lucide-folder' },
  { label: 'Frappe UI', icon: 'lucide-box' },
  { label: 'Pull Requests', icon: 'lucide-git-pull-request' },
  { label: '#716', icon: 'lucide-hash' },
]

// Narrow widths show how the crumbs before the last two fold into a menu.
const widthClass: Record<string, string> = {
  full: '',
  '320px': 'w-80',
  '240px': 'w-60',
}

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
  { name: 'current', type: 'text', default: '' },
  {
    name: 'width',
    type: 'tabs',
    default: 'full',
    options: Object.keys(widthClass).map((w) => ({ label: w, value: w })),
  },
  { name: 'icons', type: 'switch', default: false },
]

function itemsFor(v: Record<string, any>) {
  const items = allItems.slice(0, Number(v.count)).map((i) => ({ ...i }))
  if (v.current) items[items.length - 1].label = v.current
  return items
}

function buildCode(v: Record<string, any>) {
  const lines = itemsFor(v)
    .map((i) =>
      v.icons
        ? `    { label: '${i.label}', icon: '${i.icon}' },`
        : `    { label: '${i.label}' },`,
    )
    .join('\n')
  const cls = widthClass[v.width] ? ` class="${widthClass[v.width]}"` : ''
  const open = `<Breadcrumbs${cls} :items="[\n${lines}\n  ]"`
  if (!v.icons) return `${open} />`
  return [
    `${open}>`,
    `  <template #prefix="{ item }">`,
    `    <span :class="item.icon" class="mr-1.5 size-4 shrink-0" aria-hidden="true" />`,
    `  </template>`,
    `</Breadcrumbs>`,
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="80px">
    <template #preview="{ values }">
      <Breadcrumbs :class="widthClass[values.width]" :items="itemsFor(values)">
        <template v-if="values.icons" #prefix="{ item }">
          <span
            :class="item.icon"
            class="mr-1.5 size-4 shrink-0"
            aria-hidden="true"
          />
        </template>
      </Breadcrumbs>
    </template>
  </PlaygroundFrame>
</template>

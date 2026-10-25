<script setup lang="ts">
import { Tabs } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const tabs = [
  { value: 'overview', label: 'Overview', iconLeft: 'lucide-layout-dashboard' },
  { value: 'activity', label: 'Activity', iconLeft: 'lucide-activity' },
  { value: 'settings', label: 'Settings', iconLeft: 'lucide-settings' },
]

const knobs: Knob[] = [
  {
    name: 'variant',
    type: 'tabs',
    options: ['underline', 'subtle', 'ghost', 'browser-tab'].map((v) => ({
      label: v,
      value: v,
    })),
    default: 'underline',
  },
  {
    name: 'size',
    type: 'tabs',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
    ],
    default: 'sm',
  },
  {
    name: 'edge',
    type: 'tabs',
    options: [
      { label: 'start', value: 'start' },
      { label: 'end', value: 'end' },
    ],
    default: 'start',
    // `edge` only changes the browser-tab variant, and only when vertical.
    visibleWhen: (v) => v.variant === 'browser-tab' && v.vertical,
  },
  { name: 'vertical', type: 'switch', default: false },
  { name: 'icons', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const items = tabsFor(v.icons)
    .map((t) =>
      'iconLeft' in t
        ? `    { value: '${t.value}', label: '${t.label}', iconLeft: '${(t as any).iconLeft}' },`
        : `    { value: '${t.value}', label: '${t.label}' },`,
    )
    .join('\n')
  const attrs: string[] = []
  if (v.variant !== 'underline') attrs.push(`variant="${v.variant}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.vertical) attrs.push('vertical')
  if (showsEdge(v) && v.edge !== 'start') attrs.push(`edge="${v.edge}"`)
  attrs.push(`:tabs="[\n${items}\n  ]"`)
  return [
    '<Tabs',
    '  v-model="tab"',
    ...attrs.map((a) => '  ' + a),
    '>',
    '  <template #tab-panel="{ tab }">',
    `    <div class="${panelClass(v)} text-ink-gray-7">`,
    '      {{ tab.label }} content',
    '    </div>',
    '  </template>',
    '</Tabs>',
  ].join('\n')
}

function showsEdge(v: Record<string, any>) {
  return v.variant === 'browser-tab' && v.vertical
}

function panelClass(v: Record<string, any>) {
  return v.vertical ? 'ps-3' : 'pt-3'
}

function tabsFor(icons: boolean) {
  return icons ? tabs : tabs.map((t) => ({ value: t.value, label: t.label }))
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="220px">
    <template #preview="{ values }">
      <div class="w-full max-w-md">
        <Tabs
          :tabs="tabsFor(values.icons)"
          :variant="values.variant"
          :size="values.size"
          :vertical="values.vertical"
          :edge="showsEdge(values) ? values.edge : undefined"
        >
          <template #tab-panel="{ tab }">
            <div
              class="min-h-[80px] text-base text-ink-gray-7"
              :class="panelClass(values)"
            >
              {{ tab.label }} content
            </div>
          </template>
        </Tabs>
      </div>
    </template>
  </PlaygroundFrame>
</template>

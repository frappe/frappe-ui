<script setup lang="ts">
import { Tabs } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const tabs = [
  { label: 'Overview', icon: 'lucide-layout-dashboard' },
  { label: 'Activity', icon: 'lucide-activity' },
  { label: 'Settings', icon: 'lucide-settings' },
]

const knobs: Knob[] = [
  { name: 'vertical', type: 'switch', default: false },
  { name: 'icons', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const items = (v.icons ? tabs : tabs.map((t) => ({ label: t.label })))
    .map((t) =>
      'icon' in t
        ? `    { label: '${t.label}', icon: '${(t as any).icon}' },`
        : `    { label: '${t.label}' },`,
    )
    .join('\n')
  const attrs: string[] = []
  if (v.vertical) attrs.push('vertical')
  attrs.push(`:tabs="[\n${items}\n  ]"`)
  return [
    '<Tabs',
    ...attrs.map((a) => '  ' + a),
    '>',
    '  <template #tab-panel="{ tab }">',
    '    <div class="p-4 text-ink-gray-7">{{ tab.label }} content</div>',
    '  </template>',
    '</Tabs>',
  ].join('\n')
}

function tabsFor(icons: boolean) {
  return icons ? tabs : tabs.map((t) => ({ label: t.label }))
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="220px">
    <template #preview="{ values }">
      <div
        class="w-full max-w-md overflow-hidden rounded-lg border border-outline-gray-1"
        :class="values.vertical ? 'h-[200px]' : 'h-[160px]'"
      >
        <Tabs :tabs="tabsFor(values.icons)" :vertical="values.vertical">
          <template #tab-panel="{ tab }">
            <div class="p-4 text-base text-ink-gray-7">
              {{ tab.label }} content
            </div>
          </template>
        </Tabs>
      </div>
    </template>
  </PlaygroundFrame>
</template>

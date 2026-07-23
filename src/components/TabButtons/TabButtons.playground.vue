<script setup lang="ts">
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  {
    name: 'type',
    type: 'tabs',
    default: 'subtle',
    options: [
      { label: 'subtle', value: 'subtle' },
      { label: 'ghost', value: 'ghost' },
      { label: 'underline', value: 'underline' },
      { label: 'browser-tab', value: 'browser-tab' },
    ],
  },
  {
    name: 'size',
    type: 'tabs',
    default: 'sm',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
    ],
  },
  { name: 'vertical', type: 'switch', default: false },
  { name: 'prefix', type: 'switch', default: false },
  { name: 'suffix', type: 'switch', default: false },
]

const modelValue = ref('activity')

const options = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Settings', value: 'settings' },
]

const iconByValue: Record<string, string> = {
  overview: 'lucide-home',
  activity: 'lucide-activity',
  settings: 'lucide-settings',
}

const countByValue: Record<string, number> = {
  overview: 8,
  activity: 14,
  settings: 2,
}

function buildCode(v: Record<string, any>) {
  const attrs = [`v-model="tab"`, `:options="options"`]
  if (v.type !== 'subtle') attrs.push(`type="${v.type}"`)
  if (v.size !== 'sm') attrs.push(`size="${v.size}"`)
  if (v.vertical) attrs.push('vertical')

  const hasSlots = v.prefix || v.suffix

  return [
    '<' + 'script setup>',
    "import { ref } from 'vue'",
    "import { TabButtons } from 'frappe-ui'",
    '',
    "const tab = ref('activity')",
    'const options = [',
    ...options.map(
      (option) => `  { label: '${option.label}', value: '${option.value}' },`,
    ),
    ']',
    '</' + 'script>',
    '',
    '<' + 'template>',
    '  <' + 'TabButtons',
    ...attrs.map((attr) => `    ${attr}`),
    hasSlots ? '  >' : '  />',
    ...(v.prefix
      ? ['    <template #prefix><span class="lucide-star" /></template>']
      : []),
    ...(v.suffix ? ['    <template #suffix><span>14</span></template>'] : []),
    ...(hasSlots ? ['  </TabButtons>'] : []),
    '</' + 'template>',
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="220px">
    <template #preview="{ values }">
      <TabButtons
        v-model="modelValue"
        :options="options"
        :type="values.type"
        :size="values.size"
        :vertical="values.vertical"
      >
        <template v-if="values.prefix" #prefix="{ button }">
          <span
            :class="iconByValue[String(button.modelValue)]"
            class="size-4 shrink-0"
          />
        </template>
        <template v-if="values.suffix" #suffix="{ button }">
          <span
            class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
          >
            {{ countByValue[String(button.modelValue)] }}
          </span>
        </template>
      </TabButtons>
    </template>
  </PlaygroundFrame>
</template>

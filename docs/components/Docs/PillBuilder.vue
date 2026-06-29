<script setup lang="ts">
import { computed } from 'vue'
import { Pill } from 'frappe-ui'
import ComponentPlayground, { type Knob } from './ComponentPlayground.vue'

const knobs: Knob[] = [
  { name: 'label', type: 'text', default: 'Tab' },
  {
    name: 'variant',
    type: 'tabs',
    default: 'default',
    options: [
      { label: 'default', value: 'default' },
      { label: 'outline', value: 'outline' },
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
  { name: 'active', type: 'switch', default: true },
  { name: 'prefix', type: 'switch', default: false },
  { name: 'suffix', type: 'switch', default: false },
]

function browserTabBase(variant: string) {
  return variant === 'browser-tab' ? 'default' : 'none'
}

function buildCode(v: Record<string, any>) {
  const attrs = [`label="${v.label}"`, `variant="${v.variant}"`]
  if (v.size !== 'md') attrs.push(`size="${v.size}"`)
  if (v.active) attrs.push('active')
  if (v.variant === 'browser-tab') attrs.push('browser-tab-base="default"')

  const slots: string[] = []
  if (v.prefix) {
    slots.push('  <template #prefix><span class="lucide-star" /></template>')
  }
  if (v.suffix) {
    slots.push('  <template #suffix><span>14</span></template>')
  }

  if (!slots.length) {
    return ['<Pill', ...attrs.map((a) => `  ${a}`), '/>'].join('\n')
  }
  return ['<Pill', ...attrs.map((a) => `  ${a}`), '>', ...slots, '</Pill>'].join('\n')
}
</script>

<template>
  <ComponentPlayground :knobs="knobs" :code="buildCode">
    <template #preview="{ values }">
      <div
        :class="
          values.variant === 'underline' || values.variant === 'browser-tab'
            ? 'border-b border-outline-gray-2'
            : ''
        "
      >
        <Pill
          :label="values.label"
          :variant="values.variant"
          :size="values.size"
          :active="values.active"
          :browser-tab-base="browserTabBase(values.variant)"
        >
          <template v-if="values.prefix" #prefix>
            <span class="lucide-star size-4 shrink-0" aria-hidden="true" />
          </template>
          <template v-if="values.suffix" #suffix>
            <span
              class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
              >14</span
            >
          </template>
        </Pill>
      </div>
    </template>
  </ComponentPlayground>
</template>

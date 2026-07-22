<script setup lang="ts">
import { Divider } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  {
    name: 'orientation',
    type: 'tabs',
    default: 'horizontal',
    options: [
      { label: 'horizontal', value: 'horizontal' },
      { label: 'vertical', value: 'vertical' },
    ],
  },
  {
    name: 'position',
    type: 'tabs',
    default: 'center',
    options: [
      { label: 'start', value: 'start' },
      { label: 'center', value: 'center' },
      { label: 'end', value: 'end' },
    ],
  },
  { name: 'withAction', type: 'switch', default: false },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = []
  if (v.orientation !== 'horizontal')
    attrs.push(`orientation="${v.orientation}"`)
  if (v.position !== 'center') attrs.push(`position="${v.position}"`)
  if (v.withAction) attrs.push(`:action="{ label: 'Add row' }"`)
  if (!attrs.length) return '<Divider />'
  return ['<Divider', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="140px">
    <template #preview="{ values }">
      <div
        :class="
          values.orientation === 'vertical'
            ? 'flex items-stretch gap-4 h-24'
            : 'w-full max-w-sm'
        "
      >
        <template v-if="values.orientation === 'vertical'">
          <span class="text-sm text-ink-gray-6 self-center">Before</span>
          <Divider
            orientation="vertical"
            :position="values.position"
            flex-item
            :action="values.withAction ? { label: 'Add row' } : undefined"
          />
          <span class="text-sm text-ink-gray-6 self-center">After</span>
        </template>
        <Divider
          v-else
          :position="values.position"
          :action="values.withAction ? { label: 'Add row' } : undefined"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>

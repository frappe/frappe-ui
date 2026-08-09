<script setup lang="ts">
import { KeyboardShortcut } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'combo', type: 'text', default: 'Mod+K', width: '10rem' },
  { name: 'bg', type: 'switch', default: false },
  { name: 'showPlus', type: 'switch', default: true },
  { name: 'useIcons', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.combo) attrs.push(`combo="${v.combo}"`)
  if (v.bg) attrs.push('bg')
  if (!v.showPlus) attrs.push(':show-plus="false"')
  if (!v.useIcons) attrs.push(':use-icons="false"')
  return ['<KeyboardShortcut', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="80px">
    <template #preview="{ values }">
      <KeyboardShortcut
        :combo="values.combo || undefined"
        :bg="values.bg"
        :show-plus="values.showPlus"
        :use-icons="values.useIcons"
      />
    </template>
  </PlaygroundFrame>
</template>

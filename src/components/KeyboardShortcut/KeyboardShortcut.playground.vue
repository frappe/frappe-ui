<script setup lang="ts">
import { KeyboardShortcut } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  { name: 'combo', type: 'text', default: 'Mod+K' },
  { name: 'bg', type: 'switch', default: false },
  { name: 'useIcons', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  if (v.combo) attrs.push(`combo="${v.combo}"`)
  attrs.push(':show-plus="false"')
  if (v.bg) attrs.push('bg')
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
        :use-icons="values.useIcons"
        :show-plus="false"
      />
    </template>
  </PlaygroundFrame>
</template>

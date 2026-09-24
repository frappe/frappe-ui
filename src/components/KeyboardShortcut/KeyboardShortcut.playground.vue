<script setup lang="ts">
import { KeyboardShortcut } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  {
    name: 'combo',
    type: 'tabs',
    // One of each kind: an icon modifier, stacked modifiers, two text keys
    // (joined by +), keys drawn as icons, a punctuation key and a single key.
    options: [
      'Mod+K',
      'Mod+Shift+P',
      'Ctrl+K',
      'Shift+Enter',
      'Alt+ArrowUp',
      'Mod+Backspace',
      'Mod+Slash',
      'Escape',
    ].map((combo) => ({ label: combo, value: combo })),
    default: 'Mod+K',
  },
  { name: 'bg', type: 'switch', default: false },
  { name: 'useIcons', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const attrs = []
  attrs.push(`combo="${v.combo}"`)
  if (v.bg) attrs.push('bg')
  if (!v.useIcons) attrs.push(':use-icons="false"')
  return ['<KeyboardShortcut', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="80px">
    <template #preview="{ values }">
      <KeyboardShortcut
        :combo="values.combo"
        :bg="values.bg"
        :use-icons="values.useIcons"
      />
    </template>
  </PlaygroundFrame>
</template>

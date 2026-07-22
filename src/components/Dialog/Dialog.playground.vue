<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, Button } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const open = ref(false)

const knobs: Knob[] = [
  { name: 'title', type: 'text', default: 'Delete project', width: '14rem' },
  {
    name: 'message',
    type: 'text',
    default:
      'This will permanently remove the project. This action cannot be undone.',
    width: '22rem',
  },
  {
    name: 'size',
    type: 'tabs',
    default: 'lg',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
      { label: 'xl', value: 'xl' },
      { label: '2xl', value: '2xl' },
    ],
  },
  {
    name: 'position',
    type: 'tabs',
    default: 'center',
    options: [
      { label: 'center', value: 'center' },
      { label: 'top', value: 'top' },
    ],
  },
  { name: 'icon', type: 'switch', default: false },
  { name: 'actions', type: 'switch', default: true },
  { name: 'dismissible', type: 'switch', default: true },
  { name: 'showCloseButton', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const attrs: string[] = [`title="${v.title}"`, `message="${v.message}"`]
  if (v.size !== 'lg') attrs.push(`size="${v.size}"`)
  if (v.position !== 'center') attrs.push(`position="${v.position}"`)
  if (v.icon) attrs.push(`:icon="{ name: 'lucide-trash-2', theme: 'red' }"`)
  if (v.actions) {
    attrs.push(`:actions="[
    { label: 'Cancel' },
    { label: 'Delete', variant: 'solid', theme: 'red' },
  ]"`)
  }
  if (!v.dismissible) attrs.push(':dismissible="false"')
  if (!v.showCloseButton) attrs.push(':show-close-button="false"')
  attrs.push('v-model:open="open"')
  return ['<Dialog', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}

function actionsFor(enabled: boolean) {
  if (!enabled) return undefined
  return [
    { label: 'Cancel' },
    { label: 'Delete', variant: 'solid', theme: 'red' },
  ] as any
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="160px">
    <template #preview="{ values }">
      <Button label="Open dialog" @click="open = true" />
      <Dialog
        v-model:open="open"
        :title="values.title"
        :message="values.message"
        :size="values.size"
        :position="values.position"
        :icon="
          values.icon ? { name: 'lucide-trash-2', theme: 'red' } : undefined
        "
        :actions="actionsFor(values.actions)"
        :dismissible="values.dismissible"
        :show-close-button="values.showCloseButton"
      />
    </template>
  </PlaygroundFrame>
</template>

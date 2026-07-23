<script setup lang="ts">
import { ErrorMessage } from 'frappe-ui'
import type { Knob } from 'frappe-ui/vitepress'

const knobs: Knob[] = [
  {
    name: 'message',
    type: 'text',
    default: 'Email is required.',
    width: '20rem',
  },
]

function buildCode(v: Record<string, any>) {
  return `<ErrorMessage message="${v.message}" />`
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="80px">
    <template #preview="{ values }">
      <ErrorMessage :message="values.message" />
    </template>
  </PlaygroundFrame>
</template>

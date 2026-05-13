<script setup lang="ts">
// Demonstrates the action-layout rules for the declarative `actions` prop:
// - Small dialogs (size `xs` | `sm` | `md`) with a single action render that
//   button full-width.
// - Every other case lays buttons out side-by-side at natural width, right-
//   aligned with a gap, regardless of count.
import { ref } from 'vue'
import { Button, Dialog } from 'frappe-ui'

const single = ref(false)
const multi = ref(false)
const wide = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button @click="single = true">Single (md)</Button>
    <Button @click="multi = true">Two actions (md)</Button>
    <Button @click="wide = true">Single (xl)</Button>
  </div>

  <Dialog
    v-model:open="single"
    size="md"
    title="Subscription updated"
    message="Your plan changes take effect on the next billing cycle."
    :actions="[{ label: 'Got it', variant: 'solid' }]"
  />

  <Dialog
    v-model:open="multi"
    size="md"
    title="Discard changes?"
    message="Unsaved edits will be lost if you leave now."
    :actions="[
      { label: 'Keep editing' },
      { label: 'Discard', theme: 'red', variant: 'solid' },
    ]"
  />

  <Dialog
    v-model:open="wide"
    size="xl"
    title="Report generated"
    message="Your export is ready to download. Wider dialogs never stretch a lone action across the full width."
    :actions="[{ label: 'Download', variant: 'solid' }]"
  />
</template>

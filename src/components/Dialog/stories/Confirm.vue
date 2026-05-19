<script setup lang="ts">
// Adapted from gameplan/SpaceOptions.vue — "Delete space" confirm.
// Uses declarative `actions` with a `{ close }` context, `theme: 'red'`,
// `dismissible: false` so the user must pick an action, and a loading
// flag wired to the in-flight delete.
import { ref } from 'vue'
import { Button, Dialog } from 'frappe-ui'

const open = ref(false)
const deleting = ref(false)

async function deleteSpace({ close }: { close: () => void }) {
  deleting.value = true
  try {
    await new Promise((r) => setTimeout(r, 800))
  } finally {
    deleting.value = false
    close()
  }
}
</script>

<template>
  <Button @click="open = true">Delete space…</Button>

  <Dialog
    v-model:open="open"
    title="Delete space"
    message="This will permanently delete the space along with 12 discussions and 4 tasks. This action cannot be undone."
    :icon="{ name: 'lucide-alert-triangle', theme: 'red' }"
    :dismissible="false"
    :show-close-button="false"
    :actions="[
      { label: 'Cancel' },
      {
        label: 'Delete',
        theme: 'red',
        variant: 'solid',
        loading: deleting,
        onClick: deleteSpace,
      },
    ]"
  />
</template>

<script setup lang="ts">
// The Toast page: a controller in the middle of the panel, and the toasts it
// fires stacking up from the bottom-right corner.
//
// The toasts are frappe-ui's own — `toast()` from the library, rendered by
// `ToastProvider` (vue-sonner underneath), so what shows here is exactly what
// an app gets: the 360px surface-gray-9 card, its icon, the blue action and
// the close button. Each type fires on tap; the switches decide whether that
// toast carries a description and an action.
import { ref } from 'vue'
import { Button, Switch, toast, ToastProvider } from '../../../src'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'plain'

const TYPES: {
  value: ToastType
  label: string
  title: string
  blurb: string
}[] = [
  {
    value: 'success',
    label: 'Success',
    title: 'All changes saved',
    blurb: 'Your ticket layout is live for the team.',
  },
  {
    value: 'error',
    label: 'Error',
    title: 'Could not save changes',
    blurb: 'The connection dropped. Nothing was lost.',
  },
  {
    value: 'warning',
    label: 'Warning',
    title: 'Trial ends in 7 days',
    blurb: 'Add a payment method to keep your apps.',
  },
  {
    value: 'info',
    label: 'Info',
    title: 'A new version is available',
    blurb: 'Reload the page to pick up the release.',
  },
  {
    value: 'plain',
    label: 'Plain',
    title: 'Link copied to clipboard',
    blurb: 'Anyone with the link can view the ticket.',
  },
]

const withDescription = ref(true)
const withAction = ref(true)

function show(t: (typeof TYPES)[number]) {
  const options = {
    description: withDescription.value ? t.blurb : undefined,
    action: withAction.value
      ? { label: 'Undo', onClick: () => undefined }
      : undefined,
  }
  // `plain` is the type without an icon — the library's bare `toast()`.
  if (t.value === 'plain') toast(t.title, options)
  else toast[t.value](t.title, options)
}
</script>

<template>
  <div class="relative h-full">
    <div class="absolute inset-0 flex items-center justify-center px-5 py-20">
      <!-- the controller -->
      <div
        class="flex w-[360px] flex-col gap-4 rounded-6 border border-outline-gray-1 bg-surface-elevation-2 p-4 dark:border-outline-gray-2 dark:bg-surface-elevation-1"
      >
        <div class="flex flex-col gap-1">
          <p class="text-lg-medium text-ink-gray-8">Toast</p>
          <p class="text-p-sm text-ink-gray-5">
            Tap a type and it rises from the bottom-right corner.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Switch
            v-model="withDescription"
            size="sm"
            label="Description"
            description="A second line under the title"
          />
          <Switch
            v-model="withAction"
            size="sm"
            label="Action"
            description="An Undo button beside the close"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            v-for="t in TYPES"
            :key="t.value"
            :variant="t.value === 'success' ? 'solid' : 'subtle'"
            size="sm"
            @click="show(t)"
          >
            {{ t.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- frappe-ui's toaster: one per page, fixed to the viewport's corner -->
    <ToastProvider />
  </div>
</template>

<style>
/* The shell's theme / sidebar / fullscreen group sits 20px from the same
   corner and is 48px tall, so the stack starts above it. The toaster writes
   its offsets inline, hence `!important`. */
[data-sonner-toaster][data-y-position='bottom'] {
  --offset-bottom: 84px !important;
}
</style>

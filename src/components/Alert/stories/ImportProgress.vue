<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// Slot overrides: #prefix swaps the status icon for a spinner, and
// #description carries rich text.
const showImportBanner = ref(true)

function viewProgress() {
  console.log('open import log')
}
</script>

<template>
  <div class="w-full max-w-sm">
    <Alert
      v-if="showImportBanner"
      title="Contact import is in progress"
      theme="blue"
      :primary-action="{ label: 'View progress', onClick: viewProgress }"
      :secondary-action="{ label: 'Dismiss', onClick: ({ dismiss }) => dismiss() }"
      @dismiss="showImportBanner = false"
    >
      <template #prefix>
        <span
          class="lucide-loader-circle size-4 animate-spin text-ink-blue-6"
          aria-hidden="true"
        />
      </template>
      <template #description>
        Importing <span class="font-medium text-ink-gray-7">contacts.csv</span> —
        large imports may take a few minutes.
      </template>
    </Alert>
    <button
      v-else
      class="text-sm text-ink-gray-5 underline"
      @click="showImportBanner = true"
    >
      Bring the banner back
    </button>
  </div>
</template>

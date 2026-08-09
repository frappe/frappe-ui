<script setup>
import { ref } from 'vue'
import { Alert, Spinner } from 'frappe-ui'

// Slot overrides: #prefix swaps the status icon for a Spinner, and
// #description carries rich text.
const showImportBanner = ref(true)
const status = ref('')

function viewProgress() {
  status.value = 'Import log opened'
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <Alert
      v-if="showImportBanner"
      title="Contact import is in progress"
      theme="blue"
      :primary-action="{ label: 'View progress', onClick: viewProgress }"
      :secondary-action="{ label: 'Dismiss', onClick: ({ dismiss }) => dismiss() }"
      @dismiss="showImportBanner = false"
    >
      <template #prefix>
        <Spinner size="md" class="text-ink-blue-5" />
      </template>
      <template #description>
        Importing <span class="font-medium text-ink-gray-7">contacts.csv</span> —
        large imports may take a few minutes.
      </template>
    </Alert>
    <button
      v-else
      class="self-start text-sm text-ink-gray-5 underline"
      @click="showImportBanner = true"
    >
      Bring the banner back
    </button>
    <p v-if="status" class="text-sm text-ink-gray-5">{{ status }}</p>
  </div>
</template>

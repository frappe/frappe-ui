<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// Banners stack a description and two actions. A "Dismiss" secondary action
// calls context.dismiss(); the parent hides the alert with v-if. Primary
// actions report what they did in the status line below the stack.
const showSla = ref(true)
const showSync = ref(true)
const showDuplicate = ref(true)
const status = ref('')

function reset() {
  showSla.value = true
  showSync.value = true
  showDuplicate.value = true
  status.value = ''
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <Alert
      v-if="showSla"
      title="SLA due soon for #58281"
      description="The SLA for #58281 will breach in 1 hour"
      theme="amber"
      :primary-action="{
        label: 'Respond now',
        onClick: () => (status = 'Ticket #58281 opened'),
      }"
      :secondary-action="{ label: 'Dismiss', onClick: ({ dismiss }) => dismiss() }"
      @dismiss="showSla = false"
    />
    <Alert
      v-if="showSync"
      title="Sync completed with issues"
      description="96 of 100 contacts were synced."
      theme="amber"
      :primary-action="{
        label: 'Review',
        onClick: () => (status = 'Sync report opened'),
      }"
      :secondary-action="{ label: 'Dismiss', onClick: ({ dismiss }) => dismiss() }"
      @dismiss="showSync = false"
    />
    <Alert
      v-if="showDuplicate"
      title="Duplicate lead detected"
      description="A similar lead already exists."
      theme="amber"
      :primary-action="{
        label: 'Review duplicate',
        onClick: () => (status = 'Duplicate lead opened'),
      }"
      :secondary-action="{
        label: 'Continue anyway',
        onClick: ({ dismiss }) => ((status = 'Lead created'), dismiss()),
      }"
      @dismiss="showDuplicate = false"
    />
    <p v-if="status" class="text-sm text-ink-gray-5">{{ status }}</p>
    <button
      v-if="!showSla || !showSync || !showDuplicate"
      class="self-start text-sm text-ink-gray-5 underline"
      @click="reset()"
    >
      Bring the banners back
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// One-line status rows. The theme colors the icon and the action label;
// the container stays neutral. Actions report in the status line below.
const status = ref('')

function open(target) {
  status.value = `${target} opened`
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <Alert
      title="SLA timer has started"
      theme="blue"
      :primary-action="{ label: 'View SLA', onClick: () => open('SLA details') }"
    />
    <Alert
      title="Failed to create lead"
      theme="red"
      :primary-action="{ label: 'Try again', onClick: () => open('Lead form') }"
    />
    <Alert
      title="Meeting scheduled"
      theme="green"
      :primary-action="{ label: 'Open calendar', onClick: () => open('Calendar') }"
    />
    <Alert
      title="Storage is almost full"
      theme="amber"
      :primary-action="{ label: 'Manage', onClick: () => open('Storage settings') }"
    />
    <p v-if="status" class="text-sm text-ink-gray-5">{{ status }}</p>
  </div>
</template>

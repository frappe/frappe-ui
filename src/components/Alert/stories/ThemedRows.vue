<script setup>
import { Alert } from 'frappe-ui'

// One-line status rows. The theme colors the icon and the action label;
// the container stays neutral.
function open(target) {
  console.log('open', target)
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <Alert
      title="SLA timer has started"
      theme="blue"
      :primary-action="{ label: 'View SLA', onClick: () => open('sla') }"
    />
    <Alert
      title="Failed to create lead"
      theme="red"
      :primary-action="{ label: 'Try again', onClick: () => open('lead-form') }"
    />
    <Alert
      title="Meeting scheduled"
      theme="green"
      :primary-action="{ label: 'Open calendar', onClick: () => open('calendar') }"
    />
    <Alert
      title="Storage is almost full"
      theme="amber"
      :primary-action="{ label: 'Manage', onClick: () => open('storage') }"
    />
  </div>
</template>

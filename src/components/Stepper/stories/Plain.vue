<script setup lang="ts">
// The default vertical list with nothing extra: numbers and labels.
import { Stepper } from 'frappe-ui'

const steps = [
  { value: 'account', label: 'Account' },
  { value: 'workspace', label: 'Workspace' },
  { value: 'invite', label: 'Invite team' },
  { value: 'import', label: 'Import data' },
  { value: 'review', label: 'Review' },
]
</script>

<template>
  <div class="w-56">
    <Stepper :steps="steps" model-value="invite" vertical />
  </div>
</template>

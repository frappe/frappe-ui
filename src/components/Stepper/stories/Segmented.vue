<script setup lang="ts">
// The horizontal default: the stock Progress with one interval per step.
import { Stepper } from 'frappe-ui'

const steps = [
  { value: 'account', label: 'Account' },
  { value: 'workspace', label: 'Workspace' },
  { value: 'invite', label: 'Invite team', skipped: true },
  { value: 'import', label: 'Import data' },
  { value: 'review', label: 'Review' },
]
</script>

<template>
  <div class="w-full max-w-2xl">
    <Stepper :steps="steps" model-value="import" />
  </div>
</template>

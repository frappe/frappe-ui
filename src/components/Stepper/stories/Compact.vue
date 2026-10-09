<script setup lang="ts">
// The small size for a sidebar or run log, with each step's duration.
import { Stepper } from 'frappe-ui'

const steps = [
  { value: 'fetch', label: 'Fetch sources', meta: '0:42' },
  { value: 'install', label: 'Install dependencies', meta: '1:08' },
  { value: 'build', label: 'Build assets', meta: '0:31' },
  { value: 'migrate', label: 'Migrate database' },
  { value: 'deploy', label: 'Deploy' },
]
</script>

<template>
  <div class="w-64">
    <Stepper :steps="steps" model-value="build" size="sm" vertical loading />
  </div>
</template>

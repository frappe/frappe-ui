<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

const value = ref('frappe-ui')

const repos = [
  'gameplan',
  'frappe-ui',
  'frappe',
  'erpnext',
  'helpdesk',
  'crm',
  'wiki',
  'insights',
]
</script>

<template>
  <div class="grid gap-3">
    <Combobox
      v-model="value"
      :options="repos"
      placeholder="Pick a repo"
      class="w-64"
      open-on-focus
    />

    <div class="text-sm text-ink-gray-5">
      Selected: <code class="text-ink-gray-7">{{ value || 'None' }}</code>
    </div>
  </div>
</template>

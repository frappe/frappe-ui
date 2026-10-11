<script setup lang="ts">
import { ref } from 'vue'
import { SplitButton, TextInput } from 'frappe-ui'

// A list toolbar. CSV is what most people export, so it's the button;
// the other formats wait on the chevron.
const exported = ref('')
const options = [
  {
    label: 'Export as Excel',
    icon: 'lucide-sheet',
    onClick: () => (exported.value = 'Excel'),
  },
  {
    label: 'Export as PDF',
    icon: 'lucide-file-text',
    onClick: () => (exported.value = 'PDF'),
  },
]
</script>

<template>
  <div class="flex w-full max-w-md items-center gap-2 p-3">
    <TextInput
      class="flex-1"
      placeholder="Search invoices"
      aria-label="Search invoices"
    />
    <SplitButton
      label="Export CSV"
      icon-left="lucide-download"
      menu-label="Other export formats"
      variant="outline"
      :options="options"
      @click="exported = 'CSV'"
    />
  </div>
</template>

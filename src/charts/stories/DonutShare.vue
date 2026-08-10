<script setup lang="ts">
import { DonutChart } from 'frappe-ui/charts'

const storage = [
  { type: 'Attachments', gigabytes: 812 },
  { type: 'Backups', gigabytes: 604 },
  { type: 'Images', gigabytes: 337 },
  { type: 'Logs', gigabytes: 149 },
  { type: 'Everything else', gigabytes: 62 },
]

const size = (gigabytes: number) =>
  gigabytes >= 1024 ? `${(gigabytes / 1024).toFixed(1)} TB` : `${gigabytes} GB`
</script>

<template>
  <div class="h-80 w-full">
    <DonutChart
      :data="storage"
      category="type"
      value="gigabytes"
      center-label="stored"
      :format="size"
      title="Storage by file type"
      subtitle="Across every workspace"
    />
  </div>
</template>

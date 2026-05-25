<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

// Schedule a nightly cron — 24h format keeps the ops team unambiguous
const cronTime = ref('02:00')
</script>

<template>
  <div class="flex w-72 flex-col gap-1.5">
    <span class="text-sm text-ink-gray-7">Nightly backup runs at</span>
    <TimePicker
      v-model="cronTime"
      :use12Hour="false"
      :interval="30"
    >
      <template #prefix>
        <span class="lucide-server-cog size-4 text-ink-gray-5" />
      </template>
    </TimePicker>
    <span class="text-xs text-ink-gray-5">UTC, every day at {{ cronTime }}</span>
  </div>
</template>

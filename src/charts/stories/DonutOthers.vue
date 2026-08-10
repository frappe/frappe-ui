<script setup lang="ts">
import { ref } from 'vue'
import { DonutChart } from 'frappe-ui/charts'
import type { DonutSliceEvent } from 'frappe-ui/charts'

const sessionsByChannel = [
  { channel: 'Organic search', sessions: 39900 },
  { channel: 'Paid social', sessions: 21400 },
  { channel: 'Email', sessions: 16800 },
  { channel: 'Direct', sessions: 14700 },
  { channel: 'Referral & affiliate', sessions: 8900 },
  { channel: 'Marketplace', sessions: 4500 },
  { channel: 'Events', sessions: 3110 },
  { channel: 'Print', sessions: 1490 },
]

const slice = ref<DonutSliceEvent | null>(null)
</script>

<template>
  <div class="flex h-96 w-full flex-col gap-2">
    <div class="min-h-0 flex-1">
      <DonutChart
        :data="sessionsByChannel"
        category="channel"
        value="sessions"
        :max-slices="4"
        center-label="sessions"
        title="Traffic by channel"
        subtitle="Sessions in July 2026"
        @select="slice = $event"
      />
    </div>
    <p class="text-p-sm text-ink-gray-5">
      <template v-if="slice">
        Selected {{ slice.name }} · {{ Math.round(slice.percent) }}% ·
        {{ slice.rows.length }} row(s) behind it
      </template>
      <template v-else
        >Select a slice — Others carries every row it groups.</template
      >
    </p>
  </div>
</template>

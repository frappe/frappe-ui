<script setup lang="ts">
import { ref } from 'vue'
import { BarChart } from 'frappe-ui/charts'
import type { ChartDatapointEvent } from 'frappe-ui/charts'

const channels = [
  { channel: 'Organic search', visits: 39900, conversions: 1820 },
  { channel: 'Paid social', visits: 21400, conversions: 1410 },
  { channel: 'Email', visits: 16800, conversions: 990 },
  { channel: 'Direct', visits: 14700, conversions: 640 },
  { channel: 'Referral', visits: 8900, conversions: 310 },
]

const clicked = ref<ChartDatapointEvent | null>(null)
</script>

<template>
  <div class="flex h-96 w-full flex-col gap-2">
    <div class="min-h-0 flex-1">
      <BarChart
        :data="channels"
        x="channel"
        :y="['visits', 'conversions']"
        :palette="['#7c3aed', '#0ea5e9']"
        :series-config="{ conversions: { color: '#f59e0b' } }"
        title="Visits and conversions"
        subtitle="A palette list, with conversions pinned to its own color"
        @datapoint-click="clicked = $event"
      />
    </div>
    <p class="text-p-sm text-ink-gray-5">
      <template v-if="clicked">
        Clicked {{ clicked.seriesName }} · {{ clicked.row.channel }} ·
        {{ clicked.value.toLocaleString('en-US') }}
      </template>
      <template v-else>Click a bar.</template>
    </p>
  </div>
</template>

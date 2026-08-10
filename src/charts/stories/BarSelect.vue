<script setup lang="ts">
import { ref } from 'vue'
import { BarChart } from 'frappe-ui/charts'
import type { ChartDatapointEvent } from 'frappe-ui/charts'

const warehouses = [
  { warehouse: 'Pune', picked: 4820, shipped: 4410 },
  { warehouse: 'Bengaluru', picked: 3960, shipped: 3720 },
  { warehouse: 'Delhi NCR', picked: 3140, shipped: 2680 },
  { warehouse: 'Chennai', picked: 2270, shipped: 2190 },
  { warehouse: 'Kolkata', picked: 1480, shipped: 1305 },
]

const selected = ref<ChartDatapointEvent | null>(null)
</script>

<template>
  <div class="flex h-96 w-full flex-col gap-2">
    <div class="min-h-0 flex-1">
      <BarChart
        :data="warehouses"
        x="warehouse"
        :y="['picked', 'shipped']"
        :y-axis="{ title: 'Orders' }"
        title="Orders picked and shipped"
        subtitle="Fulfilment, week of 27 July 2026"
        @select="selected = $event"
      />
    </div>
    <p class="text-p-sm text-ink-gray-5">
      <template v-if="selected">
        Selected {{ selected.seriesName }} · {{ selected.row.warehouse }} ·
        {{ selected.value.toLocaleString('en-US') }}
      </template>
      <template v-else>Select a bar.</template>
    </p>
  </div>
</template>

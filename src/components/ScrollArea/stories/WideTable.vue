<script setup lang="ts">
import { ScrollArea } from 'frappe-ui'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const regions = [
  'North America',
  'South America',
  'Western Europe',
  'Eastern Europe',
  'Middle East',
  'Africa',
  'South Asia',
  'East Asia',
  'Southeast Asia',
  'Oceania',
  'Central America',
  'Caribbean',
]
const rows = regions.map((region, r) => ({
  region,
  values: months.map((_, m) => ((r * 7 + m * 13) % 90) + 10),
}))
</script>

<template>
  <ScrollArea
    orientation="both"
    class="h-72 w-full max-w-lg rounded-5 border bg-surface-base"
  >
    <table class="text-base text-ink-gray-8">
      <thead>
        <tr class="border-b text-ink-gray-5">
          <th class="whitespace-nowrap px-3 py-2 text-left font-medium">
            Region
          </th>
          <th
            v-for="month in months"
            :key="month"
            class="px-3 py-2 text-right font-medium"
          >
            {{ month }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.region" class="border-b">
          <td class="whitespace-nowrap px-3 py-2">{{ row.region }}</td>
          <td
            v-for="(value, i) in row.values"
            :key="i"
            class="px-3 py-2 text-right tabular-nums"
          >
            {{ value }}k
          </td>
        </tr>
      </tbody>
    </table>
  </ScrollArea>
</template>

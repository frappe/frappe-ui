<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const period = ref('week')

const periods = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
]
</script>

<template>
  <div class="w-full max-w-md">
    <TabButtons v-model="period" :options="periods" fluid />
  </div>
</template>

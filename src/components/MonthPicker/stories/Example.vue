<script setup lang="ts">
import { ref } from 'vue'
import { MonthPicker } from 'frappe-ui'

// Reviewing a billing statement — month + year is all you need
const statementMonth = ref('')
const reportPeriod = ref('')
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center justify-center !py-20">
    <div class="grid w-full max-w-xl grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-1.5">
        <span class="text-sm text-ink-gray-7">Billing statement</span>
        <MonthPicker
          v-model="statementMonth"
          placeholder="Pick a month"
        />
        <span class="text-xs text-ink-gray-5">
          {{ statementMonth ? `Showing ${statementMonth}` : 'No month selected' }}
        </span>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="text-sm text-ink-gray-7">Reporting period</span>
        <MonthPicker
          v-model="reportPeriod"
          placeholder="Fiscal month"
        />
      </div>
    </div>
  </div>
</template>

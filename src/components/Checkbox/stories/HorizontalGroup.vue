<script setup lang="ts">
import { reactive } from 'vue'
import { Checkbox } from 'frappe-ui'

const settings = reactive({
  inclusiveText: false,
  paymentSchedule: false,
  taxesAsTable: true,
})
</script>

<template>
  <div class="flex flex-col gap-4 items-start w-[32rem]">
    <p class="text-xl-medium text-ink-gray-9">Print settings</p>
    <div class="flex flex-wrap gap-x-8 gap-y-2">
      <Checkbox v-model="settings.inclusiveText" label="Show inclusive text in print" />
      <Checkbox
        v-model="settings.paymentSchedule"
        label="Show payment schedule in print"
      />
      <Checkbox v-model="settings.taxesAsTable" label="Show taxes as table in print" />
    </div>
  </div>
</template>

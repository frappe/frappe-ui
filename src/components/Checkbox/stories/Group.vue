<script setup lang="ts">
import { reactive } from 'vue'
import { Checkbox } from 'frappe-ui'

const settings = reactive({
  paymentDays: true,
  taxApplicable: true,
  deductFullTax: false,
  roundToInteger: false,
  doNotInclude: true,
  removeIfZero: false,
})
</script>

<template>
  <div class="flex flex-col gap-1 items-start w-80">
    <Checkbox v-model="settings.paymentDays" label="Depends on payment days" />
    <Checkbox v-model="settings.taxApplicable" label="Is Tax Applicable" />
    <Checkbox
      v-model="settings.deductFullTax"
      label="Deduct full tax on selected payroll date"
    />
    <Checkbox v-model="settings.roundToInteger" label="Round to the nearest integer" />
    <Checkbox v-model="settings.doNotInclude" label="Do not include in total" disabled />
    <Checkbox v-model="settings.removeIfZero" label="Remove if zero valued" />
  </div>
</template>

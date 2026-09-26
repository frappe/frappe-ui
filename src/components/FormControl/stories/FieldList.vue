<script setup lang="ts">
import { reactive } from 'vue'
import { FormControl } from 'frappe-ui'
import type { FormControlProps } from 'frappe-ui'

interface Field {
  name: string
  type: FormControlProps['type']
  label: string
  options?: string[]
}

// The fields come from data, as they would from a doctype's meta.
const fields: Field[] = [
  { name: 'company', type: 'text', label: 'Company name' },
  {
    name: 'currency',
    type: 'select',
    label: 'Default currency',
    options: ['USD', 'EUR', 'INR'],
  },
  { name: 'fiscalYearStart', type: 'date', label: 'Fiscal year starts' },
  { name: 'address', type: 'textarea', label: 'Address' },
  { name: 'sendReports', type: 'checkbox', label: 'Email monthly reports' },
]

const settings = reactive<Record<string, unknown>>({
  company: 'Acme Inc.',
  currency: 'USD',
  fiscalYearStart: '2026-04-01',
  address: '',
  sendReports: true,
})
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <FormControl
      v-for="field in fields"
      :key="field.name"
      v-model="settings[field.name]"
      :type="field.type"
      :label="field.label"
      :options="field.options"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, Button } from 'frappe-ui'
import { dayjs } from '../../../utils/dayjs'
import type { Dayjs } from 'dayjs'

const basic = ref('')
const controlled = ref('2026-01-15')
const formatted = ref('')
const constrained = ref('')
const noWeekends = ref('')
const keepOpen = ref('')
const ghost = ref('')
const outline = ref('')
const readonlyValue = ref('2026-03-10')
const withCustomActions = ref('')
const sizeSm = ref('')
const sizeLg = ref('')
const withError = ref('')
const withDescription = ref('')
const requiredValue = ref('')
const externallyOpen = ref(false)
const externallyOpenValue = ref('')

const today = dayjs().format('YYYY-MM-DD')
const inThirtyDays = dayjs().add(30, 'day').format('YYYY-MM-DD')

function isWeekend(date: Dayjs) {
  const day = date.day()
  return day === 0 || day === 6
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <DatePicker
      v-model="basic"
      placeholder="Pick a date"
      label="Basic"
      open-on-focus
    />

    <DatePicker
      v-model="controlled"
      label="Pre-filled value"
      placeholder="Select a date"
      open-on-focus
    />

    <DatePicker
      v-model="formatted"
      label="Custom display format"
      placeholder="MMM D, YYYY"
      format="MMM D, YYYY"
    />

    <DatePicker
      v-model="constrained"
      label="Within next 30 days"
      placeholder="minDate / maxDate"
      :min-date="today"
      :max-date="inThirtyDays"
    />

    <DatePicker
      v-model="noWeekends"
      label="Weekdays only"
      placeholder="isDateUnavailable"
      :is-date-unavailable="isWeekend"
    />

    <DatePicker
      v-model="keepOpen"
      label="keepOpen"
      placeholder="Stays open after pick"
      keep-open
    />

    <DatePicker
      v-model="outline"
      label="Outline variant"
      placeholder="outline"
      variant="outline"
    />

    <DatePicker
      v-model="readonlyValue"
      label="Readonly"
      placeholder="Calendar only"
      readonly
    />

    <DatePicker label="Disabled" placeholder="Disabled picker" disabled />

    <DatePicker
      label="Not clearable"
      placeholder="No clear/today/tomorrow"
      :clearable="false"
    />

    <DatePicker
      v-model="sizeSm"
      size="sm"
      label="Small size"
      placeholder="size=sm"
    />

    <DatePicker
      v-model="sizeLg"
      size="lg"
      label="Large size"
      placeholder="size=lg"
    />

    <DatePicker
      v-model="withDescription"
      label="With description"
      description="Helper text appears under the input."
      placeholder="Pick a date"
    />

    <DatePicker
      v-model="requiredValue"
      label="Required field"
      required
      placeholder="An asterisk marks it required"
    />

    <DatePicker
      v-model="withError"
      label="With validation error"
      error="Please select a valid date."
      placeholder="error state"
    />

    <div class="flex flex-col gap-2">
      <Button
        label="Open picker"
        :disabled="externallyOpen"
        @click="externallyOpen = true"
      />
      <DatePicker
        v-model="externallyOpenValue"
        v-model:open="externallyOpen"
        label="Controlled open state"
        :placeholder="externallyOpen ? 'Picker is open' : 'Picker is closed'"
      />
    </div>

    <DatePicker
      v-model="withCustomActions"
      label="Custom footer actions"
      placeholder="Tomorrow / Next week"
    >
      <template #actions="{ selected, setDate, clear }">
        <Button label="Tomorrow" @click="setDate(dayjs().add(1, 'day'))" />
        <Button label="Next week" @click="setDate(dayjs().add(7, 'day'))" />
      </template>
    </DatePicker>
  </div>
</template>

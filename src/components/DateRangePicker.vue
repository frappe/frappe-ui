<template>
  <Popover
    @open="selectCurrentMonthYear"
    class="flex w-full [&>div:first-child]:w-full"
  >
    <template #target="{ togglePopover }">
      <Input
        readonly
        type="text"
        icon-left="calendar"
        :placeholder="placeholder"
        :value="dateValue && formatter ? formatDates(dateValue) : dateValue"
        @focus="!readonly ? togglePopover() : null"
        class="w-full"
        :class="inputClass"
        v-bind="$attrs"
      />
    </template>

    <template #body="{ togglePopover }">
      <!-- Month Switcher -->
      <div
        class="mt-2 w-fit select-none divide-y rounded-lg bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="flex items-center p-1 text-gray-500">
          <Button variant="ghost" class="h-7 w-7" @click="prevMonth">
            <FeatherIcon
              :stroke-width="2"
              name="chevron-left"
              class="h-4 w-4"
            />
          </Button>
          <div class="flex-1 text-center text-base font-medium text-gray-700">
            {{ formattedMonth }}
          </div>
          <Button variant="ghost" class="h-7 w-7" @click="nextMonth">
            <FeatherIcon
              :stroke-width="2"
              name="chevron-right"
              class="h-4 w-4"
            />
          </Button>
        </div>

        <!-- Date Range Inputs -->
        <div class="flex items-center justify-center gap-1 p-1">
          <TextInput class="w-28 text-sm" type="text" v-model="fromDate" />
          <TextInput class="w-28 text-sm" type="text" v-model="toDate" />
        </div>

        <!-- Calendar -->
        <div
          class="flex flex-col items-center justify-center p-1 text-gray-800"
        >
          <div class="flex items-center text-xs uppercase">
            <div
              class="flex h-6 w-8 items-center justify-center text-center"
              v-for="(d, i) in ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']"
              :key="i"
            >
              {{ d }}
            </div>
          </div>
          <div
            class="flex items-center"
            v-for="(week, i) in datesAsWeeks"
            :key="i"
          >
            <div
              v-for="date in week"
              :key="getDateValue(date)"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50"
              :class="{
                'text-gray-400': date.getMonth() !== currentMonth - 1,
                'text-gray-900': date.getMonth() === currentMonth - 1,
                'font-extrabold text-gray-900':
                  getDateValue(date) === getDateValue(today),
                'rounded-none bg-gray-100': isInRange(date),
                'rounded-l-md rounded-r-none bg-gray-800 text-white hover:bg-gray-800':
                  fromDate && getDateValue(date) === getDateValue(fromDate),
                'rounded-r-md bg-gray-800 text-white hover:bg-gray-800':
                  toDate && getDateValue(date) === getDateValue(toDate),
              }"
              @click="() => handleDateClick(date)"
            >
              {{ date.getDate() }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-1 p-1">
          <Button
            :label="'Clear'"
            @click="
              () => {
                clearDates()
                togglePopover()
              }
            "
            :disabled="!fromDate || !toDate"
          />
          <Button
            variant="solid"
            :label="'Apply'"
            :disabled="!fromDate || !toDate"
            @click="
              () => {
                selectDates()
                togglePopover()
              }
            "
          />
        </div>
      </div>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

import Input from './Input.vue'
import Button from './Button.vue'
import Popover from './Popover.vue'
import FeatherIcon from './FeatherIcon.vue'
import TextInput from './TextInput.vue'

import { getDate, getDateValue } from '../utils/dates'
import { useDatePicker } from '../utils/useDatePicker'

import type { DatePickerEmits, DatePickerProps } from './types/DatePicker'

const props = defineProps<DatePickerProps>()
const emit = defineEmits<DatePickerEmits>()

const {
  currentYear,
  currentMonth,
  today,
  datesAsWeeks,
  formattedMonth,
  prevMonth,
  nextMonth,
} = useDatePicker()

const dateValue = computed(() => {
  return props.value ? props.value : props.modelValue
})

const fromDate = ref<string>(dateValue.value ? dateValue.value[0] : '')
const toDate = ref<string>(dateValue.value ? dateValue.value[1] : '')

function handleDateClick(date: Date) {
  if (fromDate.value && toDate.value) {
    fromDate.value = getDateValue(date)
    toDate.value = ''
  } else if (fromDate.value && !toDate.value) {
    toDate.value = getDateValue(date)
  } else {
    fromDate.value = getDateValue(date)
  }
  swapDatesIfNecessary()
}

function swapDatesIfNecessary() {
  if (!fromDate.value || !toDate.value) {
    return
  }

  // if fromDate is greater than toDate, swap them
  let from = getDate(fromDate.value)
  let to = getDate(toDate.value)
  if (from > to) {
    let temp = from
    from = to
    to = temp
  }
  fromDate.value = getDateValue(from)
  toDate.value = getDateValue(to)
}

function selectDates() {
  let val = `${fromDate.value},${toDate.value}`
  if (!fromDate.value && !toDate.value) {
    val = ''
  }
  emit('change', val)
  emit('update:modelValue', val)
}

function selectCurrentMonthYear() {
  let date = toDate.value ? getDate(toDate.value) : today.value
  currentYear.value = date.getFullYear()
  currentMonth.value = date.getMonth() + 1
}

function isInRange(date: Date) {
  if (!fromDate.value || !toDate.value) {
    return false
  }
  return date >= getDate(fromDate.value) && date <= getDate(toDate.value)
}

function formatDates(value: string) {
  if (!value) {
    return ''
  }
  const values = value.split(',')
  return props.formatter
    ? props.formatter(values[0]) + ' to ' + props.formatter(values[1])
    : value
}

function clearDates() {
  fromDate.value = ''
  toDate.value = ''
  selectDates()
}

onMounted(() => selectCurrentMonthYear())
</script>

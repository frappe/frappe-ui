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
        :value="dateValue && formatter ? formatter(dateValue) : dateValue"
        @focus="!readonly ? togglePopover() : null"
        class="w-full"
        :class="inputClass"
        v-bind="$attrs"
      />
    </template>
    <template #body="{ togglePopover }">
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
        <div class="flex items-center justify-center gap-1 p-1">
          <TextInput
            class="text-sm"
            type="text"
            :value="dateValue"
            @change="selectDate(getDate($event.target.value))"
          />
          <Button
            :label="'Today'"
            class="text-sm"
            @click="
              () => {
                selectDate(getDate())
                togglePopover()
              }
            "
          />
        </div>
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
                'font-extrabold text-gray-900':
                  getDateValue(date) === getDateValue(today),
                'bg-gray-800 text-white hover:bg-gray-800':
                  getDateValue(date) === dateValue,
              }"
              @click="
                () => {
                  selectDate(date)
                  togglePopover()
                }
              "
            >
              {{ date.getDate() }}
            </div>
          </div>
        </div>
        <div class="flex justify-end p-1">
          <Button
            :label="'Clear'"
            class="text-sm"
            @click="
              () => {
                selectDate(new Date(''))
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

import {
  getDate,
  getDateValue,
  getDatesAfter,
  getDaysInMonth,
} from '../utils/dates'

interface DatePickerProps {
  value?: string
  modelValue?: string
  placeholder?: string
  formatter?: (date: string) => string
  readonly?: boolean
  inputClass?: string | string[] | Record<string, string>
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  readonly: false,
  formatter: undefined,
})

const emit = defineEmits(['update:modelValue', 'change'])

const currentYear = ref<number>(0)
const currentMonth = ref<number>(0)

const today = computed(() => getDate())

const dates = computed(() => {
  if (!(currentYear.value && currentMonth.value)) {
    return []
  }
  const monthIndex = currentMonth.value - 1
  const year = currentYear.value

  const firstDayOfMonth = getDate(year, monthIndex, 1)
  const lastDayOfMonth = getDate(year, monthIndex + 1, 0)
  const leftPaddingCount = firstDayOfMonth.getDay()
  const rightPaddingCount = 6 - lastDayOfMonth.getDay()

  const leftPadding = getDatesAfter(firstDayOfMonth, -leftPaddingCount)
  const rightPadding = getDatesAfter(lastDayOfMonth, rightPaddingCount)
  const daysInMonth = getDaysInMonth(monthIndex, year)
  const datesInMonth = getDatesAfter(firstDayOfMonth, daysInMonth - 1)

  let dates = [
    ...leftPadding,
    firstDayOfMonth,
    ...datesInMonth,
    ...rightPadding,
  ]

  if (dates.length < 42) {
    const lastDate = dates.at(-1)
    if (lastDate) {
      const finalPadding = getDatesAfter(lastDate, 42 - dates.length)
      dates = dates.concat(...finalPadding)
    }
  }
  return dates
})

const datesAsWeeks = computed(() => {
  const datesAsWeeks: Date[][] = []
  const computedDates = dates.value.slice()
  while (computedDates.length) {
    const week = computedDates.splice(0, 7)
    datesAsWeeks.push(week)
  }
  return datesAsWeeks
})

const formattedMonth = computed(() => {
  if (!(currentYear.value && currentMonth.value)) {
    return ''
  }
  const date = getDate(currentYear.value, currentMonth.value - 1, 1)
  const month = date.toLocaleString('en-US', {
    month: 'long',
  })
  return `${month}, ${date.getFullYear()}`
})

const dateValue = computed(() => {
  return props.value ? props.value : props.modelValue
})

function selectDate(date: Date) {
  emit('change', getDateValue(date))
  emit('update:modelValue', getDateValue(date))
}

function prevMonth() {
  changeMonth(-1)
}

function nextMonth() {
  changeMonth(1)
}

function changeMonth(adder: number) {
  currentMonth.value = currentMonth.value + adder
  if (currentMonth.value < 1) {
    currentMonth.value = 12
    currentYear.value = currentYear.value - 1
  }
  if (currentMonth.value > 12) {
    currentMonth.value = 1
    currentYear.value = currentYear.value + 1
  }
}

function selectCurrentMonthYear() {
  let date = dateValue.value ? getDate(dateValue.value) : getDate()
  if (date.toString() === 'Invalid Date') {
    date = getDate()
  }
  currentYear.value = date.getFullYear()
  currentMonth.value = date.getMonth() + 1
}

onMounted(() => selectCurrentMonthYear())
</script>

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
              :key="toValue(date)"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50"
              :class="{
                'text-gray-400': date.getMonth() !== currentMonth - 1,
                'font-extrabold text-gray-900':
                  toValue(date) === toValue(today),
                'bg-gray-800 text-white hover:bg-gray-800':
                  toValue(date) === dateValue,
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
  emit('change', toValue(date))
  emit('update:modelValue', toValue(date))
}

type DateConstructorParam = string | number | Date

function getDate(...args: DateConstructorParam[]): Date {
  return new Date(...(args as [DateConstructorParam]))
}

function toValue(date: Date) {
  if (!date) {
    return ''
  }

  // toISOString is buggy and reduces the day by one
  // this is because it considers the UTC timestamp
  // in order to circumvent that we need to use luxon/moment
  // but that refactor could take some time, so fixing the time difference
  // as suggested in this answer.
  // https://stackoverflow.com/a/16084846/3541205
  date.setHours(0, -date.getTimezoneOffset(), 0, 0)
  return date.toISOString().slice(0, 10)
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

function getDatesAfter(date: Date, count: number) {
  let incrementer = 1
  if (count < 0) {
    incrementer = -1
    count = Math.abs(count)
  }
  const dates: Date[] = []

  while (count) {
    date = getDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + incrementer,
    )
    dates.push(date)
    count--
  }

  if (incrementer === -1) {
    return dates.reverse()
  }
  return dates
}

function getDaysInMonth(monthIndex: number, year: number) {
  const daysInMonthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const daysInMonth = daysInMonthMap[monthIndex]
  if (monthIndex === 1 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth
}

function isLeapYear(year: number) {
  if (year % 400 === 0) return true
  if (year % 100 === 0) return false
  if (year % 4 === 0) return true
  return false
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

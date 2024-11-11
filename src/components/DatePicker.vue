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

        <!-- Date Input -->
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

        <!-- Actions -->
        <div class="flex justify-end p-1">
          <Button
            :label="'Clear'"
            class="text-sm"
            @click="
              () => {
                selectDate('')
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
import { computed, onMounted } from 'vue'

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

function selectDate(date: Date | string) {
  emit('change', getDateValue(date))
  emit('update:modelValue', getDateValue(date))
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

<template>
  <Popover
    @open="selectCurrentMonthYear"
    class="flex w-full [&>div:first-child]:w-full"
    :placement="placement"
  >
    <template #target="{ togglePopover }">
      <TextInput
        readonly
        type="text"
        :placeholder="placeholder"
        :value="dateValue && formatter ? formatter(dateValue) : dateValue"
        @focus="!readonly ? togglePopover() : null"
        class="w-full"
        :class="inputClass"
        v-bind="$attrs"
      >
        <template #prefix v-if="$slots.prefix">
          <slot name="prefix" />
        </template>
      </TextInput>
    </template>

    <template #body="{ togglePopover }">
      <div
        class="w-fit select-none text-base text-ink-gray-9 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="marginClass"
      >
        <!-- Month Switcher -->
        <div class="flex items-center p-1 text-ink-gray-4">
          <Button variant="ghost" class="h-7 w-7" @click="prevMonth">
            <FeatherIcon
              :stroke-width="2"
              name="chevron-left"
              class="h-4 w-4"
            />
          </Button>
          <div class="flex-1 text-center text-base font-medium text-ink-gray-6">
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
                selectDate(getDate(), true)
                togglePopover()
              }
            "
          />
        </div>

        <!-- Calendar -->
        <div
          class="flex flex-col items-center justify-center p-1 text-ink-gray-8"
        >
          <div class="flex items-center text-xs uppercase">
            <div
              class="flex h-6 w-8 items-center justify-center text-center"
              v-for="(d, i) in ['s', 'm', 't', 'w', 't', 'f', 's']"
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
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-surface-gray-2"
              :class="{
                'text-ink-gray-3': date.getMonth() !== currentMonth - 1,
                'font-extrabold text-ink-gray-9':
                  getDateValue(date) === getDateValue(today),
                'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
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

import { Button } from '../Button'
import FeatherIcon from '../FeatherIcon.vue'
import { Popover } from '../Popover'
import { TextInput } from '../TextInput'

import { dayjsLocal } from '../../utils/dayjs'
import { useDatePicker } from './useDatePicker'
import { getDate, getDateValue } from './utils'

import type { DatePickerEmits, DatePickerProps } from './types'

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

const marginClass = computed(() => {
  let _marginClass = 'mt-2'
  if (props.placement?.startsWith('top')) {
    _marginClass = 'mb-2'
  } else if (props.placement?.startsWith('left')) {
    _marginClass = 'mr-2'
  } else if (props.placement?.startsWith('right')) {
    _marginClass = 'ml-2'
  }
  return _marginClass
})

const dateValue = computed(() => {
  return props.value ? props.value : props.modelValue
})

function selectDate(date: Date | string, isNow: boolean = false) {
  date = isNow ? dayjsLocal(date) : date
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

<template>
  <Popover
    ref="popoverRef"
    @open="selectCurrentMonthYear"
    class="flex w-full [&>div:first-child]:w-full"
    :placement="placement"
  >
    <template #target="{ togglePopover }">
      <TextInput
        readonly
        type="text"
        :placeholder="placeholder"
        :value="dateValue && formatter ? formatDates(dateValue) : dateValue"
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

        <!-- Date Range Inputs -->
        <div class="flex items-center justify-center gap-1 p-1">
          <TextInput class="w-28 text-sm" type="text" v-model="fromDate" />
          <TextInput class="w-28 text-sm" type="text" v-model="toDate" />
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
                'text-ink-gray-9': date.getMonth() === currentMonth - 1,
                'font-extrabold text-ink-gray-9':
                  getDateValue(date) === getDateValue(today),
                'rounded-none bg-surface-gray-3': isInRange(date),
                'rounded-l-md rounded-r-none bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
                  fromDate && getDateValue(date) === getDateValue(fromDate),
                'rounded-r-md bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
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
import { computed, onMounted, ref } from 'vue'

import { Popover } from '../Popover'
import { TextInput } from '../TextInput'

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

const fromDate = ref<string>('')
const toDate = ref<string>('')

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

function formatDates(value: string | string[]) {
  if (!value) return ''

  if (typeof value === 'string') {
    value = value.split(',')
  }

  return props.formatter
    ? props.formatter(value[0]) + ' to ' + props.formatter(value[1])
    : value
}

function clearDates() {
  fromDate.value = ''
  toDate.value = ''
  selectDates()
}

const popoverRef = ref<InstanceType<typeof Popover>>()

onMounted(() => {
  let dates: string | string[] | undefined =
    typeof dateValue?.value === 'string'
      ? dateValue.value.split(',')
      : dateValue.value
  fromDate.value = dates?.[0] || ''
  toDate.value = dates?.[1] || ''

  selectCurrentMonthYear()
})

defineExpose({
  open: () => {
    popoverRef.value?.open()
  },
})
</script>

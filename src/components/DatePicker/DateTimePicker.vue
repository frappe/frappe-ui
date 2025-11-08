<template>
  <Popover
    class="inline-block"
    :placement="placement"
    @open="initFromValue"
    @close="handleClose"
  >
    <template #target="{ togglePopover, isOpen }">
      <slot
        name="target"
        v-bind="{ togglePopover, isOpen, displayLabel, inputValue }"
      >
        <TextInput
          v-model="inputValue"
          type="text"
          class="cursor-text w-full"
          :class="props.inputClass"
          :label="props.label"
          :variant="props.variant"
          :placeholder="props.placeholder || 'Select date & time'"
          :disabled="props.disabled"
          :readonly="props.readonly || !props.allowCustom"
          @focus="activateInput(isOpen, togglePopover)"
          @click="activateInput(isOpen, togglePopover)"
          @blur="onBlur"
          @keydown.enter.prevent="onEnter(togglePopover)"
        >
          <template v-if="$slots.prefix" #prefix>
            <slot
              name="prefix"
              v-bind="{ togglePopover, isOpen, displayLabel, inputValue }"
            />
          </template>
          <template #suffix>
            <slot
              name="suffix"
              v-bind="{ togglePopover, isOpen, displayLabel, inputValue }"
            >
              <FeatherIcon
                name="chevron-down"
                class="h-4 w-4 cursor-pointer"
                @mousedown.prevent="togglePopover"
              />
            </slot>
          </template>
        </TextInput>
      </slot>
    </template>

    <template #body="{ togglePopover }">
      <div
        ref="popoverContentRef"
        class="w-fit min-w-60 select-none text-base text-ink-gray-9 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 mt-2"
      >
        <!-- Header (Month/Year navigation) -->
        <div class="flex items-center justify-between p-2 pb-0 gap-1">
          <Button
            variant="ghost"
            size="sm"
            class="text-sm font-medium text-ink-gray-7"
            @click="cycleView"
          >
            <span v-if="view === 'date'"
              >{{ months[currentMonth] }} {{ currentYear }}</span
            >
            <span v-else-if="view === 'month'">{{ currentYear }}</span>
            <span v-else>{{ yearRangeStart }} - {{ yearRangeStart + 11 }}</span>
          </Button>
          <div class="flex items-center">
            <Button
              variant="ghost"
              icon="chevron-left"
              class="size-7"
              @click="prev"
            />
            <Button
              v-if="!clearable"
              variant="ghost"
              class="text-xs"
              :label="'Now'"
              @click="() => handleNowClick(togglePopover)"
            />
            <Button
              variant="ghost"
              icon="chevron-right"
              class="size-7"
              @click="next"
            />
          </div>
        </div>

        <!-- Calendar -->
        <div class="p-2">
          <div v-if="view === 'date'" role="grid" aria-label="Calendar dates">
            <div
              class="flex items-center text-xs font-medium uppercase text-ink-gray-4 mb-1"
            >
              <div
                v-for="d in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
                :key="d"
                class="flex h-6 w-8 items-center justify-center"
              >
                {{ d }}
              </div>
            </div>
            <div v-for="(week, wi) in weeks" :key="wi" class="flex" role="row">
              <button
                v-for="dateObj in week"
                type="button"
                :key="dateObj.key"
                class="flex h-8 w-8 items-center justify-center rounded cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-outline-gray-2"
                :class="[
                  dateObj.inMonth ? 'text-ink-gray-8' : 'text-ink-gray-3',
                  dateObj.isToday ? 'font-extrabold text-ink-gray-9' : '',
                  dateObj.disabled
                    ? 'opacity-30 cursor-not-allowed hover:bg-transparent'
                    : dateObj.isSelected
                      ? 'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6'
                      : 'hover:bg-surface-gray-2',
                ]"
                role="gridcell"
                :aria-selected="dateObj.isSelected ? 'true' : 'false'"
                :aria-label="
                  dateObj.date.format('YYYY-MM-DD') +
                  (dateObj.isToday ? ' (Today)' : '')
                "
                :disabled="dateObj.disabled"
                @click="
                  !dateObj.disabled &&
                    handleDateCellClick(dateObj.date, togglePopover)
                "
              >
                {{ dateObj.date.date() }}
              </button>
            </div>
          </div>
          <div
            v-else-if="view === 'month'"
            class="grid grid-cols-3 gap-1"
            role="grid"
            aria-label="Select month"
          >
            <button
              v-for="(m, i) in months"
              type="button"
              :key="m"
              class="py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6"
              :class="{
                'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
                  i === currentMonth,
              }"
              :aria-selected="i === currentMonth ? 'true' : 'false'"
              @click="selectMonth(i)"
            >
              {{ m.slice(0, 3) }}
            </button>
          </div>
          <div
            v-else
            class="grid grid-cols-3 gap-1"
            role="grid"
            aria-label="Select year"
          >
            <button
              v-for="y in yearRange"
              type="button"
              :key="y"
              class="py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6"
              :class="{
                'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6':
                  y === currentYear,
              }"
              :aria-selected="y === currentYear ? 'true' : 'false'"
              @click="selectYear(y)"
            >
              {{ y }}
            </button>
          </div>
        </div>

        <!-- Time Picker Section -->
        <div class="flex flex-col gap-2 p-2 pt-0">
          <TimePicker
            :value="timeValue"
            :allowCustom="props.allowCustomTime"
            :placement="'bottom-start'"
            placeholder="Select time"
            :minTime="computedMinTime"
            :maxTime="computedMaxTime"
            @change="onTimeChange"
          />
        </div>

        <!-- Footer Actions (clearable variant) -->
        <div
          v-if="props.clearable"
          class="flex items-center justify-between gap-1 p-2 border-t"
        >
          <div class="flex gap-1">
            <Button
              variant="outline"
              :label="'Now'"
              @click="() => handleNowClick(togglePopover)"
            />
            <Button
              variant="outline"
              :label="'Tomorrow'"
              @click="() => handleTomorrowClick()"
            />
          </div>
          <Button
            v-if="selectedDate"
            size="sm"
            variant="outline"
            :label="'Clear'"
            @click="() => handleClearClick(togglePopover)"
          />
        </div>
      </div>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs } from 'vue'
import { Popover } from '../Popover'
import { Button } from '../Button'
import { TextInput } from '../TextInput'
// @ts-ignore - Vue SFC without explicit types
import FeatherIcon from '../FeatherIcon.vue'
import TimePicker from '../TimePicker/TimePicker.vue'
import { dayjs, dayjsLocal, dayjsSystem } from '../../utils/dayjs'
import { months, monthStart, generateWeeks, getDateValue } from './utils'
import type { Dayjs } from 'dayjs/esm'
import type {
  DatePickerProps,
  DatePickerEmits,
  DatePickerViewMode as ViewMode,
} from './types'

interface ExtraDateTimeProps {
  minDateTime?: string
  maxDateTime?: string
  allowCustomTime?: boolean
}

const props = withDefaults(
  defineProps<DatePickerProps & ExtraDateTimeProps>(),
  {
    value: '',
    modelValue: '',
    placement: 'bottom-start',
    variant: 'subtle',
    placeholder: 'Select date & time',
    readonly: false,
    allowCustom: true,
    autoClose: true,
    disabled: false,
    clearable: true,
    allowCustomTime: true,
  },
)
const emit = defineEmits<DatePickerEmits>()

const { autoClose } = toRefs(props)

const view = ref<ViewMode>('date')
const currentYear = ref<number>(dayjs().year())
const currentMonth = ref<number>(dayjs().month())
const DATE_FORMAT = 'YYYY-MM-DD'
const DATE_TIME_FORMAT = 'YYYY-MM-DD h:mm a'

const selectedDate = ref<string>('') // YYYY-MM-DD
const timeValue = ref<string>('') // HH:mm:ss

const initialValue = ref(props.modelValue || props.value || '')

function coerceDateTime(val?: string | null): Dayjs | null {
  if (!val) return null
  const raw = String(val).trim()
  if (!raw) return null

  if (props.format) {
    const dStrict = dayjs(raw, props.format, true)
    if (dStrict.isValid()) return dStrict
  }

  const dLoose = dayjsLocal(raw)
  if (dLoose.isValid()) return dLoose

  const normalized = getDateValue(raw)
  if (normalized) {
    const dNorm = dayjsLocal(normalized)
    if (dNorm.isValid()) return dNorm
  }
  return null
}

function syncFromValue(val?: string): void {
  if (!val) {
    if (!props.clearable) {
      const now = dayjsLocal()
      currentYear.value = now.year()
      currentMonth.value = now.month()
      selectedDate.value = now.format(DATE_FORMAT)
      timeValue.value = now.format('HH:mm:ss')
    } else {
      selectedDate.value = ''
      timeValue.value = ''
    }
    return
  }
  const d = coerceDateTime(val)
  if (!d) {
    selectedDate.value = ''
    timeValue.value = ''
    return
  }
  currentYear.value = d.year()
  currentMonth.value = d.month()
  selectedDate.value = d.format(DATE_FORMAT)
  timeValue.value = d.format('HH:mm:ss')
}

syncFromValue(initialValue.value)

function initFromValue(): void {
  syncFromValue(props.modelValue || props.value)
}

watch(
  () => [props.modelValue, props.value],
  ([m, v]) => {
    const val = m || v
    syncFromValue(val)
  },
)

const combinedValue = computed<string>(() => {
  if (!selectedDate.value) return ''
  const base = `${selectedDate.value} ${timeValue.value || '00:00:00'}`
  const local = dayjs(base)
  if (!local.isValid()) return ''
  return local.format(DATE_TIME_FORMAT)
})

const displayLabel = computed<string>(() => {
  if (!combinedValue.value) return ''
  if (props.format) return dayjs(combinedValue.value).format(props.format)
  return combinedValue.value
})

const inputValue = ref<string>(displayLabel.value)
const isTyping = ref(false)
watch(displayLabel, (val) => {
  if (!isTyping.value) inputValue.value = val
})

function maybeClose(togglePopover?: () => void, condition = true) {
  if (condition && autoClose.value && togglePopover) togglePopover()
}

function clearSelection() {
  if (!selectedDate.value && !timeValue.value) return
  selectedDate.value = ''
  timeValue.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  initialValue.value = ''
  inputValue.value = ''
}

function commitInput(close = false, togglePopover?: () => void): void {
  const raw = inputValue.value.trim()
  if (!raw) {
    if (!props.clearable) {
      const now = dayjsLocal()
      selectDate(now)
      timeValue.value = now.format('HH:mm:ss')
      emitChange()
      maybeClose(togglePopover, close)
    } else {
      clearSelection()
      maybeClose(togglePopover, close)
    }
    return
  }
  const parsed = coerceDateTime(raw)
  if (parsed) {
    selectDate(parsed)
    timeValue.value = parsed.format('HH:mm:ss')
    emitChange()
    maybeClose(togglePopover, close)
  }
}

const popoverContentRef = ref<HTMLElement | null>(null)
function onBlur(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (next && popoverContentRef.value?.contains(next)) return
  commitInput()
  isTyping.value = false
}
function onEnter(togglePopover: () => void) {
  commitInput(true, togglePopover)
  isTyping.value = false
}
function activateInput(isOpen: boolean | undefined, togglePopover: () => void) {
  isTyping.value = true
  if (!isOpen) togglePopover()
}

const minDT = computed<Dayjs | null>(() =>
  props.minDateTime ? coerceDateTime(props.minDateTime) : null,
)
const maxDT = computed<Dayjs | null>(() =>
  props.maxDateTime ? coerceDateTime(props.maxDateTime) : null,
)

function dateDisabled(d: Dayjs): boolean {
  if (minDT.value && d.endOf('day').isBefore(minDT.value)) return true
  if (maxDT.value && d.startOf('day').isAfter(maxDT.value)) return true
  return false
}

const weeks = computed<any[][]>(() => {
  const base = generateWeeks(
    currentYear.value,
    currentMonth.value,
    selectedDate.value,
  )
  return base.map((week) =>
    week.map((obj) => ({ ...obj, disabled: dateDisabled(obj.date) })),
  )
})

const computedMinTime = computed<string>(() => {
  if (!minDT.value || !selectedDate.value) return ''
  if (dayjs(selectedDate.value).isSame(minDT.value, 'day'))
    return minDT.value.format('HH:mm:ss')
  return ''
})
const computedMaxTime = computed<string>(() => {
  if (!maxDT.value || !selectedDate.value) return ''
  if (dayjs(selectedDate.value).isSame(maxDT.value, 'day'))
    return maxDT.value.format('HH:mm:ss')
  return ''
})

watch([computedMinTime, computedMaxTime, timeValue, selectedDate], () => {
  if (!selectedDate.value || !timeValue.value) return
  const cur = dayjs(`${selectedDate.value} ${timeValue.value}`)
  if (minDT.value && cur.isBefore(minDT.value))
    timeValue.value = computedMinTime.value || timeValue.value
  if (maxDT.value && cur.isAfter(maxDT.value))
    timeValue.value = computedMaxTime.value || timeValue.value
})

function selectDate(date: string | Date | Dayjs): void {
  const d = dayjs(date as any)
  if (!d.isValid()) return
  if (dateDisabled(d)) return
  selectedDate.value = d.format(DATE_FORMAT)
  currentYear.value = d.year()
  currentMonth.value = d.month()
}
function selectMonth(i: number): void {
  currentMonth.value = i
  view.value = 'date'
}
function selectYear(y: number): void {
  currentYear.value = y
  view.value = 'month'
}
function prev(): void {
  if (view.value === 'date') {
    const m = monthStart(currentYear.value, currentMonth.value).subtract(
      1,
      'month',
    )
    currentYear.value = m.year()
    currentMonth.value = m.month()
  } else if (view.value === 'month') currentYear.value -= 1
  else currentYear.value -= 12
}
function next(): void {
  if (view.value === 'date') {
    const m = monthStart(currentYear.value, currentMonth.value).add(1, 'month')
    currentYear.value = m.year()
    currentMonth.value = m.month()
  } else if (view.value === 'month') currentYear.value += 1
  else currentYear.value += 12
}
function handleDateCellClick(
  date: string | Date | Dayjs,
  togglePopover: () => void,
) {
  selectDate(date)
  emitChange(true, togglePopover)
  isTyping.value = false
  view.value = 'date'
}

function onTimeChange(val: string) {
  timeValue.value = val
  isTyping.value = false
  if (selectedDate.value) emitChange()
}

function emitChange(close = false, togglePopover?: () => void) {
  if (!selectedDate.value) {
    clearSelection()
    return
  }

  const localDateTime = combinedValue.value
  const systemDateTime = dayjsSystem(localDateTime).format(DATE_TIME_FORMAT)

  if (systemDateTime !== initialValue.value) {
    emit('update:modelValue', systemDateTime)
    emit('change', systemDateTime)
    initialValue.value = systemDateTime
  }

  if (!isTyping.value) inputValue.value = displayLabel.value
  maybeClose(togglePopover, close)
}

function handleNowClick(togglePopover: () => void) {
  const now = dayjsLocal()
  selectDate(now)
  timeValue.value = now.format('HH:mm:ss')
  emitChange(true, togglePopover)
  isTyping.value = false
}
function handleTomorrowClick() {
  const tomorrow = dayjsLocal().add(1, 'day')
  selectDate(tomorrow)
  // keep current time value if any, else set to now's time
  if (!timeValue.value) timeValue.value = dayjsLocal().format('HH:mm:ss')
  emitChange()
  isTyping.value = false
}
function handleClearClick(togglePopover: () => void) {
  clearSelection()
  maybeClose(togglePopover)
  isTyping.value = false
  view.value = 'date'
}

function cycleView(): void {
  if (view.value === 'date') view.value = 'month'
  else if (view.value === 'month') view.value = 'year'
  else view.value = 'date'
}
function handleClose() {
  view.value = 'date'
  if (isTyping.value) {
    commitInput()
    isTyping.value = false
  }
}

const yearRangeStart = computed(
  () => currentYear.value - (currentYear.value % 12),
)
const yearRange = computed<number[]>(() =>
  Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i),
)
</script>
